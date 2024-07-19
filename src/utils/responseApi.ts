interface Meta {
    message: string;
    code: number;
    status: string;
}

interface Response<T> {
    meta: Meta;
    data: T;
}

export function apiResponse<T>(message: string, code: number, status: string, data: T): Response<T> {
    return {
        meta: {
            message,
            code,
            status
        },
        data
    };
}