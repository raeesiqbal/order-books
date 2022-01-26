import {imagePath} from '../helpers/AssetHelper';

const backgrounds = (state = false, action)=>{

    const backgrounds_list = [
        {
            id: "1",
            src: `${imagePath("backgrounds/1.jpg")}`
        },
        {
            id: "2",
            src: `${imagePath("backgrounds/2.jpg")}`
        },
        {
            id: "3",
            src: `${imagePath("backgrounds/3.jpg")}`
        },
        {
            id: "4",
            src: `${imagePath("backgrounds/4.jpg")}`
        },
        {
            id: "5",
            src: `${imagePath("backgrounds/5.jpg")}`
        }
    ]

    return backgrounds_list;
    
}


export default backgrounds;