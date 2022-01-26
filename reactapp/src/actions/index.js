export const showSideNav = (nr) => {
    return {
        type: "SHOW_SIDENAV",
        id: nr
    };
};

export const hideSideNav = (nr) => {
    return {
        type: "HIDE_SIDENAV",
        id: nr
    };
};

export const showBottomSlide = (nr) => {
    return {
        type: "SHOW_BOTTOMSLIDE",
        id: nr
    };
};

export const setCanvas = (nr) => {
    return {
        type: "SET_CANVAS",
        canvas: nr
    };
};

export const hideBottomSlide = (nr) => {
    return {
        type: "HIDE_BOTTOMSLIDE",
        id: nr
    };
};

export const setUpdatePanelState = (nr) => {
    return {
        type: "SET_UPATE_PANEL_STATE",
        action: nr
    };
};

export const setObjectsState = (nr) => {
    return {
        type: "SET_OBJECTS_STATE",
        action: nr
    };
};