import * as path from "@std/path";
import { RenderBadge } from "./badge.tsx";
import { faChrome, faFirefox, faSafari } from "fa-brands";
import { RenderError } from "./error.tsx";

if (import.meta.main) {
    {
        const svgString = RenderBadge({
            browsers: [
                {
                    icon: faChrome,
                    browserName: "Chrome",
                    version: "351",
                    isChecked: true,
                },
                {
                    icon: faFirefox,
                    browserName: "Firefox",
                    version: "86",
                    isChecked: true,
                },
                {
                    icon: faSafari,
                    browserName: "Safari",
                    isChecked: false,
                },
                {
                    icon: faChrome,
                    browserName: "Chrome Android",
                    version: "351",
                    isChecked: true,
                },
            ],
        });
        await Deno.writeFile(
            path.join(import.meta.dirname ?? "", "RenderBadge.svg"),
            new TextEncoder().encode(svgString),
        );
    }
    {
        const svgString = RenderError({
            error: "Loading the data failed and now im  here thanks test 123.",
        });
        await Deno.writeFile(
            path.join(import.meta.dirname ?? "", "RenderError.svg"),
            new TextEncoder().encode(svgString),
        );
    }
}
