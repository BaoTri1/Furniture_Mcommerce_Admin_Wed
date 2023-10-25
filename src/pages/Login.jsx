import React, { useState } from 'react'

import '../assets/css/form.css';

import userApi from '../api/userApi';
import { useToast } from '../context/toast';

import imgLogin from '../assets/images/img_chair.png';
import { useHistory } from 'react-router-dom';

const Login = () => {

    const history = useHistory();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const { error, success } = useToast();

    const login = async () => {
        try {
            if (!username || !password) {
                error('Phải nhập số điện thoại và mật khẩ để đăng nhập');
            } else {
                const response = await userApi.login({ sdt: username, passwd: password });
                console.log(response.data.userData.errCode);
                if(response.data.userData.errCode !== 0){
                    error(response.data.userData.errMessage);
                }else {
                    if(response.data.userData.isAdmin !== 1){
                        error('Bạn không phải là người quản trị. Hãy sử dụng tài khoản quản trị.');
                        return;
                    }
                    console.log(response.data.userData);
                    sessionStorage.setItem('accessToken', response.data.userData.access_token);
                    sessionStorage.setItem('avatar', response.data.userData.userInfor.avatar);
                    sessionStorage.setItem('name', response.data.userData.userInfor.fullName);
                    success("Đăng nhập thành công");
                    history.replace('/');
                    window.location.reload();
                }
            }

        } catch (error) {
            console.error('Đăng nhập thất bại', error);
            error('Đăng nhập thất bại')
        }
        
    }

    return (
        <div className="backgroung__login">
            <div className='login'>
                <div className='img__login'>
                    <img src={imgLogin} alt="" />
                </div>
                <div className="form__login">
                    <div className="form">
                        <p className="form-title">Đăng nhập tài khoản quản trị</p>
                        <div className="input-container">
                            <input type="text" placeholder="Nhập tài khoản..." onChange={(e) => setUserName(e.target.value)} />
                            <span>
                            </span>
                        </div>
                        <div className="input-container">
                            <input type="password" placeholder="Nhập mật khẩu..." onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="submit" onClick={login}>
                            Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
