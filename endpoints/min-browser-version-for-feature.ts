import { Context } from "hono";
import { getLowestVersionForFeatures } from "../caniuse/browsercompat.ts";
import { RenderBadge } from "../rendering/badge.tsx";
import { filterResult, getBrowserIcon, getBrowserName } from "../mappings.ts";
import { faQuestion } from "fa-solid";

export function minBrowserVersion(context: Context) {
    // const { displayMode } = c.req.param();

    const { features, filter } = context.req.queries();
    if (!features || features.length === 0) {
        return context.body(
            "Feature parameter is required. Please provide at least one feature to check. Example: ?features=AbortController",
            400,
            { "Content-Type": "text/plain" },
        );
    }

    const allVersions = getLowestVersionForFeatures(features);
    const filteredVersions = filterResult(Array.isArray(filter) ? filter : [filter], allVersions);

    if (filteredVersions.length === 0) {
        const filterArray = Array.isArray(filter) ? filter : [filter];
        return context.body(
            `Invalid filter "${
                filterArray.join(", ")
            }". Or the filter did not match any browsers. Please provide a valid browser filter.`,
            400,
            { "Content-Type": "text/plain" },
        );
    }

    const svgContent = RenderBadge({
        browsers: filteredVersions
            .map((e) => ({
                browserName: getBrowserName(e.browser),
                icon: getBrowserIcon(e.browser) ?? faQuestion,
                ...(e.isSupported && !e.isBehindFlag
                    ? {
                        version: e.minimumVersion.major.toString(),
                        isChecked: true as const,
                    }
                    : {
                        isChecked: false as const,
                    }),
            })),
        rendering: { vertical: true },
    });

    return context.body(svgContent, 200, { "Content-Type": "image/svg+xml" });
}
