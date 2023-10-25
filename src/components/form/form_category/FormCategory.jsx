import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import '../../../assets/css/form.css'

import productApi from '../../../api/productApi'
import { useToast } from '../../../context/toast'

const FormCategory = () => {

  const history = useHistory();
  const location = useLocation();
  const [listcatParent, setlistcatParent] = useState([]);
  const [idCat, setIDCat] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { error, success } = useToast();

  useEffect(() => {
    const getListcatParnet = async () => {
      try {
        const response = await productApi.getListcatParent();
        console.log(response.data);
        if (response.data.results.errCode === 0) {
          console.log(response.data.results.data);
          setlistcatParent(response.data.results.data);
        } else {
          console.log(response.data.results.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListcatParnet();
  }, [])


  const [selectedOption, setSelectedOption] = useState('CP1');
  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [nameCategory, setNameCategory] = useState('');

  const handleAddCategory = async () => {
    console.log(selectedOption, nameCategory)
    if (!nameCategory) {
      error("Tên không được bỏ trống!");
      return;
    }
    try {
      const response = await productApi.addCategory({ name: nameCategory, idCatParent: selectedOption });
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

  const handleUpdateCategory = async () => {
    console.log('update', selectedOption, nameCategory)
    if (!nameCategory) {
      error("Tên không được bỏ trống!");
      return;
    }
    try {
      const response = await productApi.updateCategory(idCat, { name: nameCategory, idCatParent: selectedOption });
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
    const categoryinfo = location.state;

    if (categoryinfo) {
      setNameCategory(categoryinfo.nameCat);
      var inputname = document.getElementById('inputName');
      inputname.value = categoryinfo.nameCat;
      setIsEdit(true);
      setSelectedOption(categoryinfo.idCatParent);
      setIDCat(categoryinfo.idCat);
    }
  }, [location.state]);

  return (
    <div>
      <div className="top-page-form">
        <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
        <h2 className='page-header'>
          {
            isEdit ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục sản phẩm'
          }
        </h2>
      </div>
      <div className="row wrapper">
        <div className="form" style={{maxWidth: '350px'}}>
          <div className="input-container">
            <input id='inputName' type="text" placeholder="Nhập tên danh mục" onChange={(e) => setNameCategory(e.target.value)} />
            <span>
            </span>
          </div>
          <div className="input-container">
            <select value={selectedOption} onChange={handleSelectChange} className="custom-select">
              {listcatParent.map((option, index) => (
                <option key={index} value={option.idcatParent}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit" onClick={isEdit ? handleUpdateCategory : handleAddCategory}>
            {
              isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default FormCategory
