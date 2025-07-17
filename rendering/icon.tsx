import { IconDefinition as BrandIconDefinition } from "fa-brands";
import { IconDefinition as SolidIconDefinition } from "fa-solid";

export type AnyIconDefinition = BrandIconDefinition | SolidIconDefinition;

function ensureNoQuotes(path: string): string {
    if (path.includes('"')) {
        throw new Error(`Icon path contains quotes. This may cause rendering issues.`);
    }
    return path;
}

export function Icon({ icon, size = 16, fill = "currentColor", x, y }: {
    icon: AnyIconDefinition;
    size?: number;
    fill?: string;
    x?: number;
    y?: number;
}) {
    const [width, height, , , path] = icon.icon;
    const pathData = Array.isArray(path) ? path.join(" ") : path;

    return (
        <svg
            width={Number(size)}
            height={Number(size)}
            viewBox={`0 0 ${Number(width)} ${Number(height)}`}
            x={Number(x) || undefined}
            y={Number(y) || undefined}
        >
            <path d={ensureNoQuotes(pathData)} fill={ensureNoQuotes(fill)} />
        </svg>
    );
}
