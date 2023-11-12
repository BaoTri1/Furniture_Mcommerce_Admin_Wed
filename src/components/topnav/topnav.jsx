import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

import './topnav.css'

import Dropdown from '../dropdown/Dropdown'
import ThemeMenu from '../thememenu/ThemeMenu'
import orderApi from '../../api/orderApi'

import notifications from '../../assets/JsonData/notification.json'
import user_menu from '../../assets/JsonData/user_menus.json'

const curr_user = {
  display_name: sessionStorage.getItem('name'),
  image: sessionStorage.getItem('avatar')
}

console.log(curr_user.display_name, curr_user.image)

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

const formatDate = (dateString) => {
  // Tạo đối tượng Date từ chuỗi thời gian
  var inputTime = new Date(dateString);

  // Lấy các thành phần ngày, tháng, năm
  var year = inputTime.getUTCFullYear();
  var month = ('0' + (inputTime.getUTCMonth() + 1)).slice(-2);  // Thêm số 0 ở đầu nếu cần
  var day = ('0' + inputTime.getUTCDate()).slice(-2);  // Thêm số 0 ở đầu nếu cần

  // Format lại theo YYYY-MM-DD
  var outputTimeStr = year + '-' + month + '-' + day;
  return outputTimeStr;

}

const renderUserMenu = (item, index) => (
  <Link to='/' key={index}>
      <div className='notification-item'>
          <i className={item.icon}></i>
          <span>{item.content}</span>  
      </div>   
  </Link>
)

const rendernotification = (item, index) => (
  <div className="notification-item" key={index}>
      <span>Chưa có đơn hàng chưa xử lý nào</span>
  </div>
)

const Topnav = () => {

  const [Badge, setBadge] = useState(0);
  const [listNotifications, setListNotifications] = useState([]);

  useEffect(() => {
    const getListOrderProcess = async () => {
      try {
        //const paramsString = queryString.stringify({page: 24});
        const response = await orderApi.getListOrderProcess();
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data.orders);
          setListNotifications(response.data.orders);
          setBadge(response.data.badge);
        } else {
          console.log(response.data.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListOrderProcess();
  }, [])
  
  const rendernotificationItem = (item, index) => (
    Badge === 0 ?
    <div className="notification-item" key={index}>
      <span>Chưa có đơn hàng chưa xử lý nào</span>
    </div> 
    : 
    <div className="notification-item" key={index}>
        <i className="bx bx-cart"></i>
        <span>{item.idOrder}<br/>ngày tạo: {formatDate(item.dayCreateAt)}</span>
    </div>
  )

  return (
    <div className='topnav'>
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
            badge = {Badge === 0 ? '' : Badge}
            contentData={listNotifications}
            renderItems={(item, index) => rendernotificationItem(item, index)}
            renderFooter={() => <Link to='/orders'>Xem tất cả</Link> }
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
