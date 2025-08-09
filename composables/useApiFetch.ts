import { useRuntimeConfig, type UseFetchOptions } from "#app";
import { useRequestHeaders } from "#app/composables/ssr";

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
    let headers: any = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }

    const config = useRuntimeConfig()
    const cleanEndpoint = path.replace(/^\/+/, '')
    const baseURL = config.public.API_URL.replace(/\/+$/, '')

    if (import.meta.server) {
        headers = {
            ...headers,
            ...useRequestHeaders(["referer", "cookie", "x-xsrf-token"])
        }
    }

    return useFetch(`${baseURL}/${cleanEndpoint}`, {
        credentials: "include",
        watch: false,
        ...options,
        headers: {
            ...headers,
            ...options?.headers
        },
    })
}