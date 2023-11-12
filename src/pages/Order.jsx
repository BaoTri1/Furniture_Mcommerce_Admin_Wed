import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import queryString from 'query-string'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import Search from '../components/search/Search'
import Table from '../components/table/Table'
import { useToast } from '../context/toast'
import ConfirmDialog from '../components/confirmdialog/ConfirmDialog'
import Paginate from '../components/paginate/paginate'
import Badge from '../components/badge/Badge'
import Dropdown from '../components/dropdown/Dropdown';

import orderApi from '../api/orderApi'

const dayjs = require('dayjs');

const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

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

const renderOrderHead = (item, index) => (
  <th key={index}>{item}</th>
);

const orderHead = [
  'Mã',
  'Ngày tạo',
  'Ngày cập nhật',
  'Khách hàng',
  'Trạng thái đơn hàng',
  'Thanh toán',
  'Tổng tiền',
  '',
  ''
]

const priceFilter = [
  {
    id: '0-1000000000',
    value: 'Tất cả'
  },
  {
    id: '0-10000000',
    value: `Dưới ${VND.format(10000000)}`
  },
  {
    id: '10000000-20000000',
    value: `${VND.format(10000000)} - ${VND.format(20000000)}`
  },
  {
    id: '20000000-30000000',
    value: `${VND.format(20000000)} - ${VND.format(30000000)}`
  },
  {
    id: '30000000-1000000000',
    value: `${VND.format(30000000)} trở lên`
  },
]

const orderStatus = {
  'Đang chờ xử lý': 'R1',
  'Đã sẵn sàng giao hàng': 'R2',
  'Đang giao hàng': 'R3',
  'Đã giao hàng thành công': 'R4',
  'Đã hủy': 'R5'
}

const paymentStatus = {
  1: 'R4',
  0: 'R5'
}

const paymentfilter = [
  {
    id: '',
    value: 'Tất cả'
  },
  {
    id: '1',
    value: 'Đã thanh toán'
  },
  {
    id: '0',
    value: 'Chưa thann toán'
  },
]

const Order = () => {

  const [listOrder, setListOrder] = useState([]);
  const [filterOrder, setFilterOrder] = useState({
    page: 1,
    limit: 20,
    dayCreate: '',
    dayUpdate: '',
    search: '',
    price: '0-1000000000',
    payStatus: ''
  });

  const [open, setopen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [titleDialog, setTitleDialog] = useState('');
  const [contentDialog, setContentDialog] = useState('');
  const [id, setID] = useState('');
  const { error, success } = useToast();

  const typingTimeoutRef = useRef(null);

  const [listStatus, setListStatus] = useState([]);
  const [selectStatus, setSelectStatus] = useState('');
  const [dayCreate, setDayCreate] = useState(new Date());
  const [dayUpdate, setDayUpdate] = useState(new Date());
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('0-1000000000');
  const [selectedPayStatus, setSelectedPayStatus] = useState('');

  useEffect(() => {
    const getListOrder = async () => {
      try {
        const paramsString = queryString.stringify(filterOrder);
        const response = await orderApi.getListOrderByPage(paramsString);
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data);
          setListOrder(response.data.orders);
          setTotalPage(response.data.total_page);
        } else {
          console.log(response.data.errMessage)
          setListOrder([])
          setIsHidden(true)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListOrder();
  }, [filterOrder])

  useEffect(() => {
    const getListStatus = async () => {
      try {
        //const paramsString = queryString.stringify({page: 24});
        const response = await orderApi.getListStatus();
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data.status);
          const newList = [{ idStatus: '', name: 'Tất cả' }, ...response.data.status];
          setListStatus(newList);
        } else {
          console.log(response.data.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListStatus();
  }, []);

  const renderOrderBody = (item, index) => (
    <tr key={index}>
      <td>{item.idOrder}</td>
      <td>{formatDate(item.dayCreateAt)}</td>
      <td>{formatDate(item.dayUpdateAt)}</td>
      <td>{item.nameCustomer}</td>
      <td><Badge type={orderStatus[item.name]} content={item.name} /></td>
      <td><Badge type={paymentStatus[item.payStatus]} content={item.payStatus === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'} /></td>
      <td>{VND.format(item.total)}</td>
      <td><Link to={{
        pathname: `/orders/${item.idOrder}`,
        state: { idOrder: item.idOrder, isEdit: false }
      }}
        className='customLink'>
        <i className='bx bx-show' style={{ fontSize: '1.7rem' }}></i></Link></td>
      <td><Link to={{
        pathname: `/orders/edit/${item.idOrder}`,
        state: { idOrder: item.idOrder, isEdit: true }
      }}
        className='customLink'>
        <i className='bx bx-edit-alt' style={{ fontSize: '1.7rem' }}></i></Link>

      </td>
    </tr>
  )

  const openDialogConfirm = (title, content, idDelete) => {
    setTitleDialog(title);
    setContentDialog(content);
    setID(idDelete);
    setopen(!open);
  }

  const closeDialogConfirm = () => {
    console.log('Closed dialog');
    setopen(!open);
  }


  const handleSearch = (e) => {
    const value = e.target.value;

    if (value === '') {
      typingTimeoutRef.current = setTimeout(() => {
        setFilterOrder({
          ...filterOrder,
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
      setFilterOrder({
        ...filterOrder,
        page: 1,
        search: value
      })
      setIsHidden(false);
    }, 300);
  }

  const handlePageChange = (event) => {
    console.log('page-product', event.selected + 1)
    setFilterOrder({
      ...filterOrder,
      page: event.selected + 1
    })
  }

  const handleDelete = async () => {
    // console.log('idProduct', id);
    // const reponse = await productApi.deleteproduct(id);
    // if (reponse.data.results.errCode !== 0) {
    //   error(reponse.data.results.errMessage)
    // } else {
    //   success(reponse.data.results.errMessage)
    //   window.location.reload();
    // }
  }

  const handleSelectStatusChange = (event) => {
    setSelectStatus(event.target.value);
    // console.log('category', selectedCategory);
    setFilterOrder({
      ...filterOrder,
      page: 1,
      status: event.target.value === 'Tất cả' ? '' : event.target.value
    })
    setIsHidden(false);
  };

  const handleSelectPriceFilterChange = (event) => {
    setSelectedPriceFilter(event.target.value);
    setFilterOrder({
      ...filterOrder,
      page: 1,
      price: event.target.value === 'Tất cả' ? '' : event.target.value
    })
    setIsHidden(false);
  };

  const handleSelectPayStatusChange = (event) => {
    setSelectedPayStatus(event.target.value);
    setFilterOrder({
      ...filterOrder,
      page: 1,
      payStatus: event.target.value === 'Tất cả' ? '' : event.target.value
    })
    setIsHidden(false);
  };

  const handleSelectDateCreate = (date) => {
    console.log(formatDate(date))
    setDayCreate(date);
    setFilterOrder({
      ...filterOrder,
      page: 1,
      dayCreate: formatDate(date)
    })
    setIsHidden(false);
  }

  const handleSelectDateUpdate = (date) => {
    console.log(formatDate(date))
    setDayUpdate(date)
    setFilterOrder({
      ...filterOrder,
      page: 1,
      dayUpdate: formatDate(date)
    })
    setIsHidden(false);
  }

  const handleClearFilter = () => {
      setFilterOrder({
        page: 1,
        limit: 20,
        dayCreate: '',
        dayUpdate: '',
        search: '',
        price: '0-1000000000',
        payStatus: ''
      });
      setSelectStatus('');
      setSelectedPriceFilter('0-1000000000');
      setSelectedPayStatus('');
      setDayCreate(new Date());
      setDayUpdate(new Date());
  }


  return (
    <div>
      <div className="top-page">
        <h2 className='page-header'>Quản lý đơn hàng</h2>
        <div className='page-actions'>
          <div>
            <button onClick={handleClearFilter} className='btn-design'>Xóa bộ lọc</button>
          </div>
          <Search
            onchange={handleSearch}
          />
        </div>
      </div>
      <div className="page-filter">
        <h5 className='lable-filter' style={{ paddingTop: 20, paddingRight: 20, paddingLeft: 20 }}>Lọc theo trạng thái:</h5>
        <div className='container-select'>
          <select value={selectStatus} onChange={handleSelectStatusChange}>
            {listStatus.map((option, index) => (
              <option key={index} value={option.idStatus}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <h5 className='lable-filter' style={{ paddingTop: 20, paddingRight: 20, paddingLeft: 20 }}>Lọc theo ngày tạo:</h5>
        <div>
          <DatePicker
            className='container-select'
            showTimeSelect
            selected={dayCreate}
            onChange={handleSelectDateCreate}
            dateFormat={'dd/MM/yyyy'}
          />
        </div>
        <h5 className='lable-filter' style={{ paddingTop: 20, paddingRight: 20, paddingLeft: 20 }}>Lọc theo ngày cập nhật:</h5>
        <div>
          <DatePicker
            className='container-select'
            showTimeSelect
            selected={dayUpdate}
            onChange={handleSelectDateUpdate}
            dateFormat={'dd/MM/yyyy'}
          />
        </div>
        <h5 className='lable-filter' style={{ paddingTop: 20, paddingRight: 20, paddingLeft: 20 }}>Lọc theo thanh toán:</h5>
        <div className='container-select'>
          <select value={selectedPayStatus} onChange={handleSelectPayStatusChange}>
            {paymentfilter.map((option, index) => (
              <option key={index} value={option.id}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
        <h5 className='lable-filter' style={{ paddingTop: 20, paddingRight: 20, paddingLeft: 20 }}>Lọc theo giá:</h5>
        <div className='container-select'>
          <select value={selectedPriceFilter} onChange={handleSelectPriceFilterChange}>
            {priceFilter.map((option, index) => (
              <option key={index} value={option.id}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        <div className="col-12 full-height">
          <div className="card">
            <div className="card__body">
              <Table
                headData={orderHead}
                renderHead={(item, index) => renderOrderHead(item, index)}
                bodyData={listOrder}
                renderBody={(item, index) => renderOrderBody(item, index)}
              />
            </div>
            <div className="card__footer">
              {
                !isHidden ?
                  <div><Paginate
                    totalPage={totalPage}
                    handlePageChange={handlePageChange}
                  /></div> : <div></div>
              }
            </div>
          </div>

        </div>
      </div>
      {open && <ConfirmDialog
        clickConfirm={handleDelete}
        clickClose={closeDialogConfirm}
        title={titleDialog}
        content={contentDialog}
      />}
    </div>
  )
}

export default Order
