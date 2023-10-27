import React from 'react'
import { useState, useEffect, useRef } from 'react'
import queryString from 'query-string'


import Table from '../components/table/Table'
import Search from '../components/search/Search'
import userApi from '../api/userApi'
import Paginate from '../components/paginate/paginate'

const customerTableHead = [
  'ID',
  'Tên người dùng',
  'Giới tính',
  'email',
  'Số điện thoại',
  'Ngày sinh',
  'SĐT đăng nhập',
  'Ngày tạo tài khoản'
]

const renderHead = (item, index) => (
  <th key={index}>{item}</th>
)

const renderBody = (item, index) => (
  <tr key={index}>
    <td>{item.idUser}</td>
    <td>{item.fullName}</td>
    <td>{item.gender ? item.gender === 1 ? 'Nam' : 'Nữ' : 'còn trống'}</td>
    <td>{item.email ? item.email : 'còn trống'}</td>
    <td>{item.sdtUser ? item.sdtUser : 'còn trống'}</td>
    <td>{item.dateOfBirth ? formatDate(item.dateOfBirth) : 'còn trống'}</td>
    <td>{item.username}</td>
    <td>{formatDate(item.dayCreateAccount)}</td>
  </tr>
)

const formatDate = (dateString) => {
  var dateObject = new Date(dateString);

  // Trích xuất thông tin về ngày, tháng và năm
  var day = dateObject.getDate();
  var month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
  var year = dateObject.getFullYear();

  var formattedMonth = (month < 10) ? '0' + month : month;

  return `${day}/${formattedMonth}/${year}`

}

const Customer = () => {

  const [listUser, setListUser] = useState([]);
  const [filterUser, setFilterUser] = useState({
    page: 1,
    limit: 20,
    search: ''
  });
  const [isHidden, setIsHidden] = useState(false);
  const [totalPageUser, setTotalPageUser] = useState(1);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const getListUser = async () => {
      try {
        const paramsString = queryString.stringify(filterUser);
        const response = await userApi.getListUserByPage(paramsString);
        console.log(response.data);
        if (response.data.results.errCode === 0) {
          console.log(response.data.results);
          setListUser(response.data.results.data);
          setTotalPageUser(response.data.results.total_page);
        } else {
          console.log(response.data.results.errMessage)
          setListUser([])
          setIsHidden(true)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListUser();
  }, [filterUser])

  const handlePageChange = (event) => {
    console.log('page-category', event.selected + 1)
    setFilterUser({
        ...filterUser,
        page: event.selected + 1
    })
  }

  const handleSearch = (e) => {
    const value = e.target.value;

    if (value === '') {
        typingTimeoutRef.current = setTimeout(() => {
            setFilterUser({
                ...filterUser,
                page: 1,
                search: ''
            })
            setIsHidden(false);
        }, 300);
    }

    if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
        setFilterUser({
            ...filterUser,
            page: 1,
            search: value
        })
        setIsHidden(false);
    }, 300);
}

  return (
    <div>
      <div className="top-page">
        <h2 className='page-header'>Quản lý người dùng</h2>
        <div><Search
          onchange={handleSearch}
        />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              <Table
                limit='10'
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={listUser}
                renderBody={(item, index) => renderBody(item, index)}
              />
            </div>
            <div className="card__footer">
              {
                !isHidden ? <Paginate
                  totalPage={totalPageUser}
                  handlePageChange={handlePageChange}
                /> : <div></div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customer
