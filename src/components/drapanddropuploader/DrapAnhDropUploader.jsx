import React from 'react'
import { useState, useRef } from 'react';
import './drapanddropuploader.css'

const DrapAnhDropUploader = props => {
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const selectFiles = () => {
        fileInputRef.current.click();
    }

    const onFilesSelect = (e) => {
        const files = e.target.files
        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue;
            if (!images.some((e) => e.name === files[i].name)) {
                if(props.multiple) {
                    props.setfile((prevImages) => [
                        ...prevImages,
                        files[i]
                    ])
                    setImages((prevImages) => [
                        ...prevImages,
                        {
                            name: files[i].name,
                            url: URL.createObjectURL(files[i]),
                        }
                    ])
                }else {
                    props.setfile(() => [
                        files[i]
                    ])
                    setImages(() => [
                        {
                            name: files[i].name,
                            url: URL.createObjectURL(files[i]),
                        }
                    ])
                }
            }
        }
    }

    const deleteFiles = (index) => {
        props.setfile((prevImages) => (
            prevImages.filter((_, i) => i !== index)
        ))
        setImages((prevImages) => (
            prevImages.filter((_, i) => i !== index)
        ));
    }

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
        e.dataTransfer.dropEffect = 'copy';
    }

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    }

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length === 0) return;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue;
            if (!images.some((e) => e.name === files[i].name)) {
                if(props.multiple) {
                    props.setfile((prevImages) => [
                        ...prevImages,
                        files[i]
                    ])
                    setImages((prevImages) => [
                        ...prevImages,
                        {
                            name: files[i].name,
                            url: URL.createObjectURL(files[i]),
                        }
                    ])
                }else {
                    props.setfile(() => [
                        files[i]
                    ])
                    setImages(() => [
                        {
                            name: files[i].name,
                            url: URL.createObjectURL(files[i]),
                        }
                    ])
                }
            }
        }
    }

    return (
        <div>
            <div className="wrapper-select-image">
                {/* <div className="top">
                    <p>Trình kéo và thả hình ảnh</p>
                </div> */}
                <div className="drag-area" onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                    {
                        isDragging ? (<span className="select">Thả hình ảnh vào đây</span>)
                            : (
                                <>
                                    Kéo và thả hình ảnh vào đây hoặc {' '}
                                    <span className="select" role='button' onClick={selectFiles}>Chọn ảnh</span>
                                </>
                            )
                    }
                    <input type="file" name='file' className='file' multiple={props.multiple} ref={fileInputRef} onChange={onFilesSelect} />
                </div>
                <div className="container">
                    {
                        images.map((image, index) => (
                            <div className="image" key={index}>
                                <span className="delete" onClick={() => deleteFiles(index)}>&times;</span>
                                <img src={image.url} alt={image.name} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default DrapAnhDropUploader
