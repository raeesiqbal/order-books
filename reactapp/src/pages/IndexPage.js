import {A} from 'hookrouter';
import { useState } from 'react';
import { fabric } from "fabric";
import Header from '../components/Header/Header.js';
import Styles from './IndexPage.css';
import UploadButton from '../components/UploadButton/UploadButton.js'
import { useAlert } from 'react-alert'

const BACKEND_URL = "http://127.0.0.1:8000"
const Index = () => {
    const [books, setBooks] = useState([]);
    const [titleValue, setTitleValue] = useState("");
    const [subtitleValue, setSubtitleValue] = useState("");
    const [pageTitleValue, setPageTitleValue] = useState("");
    const [cover, setCover] = useState();

    const alert = useAlert()

    
    const addBook = (e) => {
        e.preventDefault();
        console.log(cover)
        const canvasEl = document.createElement("canvas")
        var canvas = new fabric.Canvas(canvasEl, {
            backgroundColor: "#fff",
            selection: false,
        });
        const formData = new FormData();
        formData.append('canvas',  JSON.stringify(canvas.toJSON()));
        // formData.append('cover', cover.name);
        formData.append('cover', cover, cover.name); 
        formData.append('name', titleValue);
        formData.append('subtitle', subtitleValue);
        formData.append('title', pageTitleValue);
        formData.append('image', `${BACKEND_URL}/static/images/blank.jpg`)
        fetch(`${BACKEND_URL}/api/book/`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(res => {
            setBooks([...books, res]);
            alert.show('Book created successfully!', {
                type: 'success',
            })
            }
        ).catch(err=>console.log(err))
    }
    
    return (
        <>
        <Header title="Scrapbook App"/>
        <div className="all-books-container">
        <A className="btn btn-primary btn-sm" href={`/books`}>View all books</A>
        </div>

        <div className="page-container reorder-page">
            <div className="container page-padding"> 
                <div class="flex-container">
                    <div>
                        {books.map(book => (
                            <div key={book.id}>
                                <ul>
                                    <li><A href={`pages/${book.id}`}>{book.name}</A></li>
                                </ul>
                            </div>
                        ))}
                        <form onSubmit={addBook} enctype="multipart/form-data">
                            <input value={titleValue} onChange={ (e) => setTitleValue(e.target.value)} type="text" placeholder="Book Title"/>
                            <input value={subtitleValue} onChange={ (e) => setSubtitleValue (e.target.value)} type="text" placeholder="Book Subtitle"/>
                            <input value={pageTitleValue} onChange={ (e) => setPageTitleValue (e.target.value)} type="text" placeholder="First Page name"/>
                            <br/>
                            <UploadButton text={"Upload Book Cover"} name="upload_file" uploadImage={setCover}/>
                            <br/>
                            <br/>
                            <button type="submit" value="Submit" className="btn btn-primary">Create new book</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Index;
