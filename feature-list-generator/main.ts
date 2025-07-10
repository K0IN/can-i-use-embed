import { getAllFeatures } from "../caniuse/browsercompat.ts";
import type { CompatStatement } from "../caniuse/compat.d.ts";

const features = getAllFeatures();

// Define types for our grouped structure
interface FeatureGroup {
    _features: Array<{ path: string; feature: CompatStatement }>;
    _children: Record<string, FeatureGroup>;
}

type GroupedFeatures = Record<string, FeatureGroup>;

// Helper function to group features by path hierarchy
function groupFeaturesByPath(features: Record<string, CompatStatement>): GroupedFeatures {
    const grouped: GroupedFeatures = {};

    for (const [path, feature] of Object.entries(features)) {
        const parts = path.split(":");
        let current = grouped;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // Ensure the current level has the structure we need
            if (!current[part]) {
                current[part] = {
                    _features: [],
                    _children: {},
                };
            }

            if (i === parts.length - 1) {
                // This is the leaf node, store the feature
                if (!current[part]._features) {
                    current[part]._features = [];
                }
                current[part]._features.push({ path, feature });
            } else {
                // Move to the children for the next iteration
                if (!current[part]._children) {
                    current[part]._children = {};
                }
                current = current[part]._children;
            }
        }
    }

    return grouped;
}

// Helper function to render grouped features as markdown
function renderGroup(group: GroupedFeatures, level: number = 1, parentPath: string = ""): string {
    let result = "";
    const headerPrefix = "#".repeat(Math.min(level + 1, 6)); // Max h6

    for (const [key, value] of Object.entries(group)) {
        const currentPath = parentPath ? `${parentPath}:${key}` : key;

        // Render header for this group
        result += `${headerPrefix} ${key}\n\n`;

        // Render features at this level
        if (value._features && value._features.length > 0) {
            for (const { path, feature } of value._features) {
                result += `- **${path}**`;

                // Add description if available
                if (feature.description) {
                    result += ` - ${feature.description}`;
                }

                // Add MDN link if available
                if (feature.mdn_url) {
                    result += ` ([MDN](${feature.mdn_url}))`;
                }

                // Add tags if available
                if (feature.tags && feature.tags.length > 0) {
                    result += ` \`${feature.tags.join("`, `")}\``;
                }

                result += "\n";
            }
            result += "\n";
        }

        // Recursively render children
        if (value._children && Object.keys(value._children).length > 0) {
            result += renderGroup(value._children, level + 1, currentPath);
        }
    }

    return result;
}

// Group features and generate content
const groupedFeatures = groupFeaturesByPath(features);

// generate a readme file with all features grouped by path
const readmeContent = `# Can I Use Embed Features

This document lists all available features in the Can I Use embed, organized by category and path.

${renderGroup(groupedFeatures)}
`;

await Deno.writeFile("FeatureList.md", new TextEncoder().encode(readmeContent));
console.log("FeatureList.md generated successfully!");
