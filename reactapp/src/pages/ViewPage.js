import Header from '../components/Header/Header.js';
import Slider from '../components/Slider/Slider.js';
import React, {useEffect,useRef} from "react";

const ViewPage = (props) => {
    const { id } = props;

    const styles = {
        body: {
            overflow: 'hidden',
            height: "100vh",
            width: "100vw",
        }
    } 

    useEffect(() => {
        for(var i in styles.body){
            document.body.style[i] = styles.body[i];
        }
    }, []);

    return (
        <>
            <Header title="Book Name"/>
            <div className="page-container reorder-page">
                <div className=""> 
                    <Slider book_id={id.id}/>
                </div>
            </div>
        </>
    )
    
}

export default ViewPage;