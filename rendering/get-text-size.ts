import text2svg from "npm:text-to-svg";

const textSvg = text2svg.loadSync(import.meta.dirname + "/roboto/Roboto-VariableFont_wdth,wght.otf");

export function getTextSize(
    text: string,
    fontSize: number = 16,
    fontFamily: string = "Roboto",
): { width: number; height: number } {
    const metrics = textSvg.getMetrics(text, {
        x: 0,
        y: 0,
        fontSize: fontSize,
        fontFamily: fontFamily,
        anchor: "top",
        attributes: { fill: "black" },
    });

    return { width: metrics.width, height: fontSize };
}

export function getTextWidth(
    text: string,
    fontSize: number = 16,
    fontFamily: string = "Roboto",
): number {
    return getTextSize(text, fontSize, fontFamily).width;
}
