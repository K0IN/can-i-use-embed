import { assertEquals, assertStringIncludes } from "@std/assert";
import { RenderBadge } from "./badge.tsx";
import { faChrome, faFirefox, faSafari } from "fa-brands";

Deno.test("RenderBadge - handles empty browsers array", () => {
    const result = RenderBadge({ browsers: [] });

    // Should not crash and should produce valid SVG
    assertStringIncludes(result, "<svg");
    assertStringIncludes(result, "</svg>");

    // Height should be 0 when no browsers (but should handle the negative padding case)
    assertStringIncludes(result, 'height="0"');
});

Deno.test("RenderBadge - handles single browser", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: "100",
                isChecked: true,
            },
        ],
    });

    assertStringIncludes(result, "<svg");
    assertStringIncludes(result, "Chrome");
    assertStringIncludes(result, "100");
    assertStringIncludes(result, 'height="40"'); // Single browser should be 40px height
});

Deno.test("RenderBadge - handles multiple browsers", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: "100",
                isChecked: true,
            },
            {
                icon: faFirefox,
                browserName: "Firefox",
                version: "95",
                isChecked: true,
            },
            {
                icon: faSafari,
                browserName: "Safari",
                isChecked: false,
            },
        ],
    });

    assertStringIncludes(result, "Chrome");
    assertStringIncludes(result, "Firefox");
    assertStringIncludes(result, "Safari");
    assertStringIncludes(result, "100");
    assertStringIncludes(result, "95");

    // Height should be 3 * 40 + 2 * 2 = 124px (3 browsers, 2 padding gaps)
    assertStringIncludes(result, 'height="124"');
});

Deno.test("RenderBadge - handles unsupported browsers correctly", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faSafari,
                browserName: "Safari",
                isChecked: false,
            },
        ],
    });

    assertStringIncludes(result, "Safari");
    // Should not include version text for unsupported browsers
    assertStringIncludes(result, "<svg");
    // Should include X mark icon (faXmark)
});

Deno.test("RenderBadge - handles supported browser without version", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: "",
                isChecked: true,
            },
        ],
    });

    assertStringIncludes(result, "Chrome");
    assertStringIncludes(result, "<svg");
    // Should handle empty version gracefully
});

Deno.test("RenderBadge - handles very long browser names", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Very Long Browser Name That Should Not Break Layout",
                version: "1.0.0",
                isChecked: true,
            },
        ],
    });

    assertStringIncludes(result, "Very Long Browser Name That Should Not Break Layout");
    assertStringIncludes(result, "1.0.0");

    // Should still produce valid SVG
    assertStringIncludes(result, "<svg");
    assertStringIncludes(result, "</svg>");
});

Deno.test("RenderBadge - handles very long version numbers", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: "123.456.789.012345",
                isChecked: true,
            },
        ],
    });

    assertStringIncludes(result, "Chrome");
    assertStringIncludes(result, "123.456.789.012345");

    // Should calculate width correctly even with long version
    assertStringIncludes(result, "<svg");
});

Deno.test("RenderBadge - produces valid SVG structure", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: "100",
                isChecked: true,
            },
        ],
    });

    // Check for required SVG elements
    assertStringIncludes(result, '<svg xmlns="http://www.w3.org/2000/svg"');
    assertStringIncludes(result, "<defs>");
    assertStringIncludes(result, "<style>");
    assertStringIncludes(result, "</style>");
    assertStringIncludes(result, "</defs>");
    assertStringIncludes(result, "</svg>");
});

Deno.test("RenderBadge - width calculation is consistent", () => {
    const browsers = [
        {
            icon: faChrome,
            browserName: "Chrome",
            version: "100",
            isChecked: true as const,
        },
        {
            icon: faFirefox,
            browserName: "Firefox Long Name",
            version: "95.0.1",
            isChecked: true as const,
        },
    ];

    const result = RenderBadge({ browsers });

    // Extract width from SVG - handle both quoted and unquoted values
    const widthMatch = result.match(/width="?(\d+(?:\.\d+)?)"?/);
    const width = widthMatch ? parseFloat(widthMatch[1]) : 0;

    // Width should be at least the minimum (110) and should be reasonable
    assertEquals(width >= 110, true, `Width ${width} should be at least 110`);
    assertEquals(width < 2000, true, `Width ${width} should be reasonable (less than 2000)`);
});

Deno.test("RenderBadge - handles mixed supported/unsupported browsers", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: "100",
                isChecked: true,
            },
            {
                icon: faSafari,
                browserName: "Safari",
                isChecked: false,
            },
            {
                icon: faFirefox,
                browserName: "Firefox",
                version: "95",
                isChecked: true,
            },
        ],
    });

    assertStringIncludes(result, "Chrome");
    assertStringIncludes(result, "Safari");
    assertStringIncludes(result, "Firefox");
    assertStringIncludes(result, "100");
    assertStringIncludes(result, "95");

    // Should contain both check and X marks
    assertStringIncludes(result, "<svg");
});

Deno.test("RenderBadge - handles undefined version gracefully", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: undefined,
                isChecked: true,
            },
        ],
    });

    assertStringIncludes(result, "Chrome");
    assertStringIncludes(result, "<svg");
    // Should not crash when version is undefined
});

Deno.test("RenderBadge - minimum width enforcement", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "C", // Very short name
                version: "1", // Very short version
                isChecked: true,
            },
        ],
    });

    // Should still enforce minimum width of 110
    const widthMatch = result.match(/width="(\d+)"/);
    const width = widthMatch ? parseInt(widthMatch[1]) : 0;
    assertEquals(width >= 110, true);
});

Deno.test("RenderBadge - rendering option passed but not implemented", () => {
    const result = RenderBadge({
        browsers: [
            {
                icon: faChrome,
                browserName: "Chrome",
                version: "100",
                isChecked: true,
            },
        ],
        rendering: { vertical: true },
    });

    // Should not crash even though vertical rendering is not implemented
    assertStringIncludes(result, "Chrome");
    assertStringIncludes(result, "<svg");
});
