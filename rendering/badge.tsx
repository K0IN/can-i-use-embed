import { IconDefinition } from "fa-brands";
import { faCheck, faXmark } from "fa-solid";
import { Icon } from "./icon.tsx";
import { getTextWidth } from "./get-text-size.ts";
import { renderToString } from "preact-render-to-string";
import { loadEmbeddableFontSync } from "./load-font.ts";

function getRenderBrowserWithCheckmarkWidth(
    browserName: string,
    version?: string,
): number {
    const versionStartX = getTextWidth(browserName) + 5 + 40;
    return Math.max(110, versionStartX + getTextWidth(version ?? "") + 10 + 20);
}

export function RenderBrowserWithCheckmark(
    { icon, browserName, supported, version }: {
        icon: IconDefinition;
        browserName: string;
        supported: boolean;
        version?: string;
    },
) {
    const versionStartX = getTextWidth(browserName) + 5 + 40;
    const overallWidth = getRenderBrowserWithCheckmarkWidth(browserName, version);

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={overallWidth} height="40">
            <rect
                width={overallWidth}
                height="40"
                rx="8"
                ry="8"
                fill="var(--badge-bg-color)"
                stroke="var(--badge-border-color)"
                strokeWidth="1"
            />
            <Icon icon={icon} size={20} fill="#4285F4" x={10} y={10} />
            <text x={40} y="25" fontSize="16" fill="var(--badge-text-color)">
                {browserName}
            </text>
            {
                // debug rect
                // <rect x={40} y="5" width={getTextWidth(browserName)} height="30" fill="rgba(255, 0, 0, 0.2)" />
            }
            {supported && version && (
                <text
                    x={versionStartX}
                    y="24"
                    fontSize="10"
                    fill="var(--badge-text-color-light)"
                >
                    {version}
                </text>
            )}
            {supported
                ? (
                    <Icon
                        icon={faCheck}
                        size={20}
                        fill="var(--badge-checkmark-color)"
                        x={versionStartX + getTextWidth(version ?? "")}
                        y={10}
                    />
                )
                : (
                    <Icon
                        icon={faXmark}
                        size={20}
                        fill="var(--badge-xmark-color)"
                        x={versionStartX + getTextWidth(version ?? "")}
                        y={10}
                    />
                )}
        </svg>
    );
}

export function Badges(
    { browsers }: {
        browsers: Array<
            {
                icon: IconDefinition;
                browserName: string;
                version?: string;
                isChecked: true;
            } | {
                icon: IconDefinition;
                browserName: string;
                isChecked: false;
            }
        >;
    },
) {
    const lineHeight = 40; // Height of each line in the SVG
    const linePadding = 2; // Padding between lines

    // Calculate the maximum width needed for all lines
    const maxWidth = Math.max(
        ...browsers.map((line) =>
            getRenderBrowserWithCheckmarkWidth(
                line.browserName,
                line.isChecked ? line.version : undefined,
            )
        ),
    );

    const robotFont = loadEmbeddableFontSync(
        "./rendering/roboto/Roboto-VariableFont_wdth,wght.woff2",
    );

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={maxWidth}
            height={browsers.length * (lineHeight + linePadding) - linePadding}
        >
            <defs>
                <style>
                    {`
                @font-face {
                    font-family: 'Roboto';
                    src: url('${robotFont}') format('woff2');
                    font-weight: normal;
                    font-style: normal;
                }

                text {
                    font-family: 'Roboto', 'Arial', sans-serif;
                }

                :root {
                    --badge-bg-color: #f8f9fa;
                    --badge-border-color: #e9ecef;
                    --badge-text-color: #000;
                    --badge-text-color-light: #666;
                    --badge-checkmark-color: #34A853;
                    --badge-xmark-color: #EA4335;
                }

                @media (prefers-color-scheme: dark) {
                    :root {
                        --badge-bg-color: #343a40;
                        --badge-border-color: #495057;
                        --badge-text-color: #f8f9fa;
                        --badge-text-color-light: #adb5bd;
                        --badge-checkmark-color: #28a745;
                        --badge-xmark-color: #dc3545;
                    }
                }
            `}
                </style>
            </defs>

            {browsers.map((line, index) => (
                <g
                    key={index}
                    transform={`translate(0, ${index * (lineHeight + linePadding)})`}
                >
                    <RenderBrowserWithCheckmark
                        icon={line.icon}
                        browserName={line.browserName}
                        supported={Boolean(line.isChecked)}
                        version={line.isChecked ? line.version ?? "" : ""}
                    />
                </g>
            ))}
        </svg>
    );
}

export function RenderBadge(args: Parameters<typeof Badges>[0] & { rendering?: { vertical?: boolean } }): string {
    // if (args.rendering?.vertical) {
    // }

    return renderToString(<Badges {...args} />);
}
