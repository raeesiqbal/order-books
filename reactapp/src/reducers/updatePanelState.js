const updatePanelState = (state = "brightness", action)=>{
    if(action.type === "SET_UPATE_PANEL_STATE"){
        state = action.action
        if(document.querySelector(`.${action.action}`)){
            if(document.querySelector(`.update-panel-container .active`)){
                document.querySelector(`.update-panel-container .active`).classList.remove("active")
            }
            document.querySelector(`.update-panel-container .${action.action}`).classList.add("active")
        }
    }

    return state
}
export default updatePanelState;