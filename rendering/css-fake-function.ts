export function css(strings: TemplateStringsArray, ...values: string[]): string {
    return strings.reduce((result, str, i) => result + str + (values[i] || ""), "");
}
