import { useEffect, useState } from 'react';

export const useSidebar = (): [
    sidebar: string,
    openSidebar: () => void,
    closeSidebar: () => void,
    toggleSidebar: () => void
] => {
    // hook to track sidebar status in local state
    // this hook initializes from local storage for returning users
    // will default to 'open' if no value found (happens on first visit)
    const [sidebar, setSidebar] = useState(
        JSON.parse(localStorage.getItem('user') as string)?.sidebar ?? 'open'
    );

    // hook to update local storage when the user toggles the sidebar
    useEffect(() => {
        // get data object 'user' from local storage
        const user = JSON.parse(localStorage.getItem('user') as string);
        // update value 'sidebar' on user object to match local value
        user.sidebar = sidebar;
        // send updated data to local storage
        localStorage.setItem('user', JSON.stringify(user));
    }, [sidebar]);

    // fn to open the sidebar
    const openSidebar = () => setSidebar('open');
    // fn to close the sidebar
    const closeSidebar = () => setSidebar('closed');
    // fn to toggle the sidebar
    const toggleSidebar = () => {
        // logic router as desired action is conditional on current value
        // default action is to open the sidebar
        switch (sidebar) {
            case 'open':
                closeSidebar();
                break;
            case 'closed':
            default:
                openSidebar();
        }
    }

    // return sidebar status and functions to update value
    return [
        sidebar,
        openSidebar,
        closeSidebar,
        toggleSidebar
    ];
}