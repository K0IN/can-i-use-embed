import { css } from "./css-fake-function.ts";
import { loadEmbeddableFontSync } from "./load-font.ts";

const robotFont = loadEmbeddableFontSync(
    "./rendering/roboto/Roboto-VariableFont_wdth,wght.woff2",
);

export const baseStyle = css`
    @font-face {
        font-family: "Roboto";
        src: url("${robotFont}") format("woff2");
        font-weight: normal;
        font-style: normal;
    }

    text {
        font-family: "Roboto", "Arial", sans-serif;
    }

    :root {
        --badge-bg-color: #f8f9fa;
        --badge-border-color: #e9ecef;
        --badge-text-color: #000;
        --badge-text-color-light: #666;
        --badge-checkmark-color: #34a853;
        --badge-xmark-color: #ea4335;
        --badge-error-color: #ff6961;
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
`;
