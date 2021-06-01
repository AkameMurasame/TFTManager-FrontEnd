export class Result<T> {
    isSucces?: boolean;
    isFailure?: boolean;
    value?: T;
    errors?: string[];
}