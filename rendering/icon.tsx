import { IconDefinition as BrandIconDefinition } from "fa-brands";
import { IconDefinition as SolidIconDefinition } from "fa-solid";

export type AnyIconDefinition = BrandIconDefinition | SolidIconDefinition;

export function Icon({ icon, size = 16, fill = "currentColor", ...props }: {
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
            width={size}
            height={size}
            viewBox={`0 0 ${width} ${height}`}
            {...props}
        >
            <path d={pathData} fill={fill} />
        </svg>
    );
}
