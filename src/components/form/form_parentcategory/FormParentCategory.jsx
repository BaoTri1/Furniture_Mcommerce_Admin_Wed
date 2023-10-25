import React from 'react'
import { useState, useEffect } from "react";
import { useHistory, useLocation } from 'react-router-dom'

import '../../../assets/css/form.css'
import productApi from '../../../api/productApi';
import { useToast } from '../../../context/toast';

const FormParentCategory = () => {

    const history = useHistory();
    const location = useLocation();
    const [nameParentCategory, setNameParentCategory] = useState('');
    const [idParentCategory, setIDParentCategory] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const { error, success } = useToast();

    const handleAddParentCategory= async () => {
        console.log('addparentcategory', nameParentCategory)
        if (!nameParentCategory) {
          error("Tên không được bỏ trống!");
          return;
        }
        try {
          const response = await productApi.addParentCategory({ name: nameParentCategory});
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
    
      const handleUpdateParentCategory = async () => {
        console.log('update', nameParentCategory, idParentCategory)
        if (!nameParentCategory) {
          error("Tên không được bỏ trống!");
          return;
        }
        try {
          const response = await productApi.updateParentCategory(idParentCategory, { name: nameParentCategory });
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
        const parentcategoryinfo = location.state;
    
        if (parentcategoryinfo) {
          var inputname = document.getElementById('inputName');
          inputname.value = parentcategoryinfo.name;
          setNameParentCategory(parentcategoryinfo.name);
          setIDParentCategory(parentcategoryinfo.idCatParent);
          setIsEdit(true);
    
        }
      }, [location.state]);

    return (
        <div>
            <div className="top-page-form">
                <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
                <h2 className='page-header'>
                    {
                        isEdit ? 'Chỉnh sửa nhóm danh mục' : 'Thêm mới nhóm danh mục'
                    }
                </h2>
            </div>
            <div className="row wrapper">
                <div className="form" style={{maxWidth: '350px'}}>
                    <div className="input-container">
                        <input id='inputName' type="text" placeholder="Nhập tên nhóm danh mục..." onChange={(e) => setNameParentCategory(e.target.value)} />
                        <span>
                        </span>
                    </div>
                    <button type="submit" className="submit" onClick={isEdit ? handleUpdateParentCategory : handleAddParentCategory}>
                        {
                            isEdit ? 'Cập nhật nhóm danh mục' : 'Thêm nhóm danh mục'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormParentCategory
