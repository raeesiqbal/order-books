import isSideNavActiveReducer from './sideNav';
import isBottomSlideActiveReducer from './bottomSlide';
import backgrounds from './backgrounds';
import shapes from './shapes';
import text from './text';
import fonts from './fonts';
import updatePanelState from './updatePanelState';
import objectStates from './objectStates';

import {combineReducers} from 'redux';

const allReducer = combineReducers({
    isSideNavActive: isSideNavActiveReducer,
    isBottomSlideActive: isBottomSlideActiveReducer,
    backgrounds: backgrounds,
    shapes: shapes,
    text: text,
    fonts: fonts,
    updatePanelState: updatePanelState,
    objectStates: objectStates,
})

export default allReducer;