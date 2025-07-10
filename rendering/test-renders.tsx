import * as path from "@std/path";
import { RenderBadge } from "./badge.tsx";
import { faChrome, faFirefox, faSafari } from "fa-brands";

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
}
