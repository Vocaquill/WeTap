export interface ServerError {
    status: number;
    data: {
        errors: Record<string, string[]>;
    };
}