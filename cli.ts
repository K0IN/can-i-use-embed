import { parseArgs } from "jsr:@std/cli/parse-args";
import { getListOfFeatures, getLowestVersionForFeatures } from "./caniuse/browsercompat.ts";
import { allFilterNames, filterResult, getBrowserIcon, getBrowserName } from "./mappings.ts";
import { RenderBadge } from "./rendering/badge.tsx";
import { faQuestion } from "fa-solid";

interface CliArgs {
    features?: string[];
    filter?: string[];
    output?: string;
    help?: boolean;
    list?: boolean;
    version?: boolean;
    _: string[];
}

const flags = parseArgs(Deno.args, {
    string: ["output"],
    boolean: ["help", "list", "version"],
    collect: ["features", "filter"],
    alias: {
        h: "help",
        o: "output",
        f: "features",
        l: "list",
        v: "version",
    },
}) as CliArgs;

function printHelp() {
    console.log(`
Can I Use Embed CLI Tool

USAGE:
    deno run --allow-read --allow-write cli.ts [OPTIONS]

OPTIONS:
    -f, --features <FEATURES>...    Browser features to check (can be used multiple times)
    --filter <FILTERS>...           Browser filters (chrome, firefox, safari, main, mobile, etc.)
    -o, --output <FILE>             Output file path (if not specified, prints to stdout)
    -l, --list                      List all available features
    -v, --version                   Show version information
    -h, --help                      Show this help message

EXAMPLES:
    # Check AbortController support across main browsers
    deno run --allow-read --allow-write cli.ts --features AbortController --filter main

    # Check multiple features with custom filter
    deno run --allow-read --allow-write cli.ts --features AbortController --features ServiceWorker --filter chrome --filter firefox

    # Save output to file
    deno run --allow-read --allow-write cli.ts --features AbortController --output compatibility.svg

    # List all available features
    deno run --allow-read cli.ts --list

BROWSER FILTERS:
    ${allFilterNames.join(", ")}

FEATURES:
    Use --list to see all available features, or check the MDN browser compatibility data.
    Features are case-insensitive (e.g., WebGL, webgl, WEBGL all work).
`);
}

function printVersion() {
    console.log("Can I Use Embed CLI v1.0.0");
}

function listFeatures() {
    try {
        const features = getListOfFeatures();
        console.log(`Available features (${features.length} total):\n`);

        // Group features alphabetically for better readability
        const sortedFeatures = features.sort();
        const columns = 3;
        const itemsPerColumn = Math.ceil(sortedFeatures.length / columns);

        for (let i = 0; i < itemsPerColumn; i++) {
            let line = "";
            for (let col = 0; col < columns; col++) {
                const index = col * itemsPerColumn + i;
                if (index < sortedFeatures.length) {
                    line += sortedFeatures[index].padEnd(25);
                }
            }
            console.log(line);
        }

        console.log(`\nTotal: ${features.length} features available`);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error listing features:", errorMessage);
        Deno.exit(1);
    }
}

async function generateBadge(features: string[], filters?: string[], outputPath?: string) {
    try {
        if (!features || features.length === 0) {
            console.error("Error: At least one feature is required. Use --features <feature-name>");
            console.error("Use --list to see available features or --help for usage information.");
            Deno.exit(1);
        }

        console.log(`Checking compatibility for features: ${features.join(", ")}`);

        const allVersions = getLowestVersionForFeatures(features);
        const filteredVersions = filterResult(filters || [], allVersions);

        if (filteredVersions.length === 0) {
            console.error(`Error: No browsers match the applied filters: ${filters?.join(", ") || "none"}`);
            console.error(
                "Available filters: all, desktop, web, mobile, main, legacy, chromium, chrome, firefox, safari, webview, standaloneEngine, vr",
            );
            Deno.exit(1);
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

        if (outputPath) {
            await Deno.writeTextFile(outputPath, svgContent);
            console.log(`✅ Badge saved to: ${outputPath}`);
        } else {
            console.log(svgContent);
        }

        /*
        // Show summary information
        const supportedBrowsers = filteredVersions.filter(v => v.isSupported);
        const unsupportedBrowsers = filteredVersions.filter(v => !v.isSupported);

        console.log(`\n📊 Summary:`);
        console.log(`   Supported browsers: ${supportedBrowsers.length}`);
        console.log(`   Unsupported browsers: ${unsupportedBrowsers.length}`);

        if (supportedBrowsers.length > 0) {
            console.log(`\n✅ Supported in:`);
            supportedBrowsers.forEach(browser => {
                const flag = browser.isBehindFlag ? " (requires flag)" : "";
                const partial = browser.partialSupport ? " (partial support)" : "";
                console.log(`   - ${getBrowserName(browser.browser)}: v${browser.minimumVersion.major}+${flag}${partial}`);
            });
        }

        if (unsupportedBrowsers.length > 0) {
            console.log(`\n❌ Not supported in:`);
            unsupportedBrowsers.forEach(browser => {
                console.log(`   - ${getBrowserName(browser.browser)}`);
            });
        }
        */
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error generating badge:", errorMessage);
        Deno.exit(1);
    }
}

async function main() {
    if (flags.help) {
        printHelp();
        return;
    }

    if (flags.version) {
        printVersion();
        return;
    }

    if (flags.list) {
        listFeatures();
        return;
    }

    // Extract features from positional arguments if not provided via --features
    const features = flags.features || flags._;

    if (!features || features.length === 0) {
        console.error("Error: No features specified.");
        console.error("Use --features <feature-name> or provide feature names as arguments.");
        console.error("Use --help for usage information or --list to see available features.");
        Deno.exit(1);
    }

    await generateBadge(
        features as string[],
        flags.filter,
        flags.output,
    );
}

if (import.meta.main) {
    main();
}
