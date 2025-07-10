import { assert, assertEquals } from "@std/assert";
import { Version } from "./version.ts";

Deno.test("Version.parse - standard version format", () => {
    const version = Version.parse("1.2.3");
    assertEquals(version.major, 1, "Major version should be 1");
    assertEquals(version.minor, 2, "Minor version should be 2");
    assertEquals(version.patch, 3, "Patch version should be 3");
    assertEquals(version.toString(), "1.2.3", "toString should return original format");
});

Deno.test("Version.parse - partial version formats", () => {
    const majorOnly = Version.parse("5");
    assertEquals(majorOnly.major, 5, "Major version should be 5");
    assertEquals(majorOnly.minor, 0, "Minor version should default to 0");
    assertEquals(majorOnly.patch, 0, "Patch version should default to 0");

    const majorMinor = Version.parse("5.2");
    assertEquals(majorMinor.major, 5, "Major version should be 5");
    assertEquals(majorMinor.minor, 2, "Minor version should be 2");
    assertEquals(majorMinor.patch, 0, "Patch version should default to 0");
});

Deno.test("Version.isNewerThan - various comparisons", () => {
    const v1_0_0 = Version.parse("1.0.0");
    const v1_0_1 = Version.parse("1.0.1");
    const v1_1_0 = Version.parse("1.1.0");
    const v2_0_0 = Version.parse("2.0.0");

    assert(v1_0_1.isNewerThan(v1_0_0), "1.0.1 should be newer than 1.0.0");
    assert(v1_1_0.isNewerThan(v1_0_1), "1.1.0 should be newer than 1.0.1");
    assert(v2_0_0.isNewerThan(v1_1_0), "2.0.0 should be newer than 1.1.0");

    assert(!v1_0_0.isNewerThan(v1_0_1), "1.0.0 should not be newer than 1.0.1");
    assert(!v1_0_0.isNewerThan(v1_0_0), "Version should not be newer than itself");
});

Deno.test("Version.isEqualTo - equality checks", () => {
    const v1 = Version.parse("1.2.3");
    const v2 = Version.parse("1.2.3");
    const v3 = new Version(1, 2, 3);
    const v4 = Version.parse("1.2.4");

    assert(v1.isEqualTo(v2), "Same version strings should be equal");
    assert(v1.isEqualTo(v3), "Parsed and constructed versions should be equal");
    assert(!v1.isEqualTo(v4), "Different versions should not be equal");
});

Deno.test("Version constructor - with undefined values", () => {
    const v1 = new Version(5);
    assertEquals(v1.major, 5, "Major should be 5");
    assertEquals(v1.minor, undefined, "Minor should be undefined");
    assertEquals(v1.patch, undefined, "Patch should be undefined");

    const v2 = new Version(5, 2);
    assertEquals(v2.major, 5, "Major should be 5");
    assertEquals(v2.minor, 2, "Minor should be 2");
    assertEquals(v2.patch, undefined, "Patch should be undefined");
});

Deno.test("Version comparison with undefined values", () => {
    const v1 = new Version(1, undefined, undefined);
    const v2 = new Version(1, 0, 0);

    assert(!v1.isEqualTo(v2), "Version with undefined should NOT equal version with 0 (exact comparison)");
    assert(!v1.isNewerThan(v2), "1.undefined.undefined should not be newer than 1.0.0");
    assert(!v2.isNewerThan(v1), "1.0.0 should not be newer than 1.undefined.undefined");

    const v3 = new Version(1, undefined, undefined);
    assert(v1.isEqualTo(v3), "Same version with undefined should be equal");

    const v4 = new Version(1, 1, undefined);
    const v5 = new Version(1, 1, 0);
    assert(!v4.isEqualTo(v5), "1.1.undefined should not equal 1.1.0");
    assert(!v4.isNewerThan(v5), "1.1.undefined should not be newer than 1.1.0");
    assert(!v5.isNewerThan(v4), "1.1.0 should not be newer than 1.1.undefined");
});

Deno.test("Version class - potential bug in comparison consistency", () => {
    const v1 = new Version(1, undefined, undefined);
    const v2 = new Version(1, 0, 0);

    const isEqual = v1.isEqualTo(v2);
    const v1Newer = v1.isNewerThan(v2);
    const v2Newer = v2.isNewerThan(v1);

    console.log(`Version comparison inconsistency detected:`);
    console.log(`  v1 (1.undefined.undefined) equals v2 (1.0.0): ${isEqual}`);
    console.log(`  v1 newer than v2: ${v1Newer}`);
    console.log(`  v2 newer than v1: ${v2Newer}`);

    assert(!isEqual, "Current behavior: undefined !== 0 in equality");
    assert(!v1Newer && !v2Newer, "Current behavior: both versions treat undefined as 0 in comparison");
});

Deno.test("Version.parse - handles edge cases", () => {
    const v1 = Version.parse("01.02.03");
    assertEquals(v1.major, 1, "Should parse leading zeros correctly");
    assertEquals(v1.minor, 2, "Should parse leading zeros correctly");
    assertEquals(v1.patch, 3, "Should parse leading zeros correctly");

    const v2 = Version.parse("999.888.777");
    assertEquals(v2.major, 999, "Should handle large version numbers");
    assertEquals(v2.minor, 888, "Should handle large version numbers");
    assertEquals(v2.patch, 777, "Should handle large version numbers");

    const v3 = Version.parse("5");
    assertEquals(v3.major, 5, "Should handle single digit major version");
    assertEquals(v3.minor, 0, "Should default minor to 0");
    assertEquals(v3.patch, 0, "Should default patch to 0");
});
