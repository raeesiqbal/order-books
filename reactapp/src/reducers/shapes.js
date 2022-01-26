import {imagePath} from '../helpers/AssetHelper';

const shapes = (state = false, action)=>{

    const shapes_list = [
        {
            id: "1",
            src: `${imagePath("shapes/circle.svg")}`,
            name: "circle"
        },
        {
            id: "2",
            src: `${imagePath("shapes/polygon.svg")}`,
            name: "polygon"
        },
        {
            id: "3",
            src: `${imagePath("shapes/rectangle.svg")}`,
            name: "rectangle"
        },
        {
            id: "4",
            src: `${imagePath("shapes/triangle.svg")}`,
            name: "triangle"
        },
        {
            id: "5",
            src: `${imagePath("shapes/star.svg")}`,
            name: "star"
        }
    ]

    return shapes_list;
    
}


export default shapes;