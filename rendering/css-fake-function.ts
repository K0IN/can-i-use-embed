export function css(strings: TemplateStringsArray, ...values: string[]): string {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] || "");
    }, "");
}
