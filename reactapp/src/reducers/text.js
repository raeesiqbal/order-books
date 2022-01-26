const text = (state = false, action)=>{

    const text_list = [
        {
            id: "1",
            text: "Add a heading",
            type: "large",
            fontSize: 32,
            fontWeight: 700,
            fontFamily: "Roboto",
            type: "large",
        },
        {
            id: "2",
            text: "Add a subheading",
            fontSize: 22,
            fontWeight: 500,
            fontFamily: "Roboto",
            type: "medium"
        },
        {
            id: "3",
            text: "Add a little bit of body text",
            fontSize: 16,
            fontWeight: 100,
            fontFamily: "Roboto",
            type: "small"
        },
    ]

    return text_list;
    
}


export default text;