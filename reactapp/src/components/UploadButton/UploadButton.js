import Styles from './UploadButton.css';

const UploadButton = ({uploadImage, name, text}) => {
    return (
        <div class="upload-btn-wrapper">
            <button class="btn btn-primary btn-block">{text}</button>
            <input type="file" name={name} onChange={(e) => uploadImage(e.target.files[0])}/>
        </div>
    )
}

export default UploadButton;