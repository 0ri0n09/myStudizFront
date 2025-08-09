import { ref } from 'vue'

export const useDelayedLoading = (delayMs: number = 10) => {
    const isLoading = ref(false)

    const withDelayedLoading = async <T>(
        promise: Promise<T>
    ): Promise<T> => {
        let loadingTimeout: NodeJS.Timeout

        const loadingPromise = new Promise<void>((resolve) => {
            loadingTimeout = setTimeout(() => {
                isLoading.value = true
                resolve()
            }, delayMs)
        })

        try {
            const result = await promise
            clearTimeout(loadingTimeout)
            return result
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        withDelayedLoading
    }
}