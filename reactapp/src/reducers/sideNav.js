const isSideNavActiveReducer = (state = false, action)=>{
    var active_class = null
    switch(action.type){
        case "SHOW_SIDENAV":
            switch(action.id){
                case "text":
                    active_class = "sidenav-text-container"
                    break;
                case "object":
                    active_class = "sidenav-object-container"
                    break;
            }
            if(document.querySelector(".sidenav")){
                if(document.querySelector(".sidenav-container.active")){
                    document.querySelector(".sidenav-container.active").classList.remove("active")
                }
                document.querySelector(".sidenav").classList.add("active")
                document.querySelector(`.${active_class}`).classList.add("active")
            }
            return !state;
        case "HIDE_SIDENAV":
            if(document.querySelector(".sidenav")){
                document.querySelector(".sidenav").classList.remove("active")
            }
            return state;
        default:
            return state;
    }
}
export default isSideNavActiveReducer;