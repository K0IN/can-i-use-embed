import rawBrowserCompatData from "browser-compat-data" with { type: "json" };
import type { CompatStatement, SimpleSupportStatement, SupportStatement } from "./compat.d.ts";
import { BrowserName } from "../mappings.ts";
import { Version } from "./version.ts";

export type MinimumBrowserVersion =
    & {
        browser: BrowserName;
    }
    & (
        {
            isSupported: true;
            minimumVersion: Version;
            partialSupport: boolean;
            isBehindFlag: boolean;
        } | {
            isSupported: false;
        }
    );

function isFeatureData(data: unknown): data is CompatStatement {
    return (
        data !== null && typeof data === "object" &&
        /*"mdn_url" in data && */
        /*"source_file" in data && */
        /* "spec_url" in data && */
        /* "status" in data && */
        "support" in data
        /*"tags" in data*/
    );
}

function findAllFeaturesRecursive(data: unknown, path = ""): Array<{ path: string; feature: CompatStatement }> {
    const result: Array<{ path: string; feature: CompatStatement }> = [];
    if (!data || typeof data !== "object") {
        return result; // Return empty if data is not an object
    }

    if (isFeatureData(data)) {
        // If the data is a feature, return it directly
        return [{ path, feature: data }];
    }

    for (const [key, value] of Object.entries(data)) {
        if (key === "__meta" || !value) {
            continue;
        }

        if (typeof value === "object" && !Array.isArray(value)) {
            if (isFeatureData(value)) {
                // If the value has a support property, it is a feature
                result.push({ path, feature: value });
            } else {
                const newPath = path ? `${path}:${key}` : key;
                result.push(...findAllFeaturesRecursive(value, newPath));
            }
        }
    }

    return result;
}

const browserCompatData = Object.fromEntries(
    findAllFeaturesRecursive(rawBrowserCompatData)
        .map(({ path, feature }) => [path, feature]),
);

function findFeatureData(feature: string): { featureKey: string; compatData: CompatStatement } {
    const data = browserCompatData;

    const normalizedFeature = feature.toLowerCase();
    const featureKey = Object.keys(data).find((key) => key.toLowerCase() === normalizedFeature);

    if (!data || !featureKey || !data[featureKey]) {
        throw new Error(`Feature "${feature}" not found in browser compatibility data.`);
    }

    return {
        featureKey,
        compatData: data[featureKey],
    };
}

export function getVersionForSimpleSupportStatement(
    version: SimpleSupportStatement,
) {
    if (version.version_removed) {
        return Version.parse(version.version_removed);
    }
    return Version.parse(version.version_added);
}

export function findFeatureSupport(
    versions: SupportStatement,
): MinimumBrowserVersion {
    const versionsAsArray = Array.isArray(versions) ? versions : [versions];
    // let currentStatus = {
    //     browser: "unknown" as BrowserName,
    //     isSupported: false,
    // } as MinimumBrowserVersion;

    // let currentVersion = new Version(0, 0, 0);

    if (versionsAsArray.length === 0) {
        throw new Error("No versions provided for feature support check.");
    }

    const orderedByVersion = versionsAsArray
        .sort((a, b) => {
            if (!a) {
                return 1;
            }
            if (!b) {
                return -1;
            }

            const aVersion = getVersionForSimpleSupportStatement(a);
            const bVersion = getVersionForSimpleSupportStatement(b);
            if (aVersion.isEqualTo(bVersion)) {
                return a.version_removed ? 1 : -1; // Prefer versions that are not removed
            }
            if (!aVersion || !bVersion) {
                return 0;
            }

            return aVersion.isNewerThan(bVersion) ? 1 : -1;
        });

    const lastRemoveStatementIndex = orderedByVersion
        .findLastIndex((version) => Boolean(version.version_removed));

    if (lastRemoveStatementIndex === -1) {
        const oldestPossibleVersion = orderedByVersion[0];
        if (!oldestPossibleVersion) {
            throw new Error("No valid version found in support statements.");
        }

        if (!oldestPossibleVersion.version_added) {
            return {
                isSupported: false,
                browser: "unknown" as BrowserName,
            };
        }

        return {
            isSupported: true,
            browser: "unknown" as BrowserName,
            minimumVersion: Version.parse(oldestPossibleVersion.version_added),
            partialSupport: !!oldestPossibleVersion.partial_implementation,
            isBehindFlag: !!(oldestPossibleVersion.flags && oldestPossibleVersion.flags.length > 0),
        };
    }

    if (lastRemoveStatementIndex === orderedByVersion.length - 1) {
        const lastVersion = orderedByVersion[lastRemoveStatementIndex];
        if (!lastVersion) {
            throw new Error("No valid version found in support statements.");
        }

        return {
            isSupported: false,
            browser: "unknown" as BrowserName,
        };
    }

    const oldestPossibleVersion = orderedByVersion[lastRemoveStatementIndex + 1];
    if (!oldestPossibleVersion) {
        throw new Error("No valid version found in support statements.");
    }
    if (!oldestPossibleVersion.version_added) {
        return {
            isSupported: false,
            browser: "unknown" as BrowserName,
        };
    }
    return {
        isSupported: true,
        browser: "unknown" as BrowserName,
        minimumVersion: Version.parse(oldestPossibleVersion.version_added),
        partialSupport: !!oldestPossibleVersion.partial_implementation,
        isBehindFlag: !!(oldestPossibleVersion.flags && oldestPossibleVersion.flags.length > 0),
    };
}

export function getLowestVersionForFeature(
    feature: string,
): Array<MinimumBrowserVersion> {
    const { compatData } = findFeatureData(feature);
    const currentStatus: Array<MinimumBrowserVersion> = [];

    for (const [browser, versions] of Object.entries(compatData.support || {})) {
        if (!versions) {
            throw new Error(`No versions found for browser "${browser}" in feature "${feature}".`);
        }

        const statusForBrowser: MinimumBrowserVersion = {
            ...findFeatureSupport(versions),
            browser: browser as BrowserName,
        };
        currentStatus.push(statusForBrowser);
    }

    return currentStatus;
}

getLowestVersionForFeature("api:ambientlightsensor");

function mergeBrowserSupport(versionInfo: MinimumBrowserVersion[]): MinimumBrowserVersion {
    if (versionInfo.length === 0) {
        throw new Error("Cannot merge empty browser support array");
    }

    let lowestVersion = new Version(0, 0, 0);
    let isSupported = false;
    let partialSupport = false;
    let isBehindFlag = false;

    for (const info of versionInfo) {
        if (info.isSupported) {
            isSupported = true;
            if (info.minimumVersion.isNewerThan(lowestVersion)) {
                lowestVersion = info.minimumVersion;
            }

            partialSupport ||= info.partialSupport;
            isBehindFlag ||= info.isBehindFlag;
        } else {
            return {
                browser: info.browser,
                isSupported: false,
            };
        }
    }

    return {
        browser: versionInfo[0].browser as BrowserName,
        isSupported,
        minimumVersion: lowestVersion,
        partialSupport,
        isBehindFlag,
    } as MinimumBrowserVersion;
}

export function getLowestVersionForFeatures(feature: string[]): Array<MinimumBrowserVersion> {
    const featuresData = feature.map((f) => getLowestVersionForFeature(f));
    const allBrowserNames = Array.from(new Set(featuresData.flatMap((data) => data.map((info) => info.browser))));

    const allBrowsers: Record<BrowserName[number], MinimumBrowserVersion> = Object.fromEntries(
        allBrowserNames.map((browser) => [
            browser,
            {
                browser,
                isSupported: false,
            },
        ]),
    );

    for (const browserName of allBrowserNames) {
        const allFeatureData = featuresData
            .map((data) => data.find((info) => info.browser === browserName));

        if (
            allFeatureData.length === 0 ||
            allFeatureData.some((info) => !info || !info.isSupported)
        ) {
            continue; // Some Features are not supported
        }

        allBrowsers[browserName] = mergeBrowserSupport(
            allFeatureData.filter(Boolean) as MinimumBrowserVersion[],
        );
    }

    return Object.values(allBrowsers).map((browserInfo) => browserInfo);
}

export function getListOfFeatures(): string[] {
    const features = Object.keys(browserCompatData).map((feature) => feature.toLowerCase());
    return features;
}

export function getAllFeatures() {
    return browserCompatData;
}
