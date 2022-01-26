import Styles from "./BooksPage.css";
import Header from "../components/Header/Header.js";
import Book from "../components/Book/Book.js";
import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faBars,
  faAlignCenter,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from 'react-alert'
import { A } from "hookrouter";
Modal.setAppElement("#root");
const BACKEND_URL = "http://127.0.0.1:8000";

const BooksPage = (props) => {
  const [books, setBooks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeBook, setActiveBook] = useState();
  const alert = useAlert()

  const customStyles = {
    content: {
      border: "0",
      background: "transparent",
    },
  };

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/book/`)
      .then((res) => res.json())
      .then((res) => {
        setBooks(res);
      });
  }, []);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const deleteBook = () => {
    fetch(`${BACKEND_URL}/api/book/${activeBook.id}/`, {
      method: "DELETE",
    }).then(() => {
      alert.show("Book deleted successfully")
      toggleModal();
      setBooks(books.filter((book) => book.id !== activeBook.id));
    });
  };

  const toggleModalFunc = (book) => {
    setIsOpen(!isOpen);
    setActiveBook(book);
  };

  return (
    <>
      <Modal
        style={customStyles}
        isOpen={isOpen}
        onRequestClose={toggleModal}
        contentLabel="My dialog"
      >
        <div class="modale" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-header">
              <h2>{activeBook ? activeBook.name : ""}</h2>
              <span
                onClick={toggleModal}
                style={{ cursor: "pointer" }}
                class="btn-close closemodale"
                aria-hidden="true"
              >
                &times;
              </span>
            </div>
            <div class="modal-body">
              <A href={`/view/${activeBook ? activeBook.id : ""}`}>
                <div className="modal-item">
                  <div className="modal-item-icon">
                    <FontAwesomeIcon icon={faBars} />
                  </div>
                  <div className="modal-item-title">View book</div>
                </div>
              </A>
              <A href={`/pages/${activeBook ? activeBook.id : ""}`}>
                <div className="modal-item">
                  <div className="modal-item-icon">
                    <FontAwesomeIcon icon={faAlignCenter} />
                  </div>
                  <div className="modal-item-title">Reorder pages</div>
                </div>
              </A>

              <div className="modal-item" onClick={deleteBook}>
                <div className="modal-item-icon">
                  <FontAwesomeIcon icon={faMinus} />
                </div>
                <div className="modal-item-title">Delete Book</div>
              </div>
            </div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </Modal>
      <Header title="My Books" />
      <div className="page-container books-page">
        <div className="container page-padding">
          <div className={`alert-container ${books.length > 0 ? "d_none" : ""}`}>
            <p>You currently have created no books, create a new book now.</p>
            <button class="btn btn-primary btn-sm"><A href={`/`}>Create Book</A></button>
          </div>
          <div className="books-container">
            {books.map((book) => (
              <Book
                toggleModal={toggleModalFunc}
                key={book.id}
                book={book}
                onClick={() => toggleModal()}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BooksPage;
