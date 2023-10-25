import React from 'react'
import { useState, useEffect } from "react";
import { useHistory, useLocation } from 'react-router-dom'

import '../../../assets/css/form.css'
import productApi from '../../../api/productApi';
import { useToast } from '../../../context/toast';

const FormTypeRoom = () => {

  const history = useHistory();
  const location = useLocation();
  const [isEdit, setIsEdit] = useState(false);
  const [nameTypeRoom, setNameTypeRoom] = useState('');
  const [idTypeRoom, setIDTypeRoom] = useState('');
  const { error, success } = useToast();

  const handleAddTypeRoom= async () => {
    console.log('addTypeRoom', nameTypeRoom)
    if (!nameTypeRoom) {
      error("Tên không được bỏ trống!");
      return;
    }
    try {
      const response = await productApi.addTypeRoom({ name: nameTypeRoom});
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

  const handleUpdateTypeRoom = async () => {
    console.log('update', nameTypeRoom, idTypeRoom)
    if (!nameTypeRoom) {
      error("Tên không được bỏ trống!");
      return;
    }
    try {
      const response = await productApi.updateTypeRoom(idTypeRoom, { name: nameTypeRoom });
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
    const typeroominfo = location.state;

    if (typeroominfo) {
      var inputname = document.getElementById('inputName');
      inputname.value = typeroominfo.nameRoom;
      setNameTypeRoom(typeroominfo.nameRoom);
      setIDTypeRoom(typeroominfo.idRoom);
      setIsEdit(true);

    }
  }, [location.state]);

  return (
    <div>
      <div className="top-page-form">
        <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
        <h2 className='page-header'>
          {
            isEdit ? 'Chỉnh sửa loại phòng' : 'Thêm mới loại phòng'
          }
        </h2>
      </div>
      <div className="row wrapper">
        <div className="form" style={{maxWidth: '350px'}}>
          <div className="input-container">
            <input id='inputName' type="text" placeholder="Nhập tên loại phòng..." onChange={(e) => setNameTypeRoom(e.target.value)} />
            <span>
            </span>
          </div>
          <button type="submit" className="submit" onClick={isEdit ? handleUpdateTypeRoom : handleAddTypeRoom}>
            {
              isEdit ? 'Cập nhật loại phòng' : 'Thêm loại phòng'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormTypeRoom
