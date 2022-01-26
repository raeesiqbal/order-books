import Styles from './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const Header = (props) => {
    return (
        <header>
            <div className="container">
                <div className="navigation">
                    <div className="navigation-back">
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    <div className="page-title">
                        {props.title}
                    </div>
                    <div className="menu-ham">
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header;