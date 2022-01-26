import Header from '../components/Header/Header.js';
import Dragula from 'react-dragula';
import React, {useEffect,useRef, useState} from "react";
import ContextStyles from './ReactContextMenu.css';
import Styles from './ReorderPage.css';
import {A} from 'hookrouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faBars }  from '@fortawesome/free-solid-svg-icons';
import Modal from "react-modal";
import { fabric } from "fabric";
import { useAlert } from 'react-alert'

Modal.setAppElement("#root");

const BACKEND_URL = "http://127.0.0.1:8000"

const ReorderPage = (props) => {
    const [pages, setPages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activePage, setActivePage] = useState();
    const alert = useAlert()

    const { id } = props;

    const canvasEl = document.createElement("canvas")
    var canvas = new fabric.Canvas(canvasEl, {
        backgroundColor: "#fff",
        selection: false,
    });

    const styles = {
        body: {
            backgroundColor: '#ddd',
        }
    } 
    const customStyles = {
        content: {
          border: '0',
          background: 'transparent',
        },
    };
    useEffect(() => {
        loadPages()


        for(var i in styles.body){
            document.body.style[i] = styles.body[i];
        }
    }, []);


    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

    const loadPages = () => {
        fetch(`${BACKEND_URL}/api/book/${id.id}/`)
            .then(res => {
                if (res.ok)
                    return res.json()
            })
            .then(res => {
                setPages(res.pages);
            })
            .catch(err => console.log(err))
    }

    const toggleModalFunc = (book) => {

        setIsOpen(!isOpen);
        setActivePage(book)
        toggleModal()
    }

    const deletePage = () => {
        fetch(`${BACKEND_URL}/api/book/${activePage.book}/page/${activePage.id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => {
                if (res.ok) {
                    alert.show('Page deleted successfully')
                    loadPages()
                    toggleModal()
            }
            })
            .catch(err => console.log(err))
    }


    const addPage = () => {
        const name = prompt("Enter page name");
        if (name){
            fetch(`${BACKEND_URL}/api/book/${id.id}/page/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    canvas: JSON.stringify(canvas.toJSON()),
                    title: name,
                    image: `${BACKEND_URL}/static/images/blank.jpg`
                })
            })
            .then(res => res.json())
            .then(res => {
                alert.show('Page added successfully!', {
                    type: 'success',
                })
                loadPages()
            }
            ).catch(err=>console.log(err))
        }
    }


    const dragulaDecorator = (componentBackingInstance) => {
        if (componentBackingInstance) {
          let options = { };
          Dragula([componentBackingInstance], options);
        }
      };
    return (
        <>
            <Modal style={customStyles} isOpen={isOpen}
                onRequestClose={toggleModal}
                contentLabel="My dialog">
            <div class="modale" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-header">
                <h2>{activePage ? activePage.name : ""}</h2>
                <a onClick={toggleModal} href="#" class="btn-close closemodale" aria-hidden="true">&times;</a>
                </div>
                <div class="modal-body">
                    <div className="modal-item">
                        <div className="modal-item-icon">
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                        <div className="modal-item-title"><A href={`/edit/${activePage ? activePage.id : ""}`}>Edit Page</A></div>
                    </div>

                    <div className="modal-item" onClick={deletePage}>
                        <div className="modal-item-icon">
                            <FontAwesomeIcon icon={faMinus} />
                        </div>
                        <div className="modal-item-title">Delete Page</div>
                    </div>
                </div>
                <div class="modal-footer">
                </div>
            </div>
            </div>
            </Modal>


            <Header title="Book Name"/>
            <div className="page-container reorder-page">
                <div className="container page-padding"> 
                    <div className="pages-container" ref={dragulaDecorator}>
                        {pages.map((page, index) =>
                            <div onClick={() => toggleModalFunc(page)} className="page-el">
                                <div className="page-el-cover" style={{background: `url("${page.image}")`}}></div>
                                <span>{index+1}</span>
                            </div>
                        )}
                        <div className="page-el" onClick={addPage}>
                            <div title="Add Page" className="page-el-cover page-el-cover--add" style={{background: `url("https://storage.needpix.com/rsynced_images/instagram-3814061_1280.png")`}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
}

export default ReorderPage;