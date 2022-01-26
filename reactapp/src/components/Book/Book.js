import Styles from './Book.css';
import {ROOT_URL} from '../../helpers/AssetHelper.js';

const Book = ({book, toggleModal}) => {
    return (
        <div className="book" onClick={() => toggleModal(book)}>
			<div className="text">
				<h1>{book.name}</h1>
				<p>{book.subtitle}</p>
				<div className="img-container">
					<img src={ROOT_URL() + book.cover} />
				</div>
			</div>
			<div className="dots">
				<div className="dot"></div>
				<div className="dot"></div>
				<div className="dot"></div>
			</div>
		</div>
    )
}

export default Book;