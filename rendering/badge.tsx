import { IconDefinition } from "fa-brands";
import { faCheck, faXmark } from "fa-solid";
import { Icon } from "./icon.tsx";
import { getTextWidth } from "./get-text-size.ts";
import { renderToString } from "preact-render-to-string";
import { baseStyle } from "./css.ts";

function getRenderBrowserWithCheckmarkWidth(
    browserName: string,
    version?: string,
): number {
    const versionStartX = getTextWidth(browserName) + 5 + 40;
    return Math.max(110, versionStartX + getTextWidth(version ?? "") + 10 + 20);
}

function RenderBrowserWithCheckmark(
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
            {supported && version && version.length > 0 && (
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
                        x={versionStartX + getTextWidth(version && version.length > 0 ? version : "")}
                        y={10}
                    />
                )
                : (
                    <Icon
                        icon={faXmark}
                        size={20}
                        fill="var(--badge-xmark-color)"
                        x={versionStartX + getTextWidth("")}
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
    // Handle empty array case
    if (browsers.length === 0) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="110" height="0">
                <defs>
                    <style>{baseStyle}</style>
                </defs>
            </svg>
        );
    }

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

    const totalHeight = (browsers.length * lineHeight) + (Math.max(0, browsers.length - 1) * linePadding);

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={maxWidth}
            height={totalHeight}
        >
            <defs>
                <style>{baseStyle}</style>
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
