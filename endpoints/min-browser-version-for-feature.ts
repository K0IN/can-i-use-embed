import { Context } from "hono";
import { getLowestVersionForFeatures, MinimumBrowserVersion } from "../caniuse/browsercompat.ts";
import { RenderBadge } from "../rendering/badge.tsx";
import { BrowserName, getBrowserFilter, getBrowserIcon, getBrowserName } from "../mappings.ts";
import { faQuestion } from "fa-solid";

function filterResult(rawFilter: Array<string | undefined>, result: MinimumBrowserVersion[]): MinimumBrowserVersion[] {
    const filters = rawFilter
        .map((f) => f?.toLowerCase())
        .filter((f) => f !== undefined && f.length > 0) as string[];

    if (filters.length === 0) {
        return result;
    }

    const allowedBrowsers: BrowserName[] = [];
    for (const filter of filters) {
        const browserFilter = getBrowserFilter(filter);
        if (browserFilter) {
            allowedBrowsers.push(...browserFilter);
        }
    }

    const uniqueFeatures = new Set(allowedBrowsers.map((b) => b.toLowerCase()));

    if (uniqueFeatures.size === 0) {
        return [];
    }

    return result
        .filter((e) => uniqueFeatures.has(e.browser.toLowerCase()));
}

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
