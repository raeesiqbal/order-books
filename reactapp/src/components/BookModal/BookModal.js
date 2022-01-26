import Styles from './BookModal.css';
import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal";


Modal.setAppElement("#root");

const BookModal = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    return (
        <Modal isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog">
        <div>My modal dialog.</div>
        <button>Close modal</button>
      </Modal>
    )
}

export default BookModal;