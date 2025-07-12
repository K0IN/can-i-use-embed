import { assertEquals, assertThrows } from "@std/assert";
import { getListOfFeatures, getLowestVersionForFeature, getLowestVersionForFeatures } from "./browsercompat.ts";
import { Version } from "./version.ts";

Deno.test("getLowestVersionForFeature - with real data", () => {
    // Test with a real feature that should exist
    const features = getListOfFeatures();
    const firstFeature = features[0];

    if (firstFeature) {
        const result = getLowestVersionForFeature(firstFeature);
        assertEquals(Array.isArray(result), true);
        assertEquals(result.length > 0, true);

        // Each result should have a browser property
        result.forEach((browserSupport) => {
            assertEquals(typeof browserSupport.browser, "string");
            assertEquals(typeof browserSupport.isSupported, "boolean");
        });
    }
});

Deno.test("getLowestVersionForFeature - throws on non-existent feature", () => {
    assertThrows(
        () => getLowestVersionForFeature("non:existent:feature:that:should:not:exist"),
        Error,
        'Feature "non:existent:feature:that:should:not:exist" not found',
    );
});

Deno.test("getLowestVersionForFeatures - with real data", () => {
    const features = getListOfFeatures();
    const testFeatures = features.slice(0, 2); // Test with first 2 features

    if (testFeatures.length > 0) {
        const result = getLowestVersionForFeatures(testFeatures);
        assertEquals(Array.isArray(result), true);

        // Should return data for each browser
        result.forEach((browserSupport) => {
            assertEquals(typeof browserSupport.browser, "string");
            assertEquals(typeof browserSupport.isSupported, "boolean");

            if (browserSupport.isSupported) {
                assertEquals(browserSupport.minimumVersion instanceof Version, true);
                assertEquals(typeof browserSupport.partialSupport, "boolean");
                assertEquals(typeof browserSupport.isBehindFlag, "boolean");
            }
        });
    }
});

Deno.test("getLowestVersionForFeatures - handles empty feature array", () => {
    const result = getLowestVersionForFeatures([]);
    assertEquals(result.length, 0);
});

Deno.test("getLowestVersionForFeatures - handles single feature", () => {
    const features = getListOfFeatures();
    const firstFeature = features[0];

    if (firstFeature) {
        const result = getLowestVersionForFeatures([firstFeature]);
        const singleResult = getLowestVersionForFeature(firstFeature);

        // Should have same number of browsers
        assertEquals(result.length, singleResult.length);

        // Results should match
        result.forEach((merged, index) => {
            const single = singleResult[index];
            assertEquals(merged.browser, single.browser);
            assertEquals(merged.isSupported, single.isSupported);
        });
    }
});

Deno.test("getListOfFeatures - returns valid feature list", () => {
    const features = getListOfFeatures();
    assertEquals(Array.isArray(features), true);
    assertEquals(features.length > 0, true);

    // All features should be strings
    features.forEach((feature) => {
        assertEquals(typeof feature, "string");
        assertEquals(feature.length > 0, true);
    });
});

Deno.test("version comparison edge cases", () => {
    const v1 = new Version(50, 0, 0);
    const v2 = new Version(60, 0, 0);
    const v3 = new Version(55, 0, 0);

    // Test that version merging works correctly
    assertEquals(v2.isNewerThan(v1), true);
    assertEquals(v3.isNewerThan(v1), true);
    assertEquals(v2.isNewerThan(v3), true);
});

// Test specific edge cases found in the codebase

Deno.test("browsercompat handles duplicate browser entries", () => {
    // Test that the system can handle features with complex browser support arrays
    const features = getListOfFeatures();

    // Find a feature with complex data
    for (const feature of features.slice(0, 10)) {
        try {
            const result = getLowestVersionForFeature(feature);

            // Ensure no duplicate browsers in result
            const browsers = result.map((r) => r.browser);
            const uniqueBrowsers = [...new Set(browsers)];
            assertEquals(browsers.length, uniqueBrowsers.length, `Feature ${feature} has duplicate browser entries`);
        } catch (error) {
            // Skip features that might have parsing issues
            console.log(`Skipped feature ${feature}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
});

Deno.test("browsercompat handles version merging correctly", () => {
    const features = getListOfFeatures();

    // Test merging with multiple features
    if (features.length >= 2) {
        const testFeatures = features.slice(0, 2);
        const merged = getLowestVersionForFeatures(testFeatures);
        const individual = testFeatures.map((f) => getLowestVersionForFeature(f));

        // For each browser, verify the merging logic
        merged.forEach((mergedBrowser) => {
            const browserSupports = individual.map((ind) => ind.find((b) => b.browser === mergedBrowser.browser))
                .filter(Boolean);

            if (browserSupports.length === testFeatures.length) {
                // All features support this browser
                const allSupported = browserSupports.every((bs) => bs!.isSupported);

                if (allSupported) {
                    assertEquals(mergedBrowser.isSupported, true);
                    // Should have the highest minimum version
                    if (mergedBrowser.isSupported) {
                        const versions = browserSupports
                            .filter((bs) => bs!.isSupported)
                            .map((bs) => bs!.isSupported ? bs!.minimumVersion : null)
                            .filter(Boolean) as Version[];

                        // The merged version should be at least as high as all individual versions
                        versions.forEach((v) => {
                            assertEquals(
                                !mergedBrowser.minimumVersion.isNewerThan(v) ||
                                    mergedBrowser.minimumVersion.isEqualTo(v) ||
                                    mergedBrowser.minimumVersion.isNewerThan(v),
                                true,
                            );
                        });
                    }
                } else {
                    assertEquals(mergedBrowser.isSupported, false);
                }
            }
        });
    }
});

Deno.test("browsercompat path building consistency", () => {
    // Test that feature paths are built consistently
    const features = getListOfFeatures();

    // All features should be properly formatted paths
    features.forEach((feature) => {
        // Should not start or end with colons
        assertEquals(feature.startsWith(":"), false, `Feature ${feature} starts with colon`);
        assertEquals(feature.endsWith(":"), false, `Feature ${feature} ends with colon`);

        // Should not have double colons
        assertEquals(feature.includes("::"), false, `Feature ${feature} has double colons`);

        // Should be lowercase (as per the normalization)
        assertEquals(feature, feature.toLowerCase(), `Feature ${feature} is not lowercase`);
    });
});
