import Styles from './CanvasButton.css';
import {useSelector,useDispatch} from 'react-redux';
import {showSideNav,hideSideNav, showBottomSlide, hideBottomSlide} from '../../actions';


const CanvasButton = (props) => {
    const dispatch = useDispatch()

    const viewBox = `0 0 ${props.icon.icon[0]} ${props.icon.icon[1]}`
    return(
        <div className="canvas-button" id={props.id} onClick={ () => dispatch(showBottomSlide(props.id)) }>
            <svg aria-hidden="true" focusable="false" data-prefix={props.icon.prefix} data-icon={props.icon.iconName} class="svg-inline--fa " role="img" xmlns="http://www.w3.org/2000/svg" viewBox={viewBox}><path fill="currentColor" d={props.icon.icon[4]}></path></svg>
            <span>{props.text}</span>
        </div>
    )
}

export default CanvasButton;