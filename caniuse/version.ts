export class Version {
    static parse(version: string): Version {
        const parts = version.split(".").map(Number);
        return new Version(parts[0], parts[1] || 0, parts[2] || 0);
    }

    constructor(
        public major: number,
        public minor: number | undefined = undefined,
        public patch: number | undefined = undefined,
    ) {}

    toString(): string {
        return `${this.major}.${this.minor}.${this.patch}`;
    }

    isNewerThan(other: Version): boolean {
        if (this.major !== other.major) {
            return this.major > other.major;
        }
        if (this.minor !== other.minor) {
            return (this.minor ?? 0) > (other.minor ?? 0);
        }
        return (this.patch ?? 0) > (other.patch ?? 0);
    }

    isEqualTo(other: Version): boolean {
        return this.major === other.major &&
            (this.minor ?? 0) === (other.minor ?? 0) &&
            (this.patch ?? 0) === (other.patch ?? 0);
    }
}
