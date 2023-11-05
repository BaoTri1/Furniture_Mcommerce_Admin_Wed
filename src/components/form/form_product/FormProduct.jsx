import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import '../../../assets/css/form.css'
import './formproduct.css'

import productApi from '../../../api/productApi'
import { useToast } from '../../../context/toast'
import DrapAnhDropUploader from '../../drapanddropuploader/DrapAnhDropUploader';

var FormData = require('form-data');

const FormProduct = () => {

    const history = useHistory();
    const location = useLocation();
    const { error, success, info } = useToast();
    const [isEdit, setIsEdit] = useState(false);

    const [idProduct, setIDProduct] = useState('');
    const [nameProduct, setNameProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(0);
    const [material, setMaterial] = useState('');
    const [size, setSize] = useState('');
    const [describe, setDescribe] = useState('');

    const [listCategory, setListCategory] = useState([]);
    const [selectCategory, setSelectCategory] = useState('C1');
    const [listTypeRoom, setListTypeRoom] = useState([]);
    const [selectTypeRoom, setSelectTypeRoom] = useState('');

    const [avatar, setAvatar] = useState([]);
    const [detailImage, setDetailImage] = useState([]);

    const [images, setImages] = useState([]);

    useEffect(() => {
        const getListCategory = async () => {
            try {
                //const paramsString = queryString.stringify({page: 24});
                const response = await productApi.getListCategory();
                console.log(response.data);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results.data);
                    setListCategory(response.data.results.data);
                } else {
                    console.log(response.data.results.errMessage)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getListCategory();
    }, []);

    useEffect(() => {
        const getLisTypeRoom = async () => {
            try {
                //const paramsString = queryString.stringify({page: 24});
                const response = await productApi.getListTyperoom();
                console.log(response.data);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results.data);
                    const newList = [{ idRoom: '', nameRoom: '--Chọn loại phòng--' }, ...response.data.results.data];
                    setListTypeRoom(newList);
                } else {
                    console.log(response.data.results.errMessage)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getLisTypeRoom();
    }, []);

    useEffect(() => {
        const productinfo = location.state;
        if (productinfo) {
            setIsEdit(true);
            setIDProduct(productinfo.idProduct);
            const getInfoProduct = async () => {
                const paramsString = queryString.stringify({ id: productinfo.idProduct });
                const response = await productApi.getInfoProduct(paramsString);
                console.log(response.data);
                if (response.data.errCode === 0) {
                    document.getElementById('inputName').value = response.data.product.nameProduct;
                    setNameProduct(response.data.product.nameProduct)
                    setSelectCategory(response.data.product.idCat);
                    setSelectTypeRoom(!response.data.product.idRoom ? '' : response.data.product.idRoom);
                    document.getElementById('inputPrice').value = response.data.product.price;
                    setPrice(response.data.product.price)
                    document.getElementById('inputMaterial').value = response.data.product.material;
                    setMaterial(response.data.product.material)
                    document.getElementById('inputsize').value = response.data.product.size;
                    setSize(response.data.product.size)
                    document.getElementById('inputQuantity').value = response.data.product.quantity;
                    setQuantity(response.data.product.quantity);
                    document.getElementById('input-description').value = response.data.product.description;
                    setDescribe(response.data.product.description)
                    setUpListImage(response.data.product.imgUrl, response.data.product.listImageDetail);
                }
            }
            getInfoProduct();
        }
    }, [location.state]);

    const handleUpdateProduct = async () => {
        console.log('update')
        if (!nameProduct) {
            error("Trường tên sản phẩm không được bỏ trống!");
            return;
        }

        if (!price || price <= 0) {
            error("Giá sản phẩm không hợp lệ!");
            return;
        }

        if (!material) {
            error("Trường vật liệu không được bỏ trống!");
            return;
        }

        if (!size) {
            error("Trường kích thước không được bỏ trống!");
            return;
        }

        if (!describe) {
            error("Trường mô tả sản phẩm không được bỏ trống!");
            return;
        }

        try {
            const response = await productApi.updateProduct(idProduct, {
                idCategory: selectCategory,
                idTypesRoom: selectTypeRoom,
                nameProduct: nameProduct,
                price: price,
                quantity: quantity,
                material: material,
                size: size,
                description: describe
            });
            console.log(response)
            if (response.data.results.errCode !== 0) {
                error(response.data.results.errMessage)
            } else {
                info('Đang cập nhật lại sản phẩm...')
                if (avatar.length !== 0) {
                    const uploadAvatarProduct = new FormData();
                    uploadAvatarProduct.append('image', avatar[0]);
                    uploadAvatarProduct.append('idProduct', idProduct);
                    uploadAvatarProduct.append('typeImg', 'Avatar');
                    const responseUploadAvatar = await productApi.updateAvatarProduct(uploadAvatarProduct);
                    console.log(responseUploadAvatar)
                    if (responseUploadAvatar.data.results.errCode === 0) {
                        success(responseUploadAvatar.data.results.errMessage)
                    }else{
                        error(responseUploadAvatar.data.results.errMessage)
                    }
                }

                if (detailImage.length !== 0) {
                    const uploadDetailImageProduct = new FormData();
                    for (let i = 0; i < detailImage.length; i++) {
                        uploadDetailImageProduct.append('images', detailImage[i]);
                    }
                    uploadDetailImageProduct.append('idProduct', idProduct);
                    uploadDetailImageProduct.append('typeImg', 'Detail');
                    console.log('formdata', uploadDetailImageProduct)
                    const responseUploadDetailImage = await productApi.updateDetailImageProduct(uploadDetailImageProduct);
                    if (responseUploadDetailImage.data.results.errCode === 0) {
                        success(responseUploadDetailImage.data.results.errMessage)
                    } else {
                        error(responseUploadDetailImage.data.results.errMessage)
                    }
                }
                success(response.data.results.errMessage)
                //clear();
                //history.goBack();
            }
        } catch (error) {
            console.error('Call API failed', error);
        }
    }

    const handleAddProduct = async () => {
        if (!nameProduct) {
            error("Trường tên sản phẩm không được bỏ trống!");
            return;
        }

        if (!price || price <= 0) {
            error("Giá sản phẩm không hợp lệ!");
            return;
        }

        if (!quantity || quantity <= 0) {
            error("Số lượng sản phẩm không hợp lệ!");
            return;
        }

        if (!material) {
            error("Trường vật liệu không được bỏ trống!");
            return;
        }

        if (!size) {
            error("Trường kích thước không được bỏ trống!");
            return;
        }

        if (!describe) {
            error("Trường mô tả sản phẩm không được bỏ trống!");
            return;
        }

        if (avatar.length === 0) {
            error("Phải chọn ảnh đại diện cho sản phẩm!");
            return;
        }

        try {
            const response = await productApi.createProduct({
                idCategory: selectCategory,
                idTypesRoom: selectTypeRoom,
                nameProduct: nameProduct,
                price: price,
                quantity: quantity,
                material: material,
                size: size,
                description: describe
            });
            console.log(response)
            if (response.data.results.errCode !== 0) {
                error(response.data.results.errMessage)
            } else {
                info('Đang thêm sản phẩm...')
                const uploadAvatarProduct = new FormData();
                uploadAvatarProduct.append('image', avatar[0]);
                uploadAvatarProduct.append('idProduct', response.data.results.idProduct);
                uploadAvatarProduct.append('typeImg', 'Avatar');
                const responseUploadAvatar = await productApi.uploadAvatarProduct(uploadAvatarProduct);
                console.log(responseUploadAvatar)
                if (responseUploadAvatar.data.results.errCode === 0) {
                    if (detailImage.length !== 0) {
                        const uploadDetailImageProduct = new FormData();
                        for (let i = 0; i < detailImage.length; i++) {
                            uploadDetailImageProduct.append('images', detailImage[i]);
                        }
                        uploadDetailImageProduct.append('idProduct', response.data.results.idProduct);
                        uploadDetailImageProduct.append('typeImg', 'Detail');
                        console.log('formdata', uploadDetailImageProduct)
                        const responseUploadDetailImage = await productApi.uploadDetailImageProduct(uploadDetailImageProduct);
                        if (responseUploadDetailImage.data.results.errCode === 0) {
                            success(response.data.results.errMessage)
                            clear();
                        } else {
                            error(response.data.results.errMessage)
                        }
                    } else {
                        success(response.data.results.errMessage)
                        clear();
                    }
                }
                //history.goBack();
            }
        } catch (error) {
            console.error('Call API failed', error);
        }
    }

    const handleQuatityChange = (e) => {
        console.log('So luong: ', e.target.value);
        let newQuantity = +e.target.value
        setQuantity(newQuantity);
    }

    const handleMinus = () => {
        if (quantity > 1)
            setQuantity(quantity - 1);
        console.log('So luong: ', quantity);
    };

    const handlePlus = () => {
        setQuantity(quantity + 1);
        console.log('So luong: ', quantity);
        console.log('So luong type: ', typeof (quantity));
    };

    const handleSelectCategoryChange = (event) => {
        setSelectCategory(event.target.value);
    };

    const handleSelectTypeRoomChange = (event) => {
        setSelectTypeRoom(event.target.value);
    };

    const clear = () => {
        document.getElementById('inputName').value = '';
        document.getElementById('inputPrice').value = '';
        document.getElementById('inputMaterial').value = '';
        document.getElementById('inputsize').value = '';
        document.getElementById('inputQuantity').value = '';
        setQuantity(1);
        document.getElementById('input-description').value = '';
    }

    const setUpListImage = (avatar, listDetailImage) => {
        let images = [];
        images.push(avatar);
        console.log('avatar', avatar)
        for (let i = 0; i < listDetailImage.length; i++) {
            console.log('detail', listDetailImage[i].imgUrl)
            images.push(listDetailImage[i].imgUrl);
        }
        console.log('images', images)
        setImages(images)
    }

    return (
        <div>
            <div className="top-page-form">
                <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
                <h2 className='page-header'>
                    {
                        isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm mới sản phẩm'
                    }
                </h2>
            </div>
            <div className="wrapper">
                <div className="form">
                    <div className="row">
                        <div className="col-6">
                            <table className='table-form-product'>
                                <tbody className='table-tbody-product'>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="name-product">Tên sản phẩm</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputName' type="text" placeholder="Nhập tên sản phẩm..." onChange={(e) => setNameProduct(e.target.value)} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Loại sản phẩm</label></td>
                                        <td>
                                            <div className="input-container">
                                                <select value={selectCategory} onChange={handleSelectCategoryChange} className="custom-select">
                                                    {listCategory.map((option, index) => (
                                                        <option key={index} value={option.idCat}>
                                                            {option.nameCat}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Thuộc loại phòng</label></td>
                                        <td>
                                            <div className="input-container">
                                                <select value={selectTypeRoom} onChange={handleSelectTypeRoomChange} className="custom-select">
                                                    {listTypeRoom.map((option, index) => (
                                                        <option key={index} value={option.idRoom}>
                                                            {option.nameRoom}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Giá sản phẩm</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputPrice' type="number" min={1} placeholder="Nhập giá sản phẩm..." onChange={(e) => setPrice(e.target.value)} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Vật liệu</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputMaterial' type="text" min={1} placeholder="Nhập vật liệu sản phẩm..." onChange={(e) => setMaterial(e.target.value)} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Kích thước</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputsize' type="text" min={1} placeholder="Nhập kích thước sản phẩm..." onChange={(e) => setSize(e.target.value)} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Số lượng</label></td>
                                        <td style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <div className="icon-wrapper" onClick={handleMinus}>
                                                <i className='bx bx-minus'></i>
                                            </div>
                                            <div className="input-container">
                                                <input id='inputQuantity' type="number" min={1} value={quantity} onChange={handleQuatityChange}
                                                    style={{ textAlign: 'center', maxWidth: '160px', }}
                                                />
                                            </div>
                                            <div className="icon-wrapper" onClick={handlePlus}>
                                                <i className='bx bx-plus'></i>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Mô tả sản phẩm</label></td>
                                        <td>
                                            <div className="input-container">
                                                <textarea id='input-description' type="text" min={1} placeholder="Nhập mô tả sản phẩm..." onChange={(e) => setDescribe(e.target.value)} />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-6">
                            <div>
                                <div className="wrapper-span-title">
                                    <span className='lbl-title'>Chọn ảnh chính của sản phẩm</span>
                                </div>
                                <DrapAnhDropUploader
                                    multiple={false}
                                    setfile={setAvatar}
                                />
                            </div>

                            <div>
                                <div className="wrapper-span-title">
                                    <span className='lbl-title'>Chọn ảnh chi tiết của sản phẩm</span>
                                </div>
                                <DrapAnhDropUploader
                                    multiple={true}
                                    setfile={setDetailImage}
                                />
                            </div>

                            {
                                isEdit ?
                                    <div>
                                        <div className="wrapper-span-title">
                                            <span className='lbl-title'>Hình ảnh sản phẩm</span>
                                        </div>
                                        <div className="image-wrrapper">
                                            {
                                                images.map((image, index) => (
                                                    <div className="image-product" key={index}>
                                                        <img src={image} alt='' />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    : <></>
                            }

                        </div>
                    </div>
                    <div className="btn-wrapper">
                        <button type="submit" className="submit btn-submit-product" onClick={isEdit ? handleUpdateProduct : handleAddProduct}>
                            {
                                isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormProduct
