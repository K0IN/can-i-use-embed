import { faExclamationTriangle } from "fa-solid";
import { getTextWidth } from "./get-text-size.ts";
import { renderToString } from "preact-render-to-string";
import { Icon } from "./icon.tsx";
import { css } from "./css-fake-function.ts";
import { baseStyle } from "./css.ts";

export function Error(
    { error }: {
        error: string;
    },
) {
    const title = "An error occurred while rendering the badge.";

    const widgetWidth = Math.max(getTextWidth(title), getTextWidth(error, 14)) + 10 + 40; // 10px padding on each side
    const lineHeight = 60; // Height of each line in the SVG

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={widgetWidth}
            height={lineHeight}
        >
            <defs>
                <style>
                    {baseStyle}
                    {css`
                        a {
                            text-decoration: none;
                        }

                        a:hover {
                            fill: #5a7d9f;
                            text-decoration: underline;
                        }
                    `}
                </style>
            </defs>
            <rect
                width={widgetWidth}
                height={lineHeight}
                rx="8"
                ry="8"
                fill="var(--badge-bg-color)"
                stroke="var(--badge-border-color)"
                strokeWidth="1"
            />
            <Icon icon={faExclamationTriangle} size={20} fill="var(--badge-error-color)" x={10} y={10} />
            <text
                x={40}
                y="25"
                fontSize="16"
                fill="var(--badge-text-color-light)"
            >
                <a href="https://github.com/K0IN/can-i-use-embed">
                    {title}
                    <title>Click to open the documentation.</title>
                </a>
            </text>

            <text
                x={40}
                y="50"
                fontSize="14"
                fill="var(--badge-text-color-light)"
            >
                {error}
            </text>
        </svg>
    );
}

export function RenderError(args: Parameters<typeof Error>[0]): string {
    return renderToString(<Error {...args} />);
}
