const fontCache = new Map<string, string>();

export function loadEmbeddableFontSync(filePath: string): string {
    if (fontCache.has(filePath)) {
        return fontCache.get(filePath)!;
    }

    const robotoFont = Deno.readFileSync(filePath);
    const uint8Array = new Uint8Array(robotoFont);
    const binaryString = Array.from(uint8Array).map((byte) => String.fromCharCode(byte)).join("");
    const fontBase64 = `data:font/woff2;base64,${btoa(binaryString)}`;
    fontCache.set(filePath, fontBase64);
    return fontBase64;
}
