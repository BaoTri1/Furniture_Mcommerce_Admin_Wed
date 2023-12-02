import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import '../../../assets/css/form.css'
import './formdiscount.css'

import productApi from '../../../api/productApi'
import discountApi from '../../../api/discountApi';
import { useToast } from '../../../context/toast'

const dayCurrent = new Date();

const FormDiscount = () => {

    const history = useHistory();
    const location = useLocation();

    const [listProduct, setlistProduct] = useState([]);
    const [idDiscount, setIDDiscount] = useState('');

    const [nameDiscount, setNameDiscount] = useState('');
    const [valueDiscount, setValueDiscount] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndtDate] = useState(new Date());

    const [isEdit, setIsEdit] = useState(false);
    const { error, success } = useToast();
    const [selectedOption, setSelectedOption] = useState('SP1');

    const handleAddDiscount = async () => {
        if (!nameDiscount) {
            error("Tên khuyến mãi không được bỏ trống!");
            return;
        }

        if (!valueDiscount || valueDiscount < 0 || valueDiscount > 100) {
            error("Giá trị khuyến mãi không hợp lệ!");
            return;
        }

        if (!quantity || quantity <= 0) {
            error("Số lượng giảm giá không hợp lệ!");
            return;
        }

        if(startDate < dayCurrent){
            console.log('start date', startDate);
            console.log(dayCurrent)
            error("Thời gian bắt đầu giảm giá không hợp lệ!");
            return;
        }


        if(endDate < startDate){
            error("Thời gian giảm giá không hợp lệ!");
            return;
        }

        try {
          const response = await discountApi.createDiscount({
            idProduct: selectedOption,
            nameDiscount: nameDiscount,
            value: valueDiscount,
            numDiscount: quantity,
            dayStart: startDate,
            dayEnd: endDate
          });
          console.log(response)
          if (response.data.results.errCode !== 0) {
            error(response.data.results.errMessage)
          } else {
            success(response.data.results.errMessage)
            history.goBack();
          }
        } catch (error) {
          console.error('Call API failed', error);
        }
    }

    const handleUpdateDiscount = async () => {
        if (!nameDiscount) {
            error("Tên khuyến mãi không được bỏ trống!");
            return;
        }

        if (!valueDiscount || valueDiscount < 0 || valueDiscount > 100) {
            error("Giá trị khuyến mãi không hợp lệ!");
            return;
        }

        if(startDate < dayCurrent){
            console.log('start date', startDate);
            console.log(dayCurrent)
            error("Thời gian bắt đầu giảm giá không hợp lệ!");
            return;
        }


        if(endDate < startDate){
            error("Thời gian giảm giá không hợp lệ!");
            return;
        }

        try {
          const response = await discountApi.updateDiscount(idDiscount, {
            idProduct: selectedOption,
            nameDiscount: nameDiscount,
            value: valueDiscount,
            numDiscount: quantity,
            dayStart: startDate,
            dayEnd: endDate
          });
          console.log(response)
          if (response.data.results.errCode !== 0) {
            error(response.data.results.errMessage)
          } else {
            success(response.data.results.errMessage)
            history.goBack();
          }
        } catch (error) {
          console.error('Call API failed', error);
        }
    }

    useEffect(() => {
        const getLisProduct = async () => {
            try {
                //const paramsString = queryString.stringify({page: 24});
                const response = await productApi.getListProduct();
                console.log(response.data);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results.data);
                    setlistProduct(response.data.results.data);
                } else {
                    console.log(response.data.results.errMessage)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getLisProduct();
    }, []);

    useEffect(() => {
        const discountInfo = location.state;
    
        if (discountInfo) {
          setNameDiscount(discountInfo.nameDiscount);
          document.getElementById('inputDiscount').value = discountInfo.nameDiscount;
          setValueDiscount(discountInfo.value);
          document.getElementById('inputPrice').value = discountInfo.value;
          //setQuantity(discountInfo.numDiscount);
          //document.getElementById('inputQuantity').value = discountInfo.numDiscount;
          setStartDate(new Date(discountInfo.dayStart));
          setEndtDate(new Date(discountInfo.dayEnd));
          setIsEdit(true);
          setSelectedOption(discountInfo.idProduct);
          setIDDiscount(discountInfo.idDiscount);
        }
    }, [location.state]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // const handleQuatityChange = (e) => {
    //     console.log('So luong: ', e.target.value);
    //     let newQuantity = +e.target.value
    //     setQuantity(newQuantity);
    // }

    // const handleMinus = () => {
    //     if (quantity > 1)
    //         setQuantity(quantity - 1);
    //     console.log('So luong: ', quantity);
    // };

    // const handlePlus = () => {
    //     setQuantity(quantity + 1);
    //     console.log('So luong: ', quantity);
    //     console.log('So luong type: ', typeof (quantity));
    // };


    return (
        <div>
            <div className="top-page-form">
                <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
                <h2 className='page-header'>
                    {
                        isEdit ? 'Chỉnh sửa khuyến mãi' : 'Thêm mới khuyến mãi'
                    }
                </h2>
            </div>
            <div className="wrapper">
                <div className="form" style={{ maxWidth: '970px' }}>
                    <div className="row">
                        <div className="col-12">
                            <table className='table-form-product'>
                                <tbody className='table-tbody-product'>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="name-discount">Tên khuyến mãi</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputDiscount' type="text" placeholder="Nhập tên khuyến mãi..." onChange={(e) => setNameDiscount(e.target.value)} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="select-product-discount">Chọn sản phẩm</label></td>
                                        <td>
                                            <div className="input-container">
                                                <select value={selectedOption} onChange={handleSelectChange} className="custom-select">
                                                    {listProduct.map((option, index) => (
                                                        <option key={index} value={option.idProduct}>
                                                            {option.nameProduct}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="value-discount">giá trị khuyến mãi (%)</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputPrice' type="number" min={0} max={100} placeholder="Nhập giá trị khuyến mãi..." onChange={(e) => setValueDiscount(e.target.value)} />

                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td className='table-td-label'><label htmlFor="quantity-discount">Số lượng</label></td>
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
                                    </tr> */}
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="select-date-start">Ngày bắt đầu khuyến mãi</label></td>
                                        <td>
                                            <div className="input-container">
                                                <DatePicker
                                                    showTimeSelect
                                                    selected={startDate}
                                                    onChange={(date) => setStartDate(date)}
                                                    dateFormat={'dd/MM/yyyy'}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="select-date-end">Ngày kết thúc khuyến mãi</label></td>
                                        <td>
                                            <div className="input-container">
                                                <DatePicker
                                                    showTimeSelect
                                                    selected={endDate}
                                                    onChange={(date) => setEndtDate(date)}
                                                    dateFormat={'dd/MM/yyyy'}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="btn-wrapper">
                        <button type="submit" className="submit btn-submit-product" onClick={isEdit ? handleUpdateDiscount : handleAddDiscount}>
                            {
                                isEdit ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi'
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FormDiscount
