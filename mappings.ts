import {
    faAndroid,
    faApple,
    faChrome,
    faEdge,
    faFirefox,
    faInternetExplorer,
    faNodeJs,
    faOpera,
    faSafari,
    IconDefinition,
} from "fa-brands";
import { faMobileAlt, faVrCardboard } from "fa-solid";
import { MinimumBrowserVersion } from "./caniuse/browsercompat.ts";

export type BrowserName =
    | "chrome"
    | "chrome_android"
    | "deno"
    | "edge"
    | "firefox"
    | "firefox_android"
    | "ie"
    | "nodejs"
    | "oculus"
    | "opera"
    | "opera_android"
    | "safari"
    | "safari_ios"
    | "samsunginternet_android"
    | "webview_android"
    | "webview_ios";

const browserNames: Record<BrowserName, string> = {
    chrome: "Chrome",
    chrome_android: "Chrome Android",
    deno: "Deno",
    edge: "Edge",
    firefox: "Firefox",
    firefox_android: "Firefox Android",
    ie: "Internet Explorer",
    nodejs: "Node.js",
    oculus: "Oculus Browser",
    opera: "Opera",
    opera_android: "Opera Android",
    safari: "Safari",
    safari_ios: "Safari iOS",
    samsunginternet_android: "Samsung Internet",
    webview_android: "Android WebView",
    webview_ios: "iOS WebView",
};

const browserIcons: Record<BrowserName, IconDefinition | undefined> = {
    chrome: faChrome,
    chrome_android: faChrome,
    deno: undefined,
    edge: faEdge,
    firefox: faFirefox,
    firefox_android: faFirefox,
    ie: faInternetExplorer,
    nodejs: faNodeJs,
    oculus: faVrCardboard,
    opera: faOpera,
    opera_android: faOpera,
    safari: faSafari,
    safari_ios: faSafari,
    samsunginternet_android: faMobileAlt,
    webview_android: faAndroid,
    webview_ios: faApple,
};

export const filters: Record<string, BrowserName[]> = {
    all: Object.keys(browserNames) as BrowserName[],
    desktop: [
        "chrome",
        "edge",
        "firefox",
        "ie",
        "nodejs",
        "opera",
        "safari",
    ],
    main: [
        "chrome",
        "edge",
        "firefox",
        "opera",
        "safari",
        "chrome_android",
        "firefox_android",
        "safari_ios",
    ],
    web: [
        "chrome",
        "edge",
        "firefox",
        "ie",
        "opera",
        "safari",
        "chrome_android",
        "firefox_android",
        //    "oculus",
        "opera_android",
        "safari_ios",
        "samsunginternet_android",
        "webview_android",
        "webview_ios",
    ],
    mobile: [
        "chrome_android",
        "firefox_android",
        //   "oculus",
        "opera_android",
        "safari_ios",
        "samsunginternet_android",
        "webview_android",
        "webview_ios",
    ],
    legacy: [
        "ie",
        "nodejs",
        "oculus",
        "opera_android",
        "samsunginternet_android",
        "webview_android",
        "webview_ios",
    ],
    chromium: [
        "chrome",
        "chrome_android",
        "edge",
        "opera",
        "opera_android",
        "samsunginternet_android",
        "webview_android",
    ],
    chrome: [
        "chrome",
        "chrome_android",
    ],

    firefox: [
        "firefox",
        "firefox_android",
    ],
    safari: [
        "safari",
        "safari_ios",
    ],
    webview: [
        "webview_android",
        "webview_ios",
    ],
    standaloneEngine: [
        "deno",
        "nodejs",
    ],
    vr: [
        "oculus",
    ],
} as const;

export const allFilterNames = Object.keys(filters) as (keyof typeof filters)[];

export function getBrowserFilter(filter: keyof typeof filters): BrowserName[] {
    return filters[filter] ?? [];
}

export function getBrowserIcon(
    browserName: BrowserName,
): IconDefinition | undefined {
    return browserIcons[browserName];
}

export function getBrowserName(
    browserName: BrowserName,
    language = "en",
): string {
    const _ = language;
    return browserNames[browserName];
}

export function filterResult(
    rawFilter: Array<string | undefined>,
    result: MinimumBrowserVersion[],
): MinimumBrowserVersion[] {
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
