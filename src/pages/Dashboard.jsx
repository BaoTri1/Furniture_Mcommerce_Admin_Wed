import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

import Chart from 'react-apexcharts'

import StatusCard from '../components/status-card/StatusCard'
import Table from '../components/table/Table'
import Badge from '../components/badge/Badge'

import statusCards from '../assets/JsonData/status-card-data.json'

const ChartOptions = {
  series: [{
    name: 'Online Customers',
    data: [40, 70, 20, 90, 36, 80, 30, 91, 60]
  }, {
    name: 'Store Customers',
    data: [40, 30, 70, 80, 40, 16, 40, 20, 51, 10]
  }],
  options: {
    color: ['#6ab04c', '#2980b9'],
    Chart: {
      background: 'transparent'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
    },
    legend: {
      position: 'top'
    },
    gird: {
      show: false
    }
  }
}

const topCustomers = {
  head: [
    'user',
    'total orders',
    'total spending'
  ],
  body: [
    {
      'username': 'john doe',
      'order': '490',
      'price': '$15,870'
    },
    {
      'username': 'frank iva',
      'order': '250',
      'price': '$12,251'
    },
    {
      'username': 'anthony baker',
      'order': '120',
      'price': '$10,840'
    },
    {
      'username': 'john doe',
      'order': '470',
      'price': '$15,470'
    }
  ]
}

const renderCustomerHead = (item, index) => (
  <th key={index}>{item}</th>
)

const renderCustomerBody = (item, index) => (
  <tr key={index}>
    <td>{item.username}</td>
    <td>{item.order}</td>
    <td>{item.price}</td>
  </tr>
)

const lastesOrders = {
  head: [
    'order id',
    'user',
    'total price',
    'date',
    'status'
  ],
  body: [
    {
      'id': 'ORDER1',
      'user': 'john doe',
      'date': '10/10/2023',
      'price': '$900',
      'status': 'Đã sẵn sàng giao hàng'
    },
    {
      'id': 'ORDER2',
      'user': 'frank iva',
      'date': '10/10/2023',
      'price': '$800',
      'status': 'Đang giao hàng'
    },
    {
      'id': 'ORDER3',
      'user': 'anthony baker',
      'date': '10/10/2023',
      'price': '$600',
      'status': 'Đã giao hàng thành công'
    },
    {
      'id': 'ORDER4',
      'user': 'john doe',
      'date': '10/10/2023',
      'price': '$900',
      'status': 'Đang chờ xử lý'
    },
  ]
}

const orderStatus = {
  'Đang chờ xử lý': 'R1',
  'Đã sẵn sàng giao hàng': 'R2',
  'Đang giao hàng': 'R3',
  'Đã giao hàng thành công': 'R4'
}

const renderOrderHead = (item, index) => (
  <th key={index}>{item}</th>
)

const renderOrderBody = (item, index) => (
  <tr key={index}>
    <td>{item.id}</td>
    <td>{item.user}</td>
    <td>{item.price}</td>
    <td>{item.date}</td>
    <td>
        <Badge type={orderStatus[item.status]} content={item.status}/>
    </td>
  </tr>
)

const Dashboard = () => {

  const themeReducer = useSelector(state => state.ThemeReducer.mode)

  

  return (
    <div>
      <h2 className="page-header">Thống kê</h2>
      <div className="row">
        <div className="col-6">
          <div className="row">
            {
              statusCards.map((item, index) => (
                <div className="col-6" key={index}>
                  <StatusCard
                    key={index}
                    icon={item.icon}
                    count={item.count}
                    title={item.title}
                  />
                </div>
              ))
            }
          </div>
        </div>
        <div className="col-6">
          <div className="card full-height">
            {/*Biểu đồ*/}
            <Chart
              options={themeReducer === 'theme-mode-dark' ? {
                ...ChartOptions.options, theme: {mode: 'dark'},
              } : 
              {...ChartOptions.options, theme: {mode: 'light'},}}
              series={ChartOptions.series}
              type='line'
              height='100%'
            />
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card__header">
              <h3>top customers</h3>
            </div>
            <div className="card__body">
              <Table
                headData={topCustomers.head}
                renderHead={(item, index) => renderCustomerHead(item, index)}
                bodyData={topCustomers.body}
                renderBody={(item, index) => renderCustomerBody(item, index)}
              />
            </div>
            <div className="card__footer">
              <Link to='/'>Xem tất cả</Link>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="card">
            <div className="card__header">
              <h3>Đơn hàng mới nhất</h3>
            </div>
            <div className="card__body">
              <Table
                headData={lastesOrders.head}
                renderHead={(item, index) => renderOrderHead(item, index)}
                bodyData={lastesOrders.body}
                renderBody={(item, index) => renderOrderBody(item, index)}
              />
            </div>
            <div className="card__footer">
              <Link to='/'>Xem tất cả</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
