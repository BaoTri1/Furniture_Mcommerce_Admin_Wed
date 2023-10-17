import React, { useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import './layout.css'

import Sidebar from '../sidebar/sidebar';
import Topnav from '../topnav/topnav';
import Routes from '../Routes';
import Login from '../../pages/Login';
import ThemeAction from '../../redux/actons/ThemeAction';

const Layout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer);

    const dispatch = useDispatch();

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')
        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))
        dispatch(ThemeAction.setColor(colorClass))

    }, [dispatch])

    return (

        <BrowserRouter>
            <Route
                render={(props) => {
                    return !sessionStorage.getItem('accessToken') ? <Login />
                    :
                    <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                        <Sidebar {...props} />
                        <div className='layout__content'>
                            <Topnav/>
                            <div className='layout__content-main'>
                                <Routes />
                            </div>
                        </div>
                    </div>
                }}
            />
        </BrowserRouter>
       
    )
}

export default Layout
