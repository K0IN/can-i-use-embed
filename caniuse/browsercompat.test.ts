import { assert } from "@std/assert/assert";
import { assertExists } from "@std/assert/exists";
import { Version } from "./version.ts";
import {
    findFeatureSupport,
    getLowestVersionForFeature,
    getLowestVersionForFeatures,
    MinimumBrowserVersion,
} from "./browsercompat.ts";
import { assertEquals } from "@std/assert/equals";
import { BrowserName } from "../mappings.ts";
import { SupportStatement } from "./compat.d.ts";
import { assertThrows } from "@std/assert/throws";

Deno.test("getLowestVersionForFeature - existing feature", () => {
    const result = getLowestVersionForFeature("api:ambientlightsensor");
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
    const features = ["api:ambientlightsensor", "api:abortcontroller", "api:sensor"];
    const result = getLowestVersionForFeatures(features);

    validateForBrowser(result, "chrome", {
        isSupported: true,
        browser: "chrome",
        minimumVersion: new Version(67, 0, 0),
        partialSupport: false,
        isBehindFlag: true,
    });

    validateForBrowser(result, "deno", {
        isSupported: false,
        browser: "deno",
    });
});

Deno.test("findFeatureSupport - find lowest feature on only adds", () => {
    const versions: SupportStatement = [
        { version_added: "56" },
        { version_added: "60" },
        { version_added: "62" },
    ];

    const result = findFeatureSupport(versions);
    assertEquals(result.isSupported, true);
    if (result.isSupported) {
        assertEquals(result.minimumVersion.toString(), "56.0.0");
        assertEquals(result.partialSupport, false);
        assertEquals(result.isBehindFlag, false);
    }
});

Deno.test("findFeatureSupport - find lowest feature on adds and removes", () => {
    const versions: SupportStatement = [
        { version_added: "1" },
        { version_added: "2" },
        { version_added: "3" },
        { version_added: "3", version_removed: "3" },
        { version_added: "4" },
        { version_added: "15" },
    ];

    const result = findFeatureSupport(versions);
    assertEquals(result.isSupported, true);
    console.log("Result:", result);
    if (result.isSupported) {
        assertEquals(result.minimumVersion.toString(), "4.0.0");
        assertEquals(result.partialSupport, false);
        assertEquals(result.isBehindFlag, false);
    }
});

Deno.test("findFeatureSupport - find lowest feature on adds and removes incorrect order", () => {
    const versions: SupportStatement = [
        { version_added: "1" },
        { version_added: "3", version_removed: "3" },
        { version_added: "2" },
        { version_added: "15" },
        { version_added: "3" },
        { version_added: "4" },
    ];

    const result = findFeatureSupport(versions);
    assertEquals(result.isSupported, true);
    console.log("Result:", result);
    if (result.isSupported) {
        assertEquals(result.minimumVersion.toString(), "4.0.0");
        assertEquals(result.partialSupport, false);
        assertEquals(result.isBehindFlag, false);
    }
});

Deno.test("findFeatureSupport - all removed", () => {
    const versions: SupportStatement = [
        { version_added: "1", version_removed: "2" },
        { version_added: "2", version_removed: "3" },
        { version_added: "3", version_removed: "4" },
    ];
    const result = findFeatureSupport(versions);
    assertEquals(result.isSupported, false);
    assertEquals(result.browser, "unknown");
});

Deno.test("findFeatureSupport - no versions", () => {
    const versions = [] as unknown as SupportStatement;
    assertThrows(() => findFeatureSupport(versions));
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
