import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import queryString from 'query-string'

import Search from '../components/search/Search'
import Table from '../components/table/Table'
import { useToast } from '../context/toast'
import ConfirmDialog from '../components/confirmdialog/ConfirmDialog'
import productApi from '../api/productApi'
import Paginate from '../components/paginate/paginate'

const VND = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

const productHead = [
  'ID',
  'Ảnh sản phẩm',
  'Tên sản phẩm',
  'Loại sản phẩm',
  'Thuộc loại phòng',
  'Giá sản phẩm',
  'Số lượng',
  'Vật liệu',
  'Kích thước',
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

const ratingFilter = [
  {
    id: 'rating1',
    value: 'Tất cả'
  },
  {
    id: 'rating2',
    value: '1 Sao'
  },
  {
    id: 'rating3',
    value: '2 Sao'
  },
  {
    id: 'rating4',
    value: '3 Sao'
  },
  {
    id: 'rating5',
    value: '4 Sao'
  },
  {
    id: 'rating6',
    value: '5 Sao'
  },
]

const renderProductHead = (item, index) => (
  <th key={index}>{item}</th>
)

const Products = () => {

  const [listProduct, setListProduct] = useState([]);
  const [filterProduct, setFilterProduct] = useState({
    page: 1,
    limit: 20,
    category: '',
    price: '0-1000000000',
    typeroom: '',
    search: ''
  });
  const [open, setopen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [titleDialog, setTitleDialog] = useState('');
  const [contentDialog, setContentDialog] = useState('');
  const [id, setID] = useState('');
  const { error, success } = useToast();

  const [listCategory, setListCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [listTypeRoom, setListTypeRoom] = useState([]);
  const [selectedTypeRoom, setSelectedTypeRoom] = useState('');

  const [selectedPriceFilter, setSelectedPriceFilter] = useState('0-1000000000');
  //const [selectedRatingFilter, setSelectedRatingFilter] = useState('rating1');

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const getListProduct = async () => {
      try {
        const paramsString = queryString.stringify(filterProduct);
        const response = await productApi.getListProductByPage(paramsString);
        console.log(response.data);
        if (response.data.errCode === 0) {
          console.log(response.data.data);
          setListProduct(response.data.products);
          setTotalPage(response.data.total_page);
        } else {
          console.log(response.data.errMessage)
          setListProduct([])
          setIsHidden(true)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListProduct();
  }, [filterProduct])

  useEffect(() => {
    const getListCategory = async () => {
      try {
        //const paramsString = queryString.stringify({page: 24});
        const response = await productApi.getListCategory();
        console.log(response.data);
        if (response.data.results.errCode === 0) {
          console.log(response.data.results.data);
          const newList = [{ idCat: '', nameCat: 'Tất cả' }, ...response.data.results.data];
          setListCategory(newList);
        } else {
          console.log(response.data.results.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListCategory();
  }, []);

  useEffect(() => {
    const getLisTypeRoom = async () => {
      try {
        //const paramsString = queryString.stringify({page: 24});
        const response = await productApi.getListTyperoom();
        console.log(response.data);
        if (response.data.results.errCode === 0) {
          console.log(response.data.results.data);
          const newList = [{ idRoom: '', nameRoom: 'Tất cả' }, ...response.data.results.data];
          setListTypeRoom(newList);
        } else {
          console.log(response.data.results.errMessage)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getLisTypeRoom();
  }, []);

  const renderProductBody = (item, index) => (
    <tr key={index}>
      <td>{item.idProduct}</td>
      <td><div className="img__product">
        <img src={item.imgUrl} alt="" />
      </div></td>
      <td>{item.nameProduct}</td>
      <td>{item.nameCat}</td>
      <td>{item.nameRoom}</td>
      <td>{VND.format(item.price)}</td>
      <td>{item.quantity}</td>
      <td>{item.material}</td>
      <td>{item.size}</td>
      <td><Link to={{
        pathname: `/products/edit/${item.idProduct}`,
        state: { idProduct: item.idProduct }
      }}
        className='customLink'>
        <i className='bx bx-edit-alt' style={{ fontSize: '1.7rem' }}></i></Link></td>
      <td onClick={() => openDialogConfirm(
        'Xóa sản phẩm',
        `Bạn chắc chắn muốn xóa sản phẩm ${item.idProduct}`,
        item.idProduct,
      )}><i className='bx bx-trash' style={{ fontSize: '1.7rem' }}></i></td>
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

  const handleDelete = async () => {
    console.log('idProduct', id);
    const reponse = await productApi.deleteproduct(id);
    if (reponse.data.results.errCode !== 0) {
      error(reponse.data.results.errMessage)
    } else {
      success(reponse.data.results.errMessage)
      window.location.reload();
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value;

    if (value === '') {
      typingTimeoutRef.current = setTimeout(() => {
        setFilterProduct({
          ...filterProduct,
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
      setFilterProduct({
        ...filterProduct,
        page: 1,
        search: value
      })
      setIsHidden(false);
    }, 300);
  }

  const handleSelectCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    // console.log('category', selectedCategory);
    setFilterProduct({
      ...filterProduct,
      page: 1,
      category: event.target.value === 'Tất cả' ? '' : event.target.value
    })
    setIsHidden(false);
  };

  const handleSelectTypeRoomChange = (event) => {
     setSelectedTypeRoom(event.target.value);
    setFilterProduct({
      ...filterProduct,
      page: 1,
      typeroom: event.target.value === 'Tất cả' ? '' : event.target.value
    })
    setIsHidden(false);
  };

  const handleSelectPriceFilterChange = (event) => {
    setSelectedPriceFilter(event.target.value);
    setFilterProduct({
      ...filterProduct,
      page: 1,
      price: event.target.value === 'Tất cả' ? '' : event.target.value
    })
    setIsHidden(false);
  };


  // const handleSelectRatingChange = (event) => {
  //   setSelectedRatingFilter(event.target.value);
  //   console.log('rating', selectedRatingFilter);
  // };


  const handlePageChange = (event) => {
    console.log('page-product', event.selected + 1)
    setFilterProduct({
      ...filterProduct,
      page: event.selected + 1
    })
  }

  return (
    <div>
      <div className="top-page">
        <h2 className='page-header'>Quản lý sản phẩm</h2>
        <div className='page-actions'>
          <div>
            <Link to='/products/addProduct'><button className='btn-design'>Thêm mới</button></Link>
          </div>
          <Search
            onchange={handleSearch}
          />
        </div>
      </div>
      <div className="page-filter">
        <h5 className='lable-filter' style={{paddingTop: 20, paddingRight: 20, paddingLeft: 20}}>Lọc theo danh mục:</h5>
        <div className='container-select'>
          <select value={selectedCategory} onChange={handleSelectCategoryChange}>
            {listCategory.map((option, index) => (
              <option key={index} value={option.nameCat}>
                {option.nameCat}
              </option>
            ))}
          </select>
        </div>
        <h5 className='lable-filter' style={{paddingTop: 20, paddingRight: 20, paddingLeft: 20}}>Lọc theo giá:</h5>
        <div className='container-select'>
          <select value={selectedPriceFilter} onChange={handleSelectPriceFilterChange}>
            {priceFilter.map((option, index) => (
              <option key={index} value={option.id}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
        <h5 className='lable-filter' style={{paddingTop: 20, paddingRight: 20, paddingLeft: 20}}>Lọc theo loại phòng:</h5>
        <div className='container-select'>
          <select value={selectedTypeRoom} onChange={handleSelectTypeRoomChange}>
            {listTypeRoom.map((option, index) => (
              <option key={index} value={option.nameRoom}>
                {option.nameRoom}
              </option>
            ))}
          </select>
        </div>
        {/* <h5 className='lable-filter'>Lọc theo dánh giá sản phẩm:</h5>
        <div className='container-select'>
            <select value={selectedRatingFilter} onChange={handleSelectRatingChange}>
                {ratingFilter.map((option, index) => (
                    <option key={index} value={option.id}>
                        {option.value}
                    </option>
                ))}
            </select>
        </div> */}
      </div>
      <div className="row">
        <div className="col-12 full-height">
          <div className="card">
            <div className="card__body">
              <Table
                headData={productHead}
                renderHead={(item, index) => renderProductHead(item, index)}
                bodyData={listProduct}
                renderBody={(item, index) => renderProductBody(item, index)}
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

export default Products
