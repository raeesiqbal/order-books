
import imagePath from '../helpers/AssetHelper';

const fonts = (state = false, action)=>{

    const fonts_list = [
        {
            id: "1",
            name: `Roboto`,
            fontFamily: "Roboto"
        },
        {
            id: "2",
            name: `Pacifico`,
            fontFamily: "Pacifico"
        },
        {
            id: "3",
            name: `Montez`,
            fontFamily: "Montez"
        },
        {
            id: "4",
            name: `Josefin Sans`,
            fontFamily: "Josefin Sans"
        },
        {
            id: "5",
            name: `Lobster`,
            fontFamily: "Lobster"
        },
    ]

    return fonts_list;
    
}


export default fonts;