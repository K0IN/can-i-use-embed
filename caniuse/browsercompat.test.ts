import { assert } from "@std/assert/assert";
import { assertExists } from "@std/assert/exists";
import { Version } from "./version.ts";
import { getLowestVersionForFeature, getLowestVersionForFeatures, MinimumBrowserVersion } from "./browsercompat.ts";
import { assertEquals } from "@std/assert/equals";
import { BrowserName } from "../mappings.ts";

Deno.test("getLowestVersionForFeature - existing feature", () => {
    const result = getLowestVersionForFeature("api:ambientlightsensor:");
    validateForBrowser(result, "chrome", {
        isSupported: true,
        browser: "chrome",
        minimumVersion: new Version(56, 0, 0),
        partialSupport: false,
        isBehindFlag: true,
    });

    validateForBrowser(result, "firefox", {
        isSupported: false,
        browser: "firefox",
    });

    validateForBrowser(result, "safari", {
        isSupported: false,
        browser: "safari",
    });

    validateForBrowser(result, "edge", {
        isSupported: true,
        browser: "edge",
        minimumVersion: new Version(79, 0, 0),
        partialSupport: false,
        isBehindFlag: true,
    });

    validateForBrowser(result, "chrome_android", {
        isSupported: true,
        browser: "chrome_android",
        minimumVersion: new Version(56, 0, 0),
        partialSupport: false,
        isBehindFlag: true,
    });
});

Deno.test("getLowestVersionForFeatures - multiple features", () => {
    const features = ["api:ambientlightsensor:", "api:navigator:serviceworker:", "api:abortsignal:"];
    const result = getLowestVersionForFeatures(features);

    validateForBrowser(result, "chrome", {
        isSupported: true,
        browser: "chrome",
        minimumVersion: new Version(66, 0, 0),
        partialSupport: false,
        isBehindFlag: true,
    });

    validateForBrowser(result, "deno", {
        isSupported: false,
        browser: "deno",
    });
});

export function validateForBrowser(
    allResults: MinimumBrowserVersion[],
    browser: BrowserName,
    expected: MinimumBrowserVersion,
) {
    const result = allResults.find((r) => r.browser === browser);
    assertExists(result, `Expected results to contain browser ${browser}`);
    assertEquals(
        result.isSupported,
        expected.isSupported,
        `Expected ${browser} support status to be ${expected.isSupported}`,
    );
    if (result.isSupported && expected.isSupported) {
        assertExists(result.minimumVersion, `Expected ${browser} to have a minimum version`);
        assert(
            result.minimumVersion.isEqualTo(expected.minimumVersion),
            `Expected ${browser} minimum version to be ${expected.minimumVersion}`,
        );
        assertEquals(
            result.partialSupport,
            expected.partialSupport,
            `Expected ${browser} partial support to be ${expected.partialSupport}`,
        );
        assertEquals(
            result.isBehindFlag,
            expected.isBehindFlag,
            `Expected ${browser}    to be behind flag to be ${expected.isBehindFlag}`,
        );
    }
}
