export class String50ValueObject {
    private readonly value: string;

    constructor(input: string) {
        if (input.length > 50) {
            throw new Error("文字数は50文字以内である必要があります");
        }
        this.value = input;
    }

    public static create(input: string): String50ValueObject {
        return new String50ValueObject(input);
    }

    public ToString(): string {
        return this.value;
    }
}

export function createString50From(input: string | String50ValueObject): String50ValueObject {
    if (input instanceof String50ValueObject) {
        return input;
    }
    return String50ValueObject.create(input);
}


export class String100ValueObject {
    private readonly value: string;

    constructor(input: string) {
        if (input.length > 100) {
            throw new Error("文字数は100文字以内である必要があります");
        }
        this.value = input;
    }

    public static create(input: string): String100ValueObject {
        return new String100ValueObject(input);
    }

    public ToString(): string {
        return this.value;
    }
}

export function createString100From(input: string | String100ValueObject): String100ValueObject {
    if (input instanceof String100ValueObject) {
        return input;
    }
    return String100ValueObject.create(input);
}

export class OptionalString100ValueObject {
    private readonly value: string | null;

    constructor(input: string | null | undefined) {
        if (input === null || input === undefined || input.trim() === '') {
            this.value = null;
            return;
        }
        if (input.length > 100) {
            throw new Error("文字数は100文字以内である必要があります");
        }
        this.value = input;
    }

    public static create(input: string): OptionalString100ValueObject {
        return new OptionalString100ValueObject(input);
    }

    public ToString(): string | null {
        return this.value;
    }

    public isEmpty(): boolean {
        return this.value === null;
    }
}

export function createOptionalString100From(
    input: string | null | undefined | OptionalString100ValueObject
): OptionalString100ValueObject {
    if (input instanceof OptionalString100ValueObject) {
        return input;
    }
    return new OptionalString100ValueObject(input);
}