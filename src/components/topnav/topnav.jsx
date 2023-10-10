import React from 'react'
import { Link } from 'react-router-dom'

import './topnav.css'

import Dropdown from '../dropdown/Dropdown'
import ThemeMenu from '../thememenu/ThemeMenu'

import notifications from '../../assets/JsonData/notification.json'
import user_image from '../../assets/images/tuat.png'
import user_menu from '../../assets/JsonData/user_menus.json'

const curr_user = {
  display_name: 'Tuan Tran',
  image: user_image
}

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
        <img src={user.image} alt="" />
    </div>
    <div className="topnav__right-user__name">
        {user.display_name}
    </div>
  </div>
)

const renderUserMenu = (item, index) => (
  <Link to='/' key={index}>
      <div className='notification-item'>
          <i className={item.icon}></i>
          <span>{item.content}</span>  
      </div>   
  </Link>
)

const rendernotificationItem = (item, index) => (
    <div className="notification-item" key={index}>
        <i className={item.icon}></i>
        <span>{item.content}</span>
    </div>
)

const Topnav = () => {
  return (
    <div className='topnav'>
      <div className="topnav__search">
        <input type="text" placeholder='Tìm kiếm tại đây...' />
        <i className='bx bx-search'></i>
      </div>
      <div className="topnav__right">
        <div className="top__right-item">
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index)}
          />
        </div>

        <div className="top__right-item">
          <Dropdown 
            icon='bx bx-bell'
            badge='12'
            contentData={notifications}
            renderItems={(item, index) => rendernotificationItem(item, index)}
            renderFooter={() => <Link to='/'>Xem tất cả</Link> }
          />
        </div>

        <div className="top__right-item">
            <ThemeMenu />
        </div>
      </div>
    </div>
  )
}

export default Topnav
