export class OptionalIsbnValueObject {
    private readonly value: string | null;

    constructor(input: string | null | undefined) {
        if (!input || input.trim() === '') {
            this.value = null;
            return;
        }

        const cleaned = input.replace(/-/g, '');
        const isValid = /^\d{9}[\dX]$|^\d{13}$/.test(cleaned);
        if (!isValid) throw new Error('Invalid ISBN');

        this.value = input;
    }

    public static create(input: string | null | undefined) {
        return new OptionalIsbnValueObject(input);
    }

    public ToString(): string | null {
        return this.value;
    }

    public isEmpty(): boolean {
        return this.value === null;
    }
}

export function createOptionalIsbnValueObject(input: string | null | OptionalIsbnValueObject): OptionalIsbnValueObject {
    if (input instanceof OptionalIsbnValueObject) {
        return input;
    }
    return OptionalIsbnValueObject.create(input);
}