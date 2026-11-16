const BASE_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
    readonly status: number

    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
        throw new ApiError(response.status, `Request failed: ${response.status}`)
    }
    return response.json()
}

export const http = {
    get: <T>(path: string) => request<T>(path),

    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

    put: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' })
}
