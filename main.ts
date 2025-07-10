import { Hono } from "hono";
import { listAllFeatures } from "./endpoints/features.ts";
import { minBrowserVersion } from "./endpoints/min-browser-version-for-feature.ts";

const app = new Hono();

if (Deno.env.get("DEBUG") !== "true") {
    app.use("*", (c, next) => {
        c.header("Access-Control-Allow-Origin", "*");
        c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        c.header("Access-Control-Expose-Headers", "Content-Type, Authorization");
        c.header("Access-Control-Allow-Credentials", "true");

        c.header(
            "Content-Security-Policy",
            "default-src 'none'; img-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self';",
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
//app.onError((err, c) => {
//    console.error(`error throwing returning image ${err}`)
//    return c.body(
//        `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="30">
//            <rect width="800" height="600" fill="#f0f0f0" stroke="#ccc"/>
//            <text x="10" y="20" font-family="Arial" font-size="16" fill="#333">Error ${err.message}</text>
//        </svg>`,
//        500,
//        { 'Content-Type': 'image/svg+xml' }
//    );
// });

// http://localhost:8000/min-browser-version?features=AmbientLightSensor&filter=chrome&filter=firefox

app.get("/all-features", listAllFeatures);
app.get("/min-browser-version", minBrowserVersion);

Deno.serve({
    hostname: "0.0.0.0",
    port: 8000,
}, app.fetch);
