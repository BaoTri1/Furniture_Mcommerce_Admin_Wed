import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import queryString from 'query-string'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import Chart from 'react-apexcharts'

import StatusCard from '../components/status-card/StatusCard'
import { useToast } from '../context/toast'

import serviceApi from '../api/serviceApi';


const ChartOptions = {
  series: [{
    name: '',
    data: []
  }],
  options: {
    color: '#6ab04c',
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
      categories: []
    },
    legend: {
      show: true,
      position: 'top'
    },
    gird: {
      show: false
    }
  }
}

const colors = [
  '#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
  '#f48024', '#69d2e7'
]

const ChartRevenueOptions = {
  series: [{
    data: []
  }],
  options: {
    chart: {
      height: 350,
      type: 'bar',
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '10%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: [
      ],
      labels: {
        style: {
          colors: colors,
          fontSize: '12px'
        }
      }
    }
  },
}


const chartProductMostOptions = {
  series: [],
  options: {
    chart: {
      width: 380,
      type: 'pie',
    },
    labels: [],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  },
}

const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const Dashboard = () => {

  const themeReducer = useSelector(state => state.ThemeReducer.mode)
  const { error } = useToast();
  const [numProduct, setNumProduct] = useState(0);
  const [numUser, setNumUser] = useState(0);

  const [chartProParCat, setchartProParCat] = useState(ChartOptions);
  const [chartMostProduct, setChartMostProduct] = useState(chartProductMostOptions);
  const [chartRevenue, setChartRevenue] = useState(ChartRevenueOptions);

  const [month, setMonth] = useState(new Date());
  const [selectYearMonth, setSelectYearMonth] = useState(`${new Date().getUTCFullYear()}${new Date().getUTCMonth() + 1}`)

  const [numOrderForMonth, setNumOrderForMpnth] = useState(0);
  const [numProductForMonth, setNumProductForMonth] = useState(0);
  const [toltalSalesForMonth, setToltalSalesForMonth] = useState(0);

  // const [numOrderProcess, setNumOrderProcess] = useState(0);
  // const [numOrderReadyDelivery, setNumOrderReadyDelivery] = useState(0);
  // const [numOrderDelivering, setNumOrderDelivering] = useState(0);
  // const [numOrderSuccess, setNumOrderSuccess] = useState(0);
  // const [numOrderCancle, setNumOrderCancle] = useState(0);

  const [listOrderStatus, setListOrderStatus] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await serviceApi.getInformation();
        console.log(response.data);
        if (response.data.errCode === 0) {
          setNumProduct(response.data.numProduct);
          setNumUser(response.data.numUser);
        } else {
          console.log(response.data.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getInfo();

    const getStatisticalProduct_ParentCategory = async () => {
      try {
        const response = await serviceApi.getStatisticalProduct_ParentCategory();
        console.log(response.data);
        if (response.data.errCode === 0) {
          let dataChart = []
          let categoryChart = []
          console.log(response.data.result);
          // response.data.result.map((item, index) => (
          //   dataChart.push(item.totalProducts)
          //   categoryChart.push(item.categoryName)
          // ))
          for (let i = 0; i < response.data.result.length; i++) {
            dataChart.push(response.data.result[i].totalProducts)
            categoryChart.push(response.data.result[i].categoryName)
          }
          setchartProParCat({
            series: [{
              name: 'Sản phẩm',
              data: dataChart
            }],
            options: {
              ...chartProParCat.options,
              xaxis: {
                categories: categoryChart
              },
            }

          })
        } else {
          console.log(response.data.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getStatisticalProduct_ParentCategory();
  }, [])

  useEffect(() => {
    const paramsString = queryString.stringify({ yearMonth: selectYearMonth });
    const getStatisticalForMonth = async () => {
      try {
        //const paramsString = queryString.stringify({ yearMonth: selectYearMonth });
        const response = await serviceApi.getStatisticalForMonth(paramsString);
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data)
          setToltalSalesForMonth(response.data.ToltalProduct_Amount[0].totalInvoiceAmount)
          setNumOrderForMpnth(response.data.TotalInvoicest[0].totalInvoices)
          setNumProductForMonth(response.data.ToltalProduct_Amount[0].totalSoldProducts)

        } else {
          console.log(response.data.errMessage)
          error(response.data.errMessage)
          setToltalSalesForMonth(0)
          setNumOrderForMpnth(0)
          setNumProductForMonth(0)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getStatisticalForMonth();

    const getStatisticalMostProductForMonth = async () => {
      try {
        const response = await serviceApi.getStatisticalMostProductForMonth(paramsString);
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data)
          let dataChart = []
          let labelChart = []
          console.log(response.data.products);
          // response.data.products.map((item, index) => {
          //   dataChart.push(parseInt(item.totalSoldQuantity, 10));
          //   labelChart.push(item.productName);
          // })
          for(let i = 0; i < response.data.products.length; i++) {
            dataChart.push(parseInt(response.data.products[i].totalSoldQuantity, 10));
            labelChart.push(response.data.products[i].productName);
          }

          console.log(dataChart);
          setChartMostProduct({
            series: dataChart,
            options: {
              ...chartMostProduct.options,
              labels: labelChart,
            }

          })

        } else {
          console.log(response.data.errMessage)
          error(response.data.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getStatisticalMostProductForMonth();

    const getMonthlyRevenueStatisticsByCategory = async () => {
      try {
        const response = await serviceApi.getMonthlyRevenueStatisticsByCategory(paramsString);
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data.result)
          let dataChart = []
          let labelChart = []
          for (let i = 0; i < response.data.result.length; i++){
            dataChart.push(response.data.result[i].totalRevenue);
            labelChart.push(response.data.result[i].categoryName);
          }
          console.log(dataChart);
          setChartRevenue({
            series: [{
              name: 'doanh thu (VND)',
              data: dataChart
            }],
            options: {
              ...ChartRevenueOptions.options,
              xaxis: {
                categories: labelChart,
                labels: {
                  style: {
                    colors: colors,
                    fontSize: '14px'
                  }
                }
              }
            }
          })
        } else {
          console.log(response.data.errMessage)
          error(response.data.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getMonthlyRevenueStatisticsByCategory();

    const getOrderByListStatus = async () => {
      try {
        const response = await serviceApi.getOrderByListStatus(paramsString);
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data.result)
          //setNumOrderProcess(response.data.result)
          setListOrderStatus(response.data.result)
        } else {
          console.log(response.data.errMessage)
          error(response.data.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getOrderByListStatus();
  }, [selectYearMonth]);

  const handleSelectMonth = (date) => {
    console.log(`${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`)
    setSelectYearMonth(`${date.getUTCFullYear()}${date.getUTCMonth() + 1}`)
    setMonth(date);
  }

  const renderMonthContent = (month, shortMonth, longMonth) => {
    const tooltipText = `Tooltip for month: ${longMonth}`;
    return <span title={tooltipText}>{month + 1}</span>;
  };

  return (
    <div>
      <h2 className="page-header">Thống kê</h2>
      <div className="row">
        <div className="col-3">
          <div className="row full-height">
            <div className='col-12'>
              <StatusCard
                icon='bx bx-shopping-bag'
                count={numProduct}
                title='Tổng số sản phẩm của cửa hàng'
              />
            </div>
            <div className='col-12'>
              <StatusCard
                icon='bx bx-user-pin'
                count={numUser}
                title='người dùng đăng ký tài khoản'
              />
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="card full-height">
            <div className="card__header">
              <h3>số lượng sản phẩm theo từng danh mục</h3>
            </div>
            {/*Biểu đồ*/}
            <Chart
              options={themeReducer === 'theme-mode-dark' ? {
                ...chartProParCat.options, theme: { mode: 'dark' },
              } :
                { ...chartProParCat.options, theme: { mode: 'light' }, }}
              series={chartProParCat.series}
              type='bar'
              height='100%'
            />
          </div>
        </div>
      </div>
      <div className="page-filter" style={{ justifyContent: 'flex-end' }}>
        <h5 className='lable-filter' style={{ paddingTop: 20, paddingRight: 20, paddingLeft: 20 }}>Chọn tháng:</h5>
        <div>
          <DatePicker
            className='container-select'
            showMonthYearPicker
            renderMonthContent={renderMonthContent}
            selected={month}
            onChange={handleSelectMonth}
            dateFormat={'MM/yyyy'}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-5">
          <div className="row">
            <div className='col-12'>
              <StatusCard
                icon='bx bx-dollar-circle'
                count={VND.format(toltalSalesForMonth)}
                title={`tổng doanh thu của tháng ${month.getUTCMonth() + 1}/${month.getUTCFullYear()}`}
              />
            </div>
            <div className='col-6'>
              <StatusCard
                icon='bx bx-receipt'
                count={numOrderForMonth}
                title={`tổng đơn hàng của thàng ${month.getUTCMonth() + 1}/${month.getUTCFullYear()}`}
              />
            </div>
            <div className='col-6'>
              <StatusCard
                icon='bx bx-shopping-bag'
                count={numProductForMonth}
                title={`tổng phẩm đã bán của tháng ${month.getUTCMonth() + 1}/${month.getUTCFullYear()}`}
              />
            </div>
          </div>
        </div>
        <div className="col-7">
          <div className="card full-height">
            <div className="card__header">
              <h3>sản phẩm bán nhiều nhất</h3>
            </div>
            <Chart
              options={themeReducer === 'theme-mode-dark' ? {
                ...chartMostProduct.options, theme: { mode: 'dark' },
              } :
                { ...chartMostProduct.options, theme: { mode: 'light' }, }}
              series={chartMostProduct.series}
              type='pie'
              height='100%'
            />
          </div>
        </div>
        <div className="col-12">
          <div className="card full-height">
            <div className="card__header">
              <h3>doanh thu theo từng danh mục</h3>
            </div>
            <Chart
              options={themeReducer === 'theme-mode-dark' ? {
                ...chartRevenue.options, theme: { mode: 'dark' },
              } :
                { ...chartRevenue.options, theme: { mode: 'light' }, }}
              series={chartRevenue.series}
              type='bar'
              height='350'
            />
          </div>
        </div>
      </div>
      <div className="row">
        {
          listOrderStatus.map((item, index) => (
            <div className="col-6" key={index}>
              <StatusCard
                icon='bx bx-receipt'
                count={item.orderCount}
                title={` đơn hàng ${item.orderStatus} của tháng ${month.getUTCMonth() + 1}/${month.getUTCFullYear()}`}
              />        
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Dashboard
