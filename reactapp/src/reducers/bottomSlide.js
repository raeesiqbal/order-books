const isBottomSlideActiveReducer = (state = false, action)=>{
    var active_class = null
    switch(action.type){
        case "SHOW_BOTTOMSLIDE":
            switch(action.id){
                case "upload_button":
                    active_class = "upload-container"
                    break;
                case "background_button":
                    active_class = "background-container"
                    break;
                case "text_button":
                    active_class = "text-container"
                    break;
                case "shapes_button":
                    active_class = "shapes-container"
                    break;
                case "fonts-container":
                    active_class = "fonts-container"
                    break;
                default:
                    active_class = action.id
                    break;
            }

            console.log(active_class)
            if(document.querySelector(".bottom-slide-container")){
                if(document.querySelector(`.bottom-slide-tools.active`)){
                    document.querySelector(`.bottom-slide-tools.active`).classList.remove("active")
                }
                document.querySelector(".bottom-slide-container").classList.add("active")
                document.querySelector(`.${active_class}`).classList.add("active")
            }
            return !state;
        case "HIDE_BOTTOMSLIDE":
            if(document.querySelector(".bottom-slide-container")){
                document.querySelector(".bottom-slide-container").classList.remove("active")
            }
            return state;
        default:
            return state;
    }
}
export default isBottomSlideActiveReducer;