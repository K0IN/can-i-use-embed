import browserCompatData from "browser-compat-data" with { type: "json" };
import type { CompatStatement, Identifier, SupportStatement } from "./compat.d.ts";
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

function findFeatureData(feature: string): { featureKey: string; compatData: CompatStatement } {
    const data = (browserCompatData as Record<string, unknown>)["api"] as Identifier;
    const normalizedFeature = feature.toLowerCase();
    const featureKey = Object.keys(data).find((key) => key.toLowerCase() === normalizedFeature);

    if (!data || !featureKey || !data[featureKey] || !data[featureKey].__compat) {
        throw new Error(`Feature "${feature}" not found in browser compatibility data.`);
    }

    return {
        featureKey,
        compatData: data[featureKey].__compat,
    };
}

function findFeatureSupport(
    versions: SupportStatement | undefined,
): MinimumBrowserVersion {
    const versionsAsArray = Array.isArray(versions) ? versions : [versions];
    let currentStatus = {
        browser: "unknown" as BrowserName,
        isSupported: false,
    } as MinimumBrowserVersion;

    for (const version of versionsAsArray) {
        if (!version) { continue; }

        if (version.version_removed) {
            // it is no longer supported
            // now we check the last version we knew
            if (
                currentStatus.isSupported &&
                currentStatus.minimumVersion.isNewerThan(Version.parse(version.version_removed))
            ) {
                continue;
            }
            currentStatus = {
                browser: "unknown" as BrowserName,
                isSupported: false,
            };
        } else if (version.version_added) {
            // it is already supported, we use the oldest version
            if (
                currentStatus.isSupported &&
                Version.parse(version.version_added).isNewerThan(currentStatus.minimumVersion)
            ) {
                continue;
            }

            currentStatus = {
                isSupported: true,
                browser: "unknown" as BrowserName,
                minimumVersion: Version.parse(version.version_added),
                partialSupport: !!version.partial_implementation,
                isBehindFlag: !!(version.flags && version.flags.length > 0),
            };
        }
    }

    return currentStatus;
}

export function getLowestVersionForFeature(
    feature: string,
): Array<MinimumBrowserVersion> {
    const { compatData } = findFeatureData(feature);
    const currentStatus: Array<MinimumBrowserVersion> = [];

    for (const [browser, versions] of Object.entries(compatData.support || {})) {
        const statusForBrowser: MinimumBrowserVersion = {
            ...findFeatureSupport(versions),
            browser: browser as BrowserName,
        };
        currentStatus.push(statusForBrowser);
    }

    return currentStatus;
}

function mergeBrowserSupport(versionInfo: MinimumBrowserVersion[]): MinimumBrowserVersion {
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

// const result = getLowestVersionForFeatures([
//     "AmbientLightSensor",
//     "ServiceWorker",
//     "AbortSignal",
// ]);
// console.log(result);

export function getListOfFeatures(): string[] {
    const data = (browserCompatData as Record<string, unknown>)["api"] as Identifier;
    if (!data) {
        throw new Error("Browser compatibility data not found.");
    }
    const features = Object.keys(data).map((feature) => feature.toLowerCase());

    return features;
}
