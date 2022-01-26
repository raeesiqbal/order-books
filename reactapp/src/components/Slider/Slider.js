import Styles from './Slider.css';
import React, {useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronRight, faChevronLeft} from '@fortawesome/free-solid-svg-icons';
const BACKEND_URL = "http://127.0.0.1:8000"

const Slider = ({book_id}) => {
  const [pages, setPages] = useState([]);

    useEffect(() => {
      fetch(`${BACKEND_URL}/api/book/${book_id}/`)
      .then(res => {
          if (res.ok)
              return res.json()
      })
      .then(res => {
          setPages(res.pages);
          console.log(res.pages)
      })
      .catch(err => console.log(err))
    }, []);


    var [currentIndex, setIndex] = useState(0);
    var [translateValue, setTranslateValue] = useState(0);


    const goToPrevSlide = () => {
        if(currentIndex === 0)
          return;
        
          setIndex(currentIndex-1)
          setTranslateValue(translateValue + (slideWidth()))
    }
    
    const goToNextSlide = () => {
        if(currentIndex === pages.length - 1) {
          setIndex(currentIndex = 0)
          return setTranslateValue(translateValue = 0)
        }
        
        setIndex(currentIndex+1)
        setTranslateValue(translateValue + (-slideWidth()))
    }
    
    const  slideWidth = () => {
        return document.querySelector('.slide').clientWidth
    }

    const Slide = ({ image }) => {
        const styles = {
            backgroundImage: `url(${image})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 60%'
        }
        return <div className="slide" style={styles}></div>
    }
    
    
    const LeftArrow = (props) => {
        return (
            <div className="backArrow arrow" onClick={props.goToPrevSlide}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </div>
        );
    }
    
    
    const RightArrow = (props) => {
        return (
            <div className="nextArrow arrow" onClick={props.goToNextSlide}>
                <FontAwesomeIcon icon={faChevronRight} />
            </div>
        );
    }
    return (
        <div className="slider">
  
          <div className="slider-wrapper"
            style={{
              transform: `translateX(${translateValue}px)`,
              transition: 'transform ease-out 0.45s'
            }}>
              {
                pages.map((page, i) => (
                  <Slide key={i} image={page.image} />
                ))
              }
          </div>
  
          <LeftArrow
           goToPrevSlide={goToPrevSlide}
          />
  
          <RightArrow
           goToNextSlide={goToNextSlide}
          />
        </div>
    );
}


export default Slider;