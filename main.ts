import { Hono } from "hono";
import { listAllFeatures } from "./endpoints/features.ts";
import { minBrowserVersion } from "./endpoints/min-browser-version-for-feature.ts";
import { RenderError } from "./rendering/error.tsx";

const app = new Hono();

if (Deno.env.get("DEBUG") !== "true") {
    app.use("*", (c, next) => {
        c.header("Access-Control-Allow-Origin", "*");
        c.header("Access-Control-Allow-Methods", "GET");
        c.header("Access-Control-Allow-Headers", "Content-Type");
        c.header("Access-Control-Expose-Headers", "Content-Type");
        c.header("Access-Control-Allow-Credentials", "false");

        c.header(
            "Content-Security-Policy",
            "default-src 'none'; img-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self' data:;",
        );
        c.header("X-Content-Type-Options", "nosniff");
        c.header("X-Frame-Options", "DENY");
        c.header("X-XSS-Protection", "1; mode=block");
        c.header("Cache-Control", `public, max-age=${60 * 60 * 24}`); // 1 day
        return next();
    });
} else {
    console.log("Debug mode is enabled. CORS headers will not be set.");
}

app.onError((err, c) => {
    console.error(`error throwing returning image ${err}`);
    return c.body(
        RenderError({ error: err.message }),
        500,
        { "Content-Type": "image/svg+xml" },
    );
});

app.notFound((c) => {
    return c.body(
        RenderError({
            error:
                "The requested resource was not found. use /min-browser-version to get a badge for a specific feature.",
        }),
        404,
        { "Content-Type": "image/svg+xml" },
    );
});

app.get("/all-features", listAllFeatures);
app.get("/min-browser-version", minBrowserVersion);
app.get("/", (c) => {
    return c.text(
        `Welcome to the Can I Use Embed API.
Use /all-features to get a list of all features.
Use /min-browser-version?features=FEATURE_NAME&filter=FILTER_NAME to get the minimum browser version for a specific feature.
Example: /min-browser-version?features=api:navigator:serviceworker&filter=chrome

for documentation visit: https://github.com/K0IN/can-i-use-embed`,
        200,
        { "Content-Type": "text/plain" },
    );
});

Deno.serve({
    hostname: "0.0.0.0",
    port: 8000,
}, app.fetch);
