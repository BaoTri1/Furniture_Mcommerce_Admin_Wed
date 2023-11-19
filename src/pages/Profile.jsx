import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import userApi from '../api/userApi';

const formatDate = (dateString) => {
    var dateObject = new Date(dateString);
  
    // Trích xuất thông tin về ngày, tháng và năm
    var day = dateObject.getDate();
    var month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
    var year = dateObject.getFullYear();
  
    var formattedMonth = (month < 10) ? '0' + month : month;
  
    return `${day}/${formattedMonth}/${year}`
  
  }

const Profile = () => {
    const history = useHistory();

    useEffect(() => {
        const getProfile = async () => {
            try {
                const reponse = await userApi.getInfo();
                console.log(reponse.data)
                if(reponse.data.errCode === 0){
                    //setProfile(reponse.data.userData);
                    document.getElementById('inputName').value = reponse.data.userData['fullName'];
                    document.getElementById('inputSDT').value = reponse.data.userData['sdtUser'];
                    document.getElementById('inputEmail').value = reponse.data.userData['email'];
                    document.getElementById('inputgender').value = reponse.data.userData['gender'];
                    document.getElementById('inputdayOfBirth').value = formatDate(reponse.data.userData['dateOfBirth']);
                    document.getElementById('imgUser').src = reponse.data.userData['avatar'];
                }
            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getProfile();
    }, []);

    return (
        <div>
            <div className="top-page-form">
                <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
                <h2 className='page-header'>
                    Hồ sơ
                </h2>
            </div>
            <div className="wrapper">
                <div className="form" style={{ maxWidth: '970px' }}>
                    <div className="row">
                        <div className="col-6">
                            <table className='table-form-product'>
                                <tbody className='table-tbody-product'>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="name">Họ và tên</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputName' type="text" placeholder="" disabled={true} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="select-product-discount">Số điện thoại</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputSDT' type="text" placeholder="" disabled={true} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="select-product-discount">Email</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputEmail' type="text" placeholder="" disabled={true} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="select-product-discount">Giới tính</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputgender' type="text" placeholder="" disabled={true} />
                                            </div>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td className='table-td-label'><label htmlFor="select-product-discount">Ngày sinh</label></td>
                                        <td>
                                            <div className="input-container">
                                                <input id='inputdayOfBirth' type="text" placeholder="" disabled={true} />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-6" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div className="profile__image">
                                <img src='' alt="" id='imgUser'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
