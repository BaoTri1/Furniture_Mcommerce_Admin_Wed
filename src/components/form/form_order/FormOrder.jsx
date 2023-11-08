import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import '../../../assets/css/form.css'

import { useToast } from '../../../context/toast'
import Table from '../../table/Table'
import orderApi from '../../../api/orderApi'
import Dropdown from '../../dropdown/Dropdown';

const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

const dateformat = (day) => {
    const date = new Date(day);
    const addLeadingZero = (number) => (number < 10 ? '0' : '') + number;

    // Định dạng ngày giờ theo định dạng "YYYY-MM-DD HH:MI:SS"
    const formattedDateTime = `${date.getFullYear()}-${addLeadingZero(date.getMonth() + 1)}-${addLeadingZero(date.getDate())} ${addLeadingZero(date.getHours())}:${addLeadingZero(date.getMinutes())}:${addLeadingZero(date.getSeconds())}`;
    
    console.log("Ngày giờ định dạng SQL:", formattedDateTime);
    return formattedDateTime;
}

const productHead = [
    'STT',
    'Sản phẩm',
    'Số lượng',
    'giá',
]

const renderProductHead = (item, index) => (
    <th key={index}>{item}</th>
);

const paymentStatus = [
    {
        'status': 1,
        'name': 'Đã thanh toán'
    },
    {
        'status': 0,
        'name': 'Chưa thanh toán'
    },
]

const FormOrder = () => {

    const history = useHistory();
    const location = useLocation();
    const { error, success, info } = useToast();
    const [isEdit, setIsEdit] = useState(false);
    const [listProduct, setListProduct] = useState([]);

    const [idOrder, setIDOrder] = useState('');
    const [nameCustomer, setNameCustomer] = useState('');
    const [sdt, setSDT] = useState('');
    const [address, setAddress] = useState('');

    const [listStatus, setListStatus] = useState([]);
    const [selectStatus, setSelectStatus] = useState('');
    const [selectStatusPayment, setSelectStatusPayment] = useState('');

    useEffect(() => {
        const orderInfor = location.state;
        if (orderInfor) {
            console.log(orderInfor.isEdit)
            setIsEdit(orderInfor.isEdit)
            setIDOrder(orderInfor.idOrder)
            console.log(orderInfor.idOrder)
            const getInfoOrder = async () => {
                const paramsString = queryString.stringify({ id: orderInfor.idOrder });
                const response = await orderApi.getInforOrder(paramsString);
                console.log(response.data);
                if (response.data.errCode === 0) {
                    document.getElementById('inputID').value = response.data.orders.idOrder;
                    document.getElementById('inputCustomer').value = response.data.orders.NameCustomer;
                    setNameCustomer(response.data.orders.NameCustomer);
                    document.getElementById('inputPhone').value = response.data.orders.SDT;
                    setSDT(response.data.orders.SDT);
                    document.getElementById('inputAddress').value = response.data.orders.address;
                    setAddress(response.data.orders.address);
                    document.getElementById('inputDayCreate').value = dateformat(response.data.orders.dayCreateAt);
                    document.getElementById('inputDayUpdate').value = dateformat(response.data.orders.dayUpdateAt);
                    orderInfor.isEdit ? setSelectStatus(response.data.orders.idStatus) : document.getElementById('inputStatus').value = response.data.orders.name;
                    orderInfor.isEdit ? setSelectStatusPayment(response.data.orders.StatusPayment) : document.getElementById('inputStatusPayment').value = response.data.orders.StatusPayment === 0 ? 'Chưa thanh toán': 'Đã thanh toán';
                    document.getElementById('inputTotal').value = response.data.orders.total;
                    setListProduct(response.data.orders.DetailOrder);
                }
            }
            getInfoOrder();
        }
    }, [location.state]);

    useEffect(() => {
        const getListStatus = async () => {
            try {
              //const paramsString = queryString.stringify({page: 24});
              const response = await orderApi.getListStatus();
              console.log(response.data);
              if (response.data.errCode === 0) {
                console.log(response.data.status);
                setListStatus(response.data.status);
              } else {
                console.log(response.data.errMessage)
              }
      
            } catch (error) {
              console.error('Call API failed', error);
            }
          }
          getListStatus();
      }, []);

    const renderProductBody = (item, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.nameProduct}</td>
            <td>{item.numProduct}</td>
            <td>{VND.format(item.finalPrice)}</td>
        </tr>
    )

    const handleUpdateOrder = async () => {
        console.log('update')
        if (!nameCustomer) {
            error("Trường khách hàng không được bỏ trống!");
            return;
        }

        if (!sdt) {
            error("Trường số điện thoại không được bỏ trống!");
            return;
        }

        if (!address) {
            error("Trường địa chỉ không được bỏ trống!");
            return;
        }

        try {
            const response = await orderApi.updateOrder(idOrder, {
                nameCustomer: nameCustomer,
                sdtOrder: sdt,
                address: address,
                status: selectStatus,
                payStatus: selectStatusPayment,
            });
            console.log(response)
            if (response.data.errCode !== 0) {
                error(response.data.errMessage)
            } else {
                success(response.data.errMessage)
                //clear();
                //history.goBack();
            }   
        } catch (error) {
            console.error('Call API failed', error);
        }
    }

    return (
        <div>
            <div className="top-page-form">
                <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
                <h2 className='page-header'>
                    {
                       isEdit? 'Cập nhật thông tin đơn hàng' : 'Chi tiết đơn hàng'
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
                                        <td className='table-td-label'><label htmlFor="name-product">Mã đơn hàng</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputID' type="text" placeholder="" onChange={(e) => { }} disabled={true}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Khách hàng</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputCustomer' placeholder="" onChange={(e) => {setNameCustomer(e.target.value)}} disabled={!isEdit} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Số điện thoại</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputPhone' type="text" placeholder="" onChange={(e) => {setSDT(e.target.value)}} disabled={!isEdit}/>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Địa chỉ giao hàng</label></td>
                                        <td>
                                            <div className="input-container">
                                                <textarea id='inputAddress' type="text" min={1} onChange={(e) => {setAddress(e.target.value)}} disabled={!isEdit}/>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-6">
                            <table className='table-form-product'>
                                <tbody className='table-tbody-product'>
                                    <tr>
                                        <td className='table-td-label' style={{ maxWidth: 220 }}><label htmlFor="name-product">Ngày tạo</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputDayCreate' type="text" placeholder="" onChange={(e) => { }} disabled={true}/>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className='table-td-label' style={{ maxWidth: 220 }}><label htmlFor="price-product">Ngày cập nhật</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputDayUpdate' placeholder="" onChange={(e) => { }} disabled={true}/>
                                            </div>
                                        </td>
                                        
                                    </tr>
                                    <tr>
                                        <td className='table-td-label' style={{ maxWidth: 220 }}><label htmlFor="name-product">Trạng thái đơn hàng</label></td>
                                        {
                                            isEdit ? 
                                            <td>
                                                <div className="input-container">
                                                    <select value={selectStatus} onChange={(e) =>{setSelectStatus(e.target.value)}} className="custom-select">
                                                        {listStatus.map((option, index) => (
                                                            <option key={index} value={option.idStatus}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td> :
                                            <td>
                                                <div className="input-container">
                                                    <input id='inputStatus' type="text" placeholder="" onChange={(e) => {selectStatusPayment(e.target.value)}} disabled={!isEdit}/>
                                                </div>
                                            </td>
                                        }
                                    </tr>

                                    <tr>
                                        <td className='table-td-label' style={{ maxWidth: 220 }}><label htmlFor="price-product">Trạng thái thanh toán</label></td>
                                        {
                                            isEdit ? 
                                            <td>
                                                <div className="input-container">
                                                    <select value={selectStatusPayment} onChange={(e) =>{setSelectStatusPayment(e.target.value)}} className="custom-select">
                                                        {paymentStatus.map((option, index) => (
                                                            <option key={index} value={option.status}>
                                                                {option.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td> :
                                            <td>
                                            <div className="input-container">
                                                <input id='inputStatusPayment' placeholder="" onChange={(e) => { }} disabled={!isEdit}/>
                                            </div>
                                        </td>
                                        }
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="price-product">Tổng tiền</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputTotal' type="number" min={1} placeholder="" onChange={(e) => { }} disabled={true}/>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-12">
                            <Table
                                headData={productHead}
                                renderHead={(item, index) => renderProductHead(item, index)}
                                bodyData={listProduct}
                                renderBody={(item, index) => renderProductBody(item, index)}
                            />
                        </div>
                    </div>
                    <div className="btn-wrapper" style={{ marginTop: 20 }}>
                        <button type="submit" className="submit btn-submit-product" onClick={handleUpdateOrder}>
                                Cập nhật đơn hàng  
                        </button>
                    </div> 
                </div>
            </div>                           
        </div>
    )
}

export default FormOrder
