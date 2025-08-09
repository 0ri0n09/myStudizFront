export const useSidebar = () => {
    const { isMobile } = useMobile()
    const isOpen = useState('sidebar', () => false)
    const isCollapsed = useState('sidebarCollapsed', () => false)

    watch(isMobile, (newIsMobile) => {
        if (newIsMobile) {
            isCollapsed.value = false
        }
    }, { immediate: true })

    const toggleSidebar = () => {
        isOpen.value = !isOpen.value
    }

    const toggleCollapse = () => {
        if (!isMobile.value) {
            isCollapsed.value = !isCollapsed.value
        }
    }

    const closeSidebar = () => {
        isOpen.value = false
    }

    return {
        isOpen,
        isCollapsed,
        toggleSidebar,
        toggleCollapse,
        closeSidebar
    }
}