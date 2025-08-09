export function useMobile() {
    const isMobile = ref(false);

    const checkScreenSize = () => {
        isMobile.value = window.innerWidth < 768;
    };

    onMounted(() => {
        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkScreenSize);
    });

    return {
        isMobile,
    };
}
