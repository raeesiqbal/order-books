const canvas = (state = null, action)=>{
    if(action.type === "SET_CANVAS"){
        state = action.canvas
    }
    if(action.type === "RESET_CANVAS"){
        state = null;
    }

    return state;
}

export default canvas;