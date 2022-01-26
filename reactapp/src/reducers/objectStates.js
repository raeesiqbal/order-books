const objectStates = (state = {activeObject: false, shape: false, image: false, text: false}, action)=>{
    if(action.type === "SET_OBJECTS_STATE"){
        state = {activeObject: action.action.activeObject, image: action.action.image, shape: action.action.shape, text: action.action.text}
    }

    return state;
}
export default objectStates;
