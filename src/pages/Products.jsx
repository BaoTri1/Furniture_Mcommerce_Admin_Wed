import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import queryString from 'query-string'

import Search from '../components/search/Search'
import Table from '../components/table/Table'
import { useToast } from '../context/toast'
import ConfirmDialog from '../components/confirmdialog/ConfirmDialog'
import productApi from '../api/productApi'
import Paginate from '../components/paginate/paginate'

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

const renderProductHead = (item, index) => (
  <th key={index}>{item}</th>
)

const Products = () => {

  const [listProduct, setListProduct] = useState([]);
  const [filterProduct, setFilterProduct] = useState({
    page: 1,
    limit: 20,
  });
  const [open, setopen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [titleDialog, setTitleDialog] = useState('');
  const [contentDialog, setContentDialog] = useState('');
  const [id, setID] = useState('');
  const { error, success } = useToast();

  useEffect(() => {
    const getListProduct = async () => {
      try {
        const paramsString = queryString.stringify(filterProduct);
        const response = await productApi.getListProductByPage(paramsString);
        console.log(response.data);
        if (response.data.results.errCode === 0) {
          console.log(response.data.results.data);
          setListProduct(response.data.results.data);
          setTotalPage(response.data.results.total_page);
        } else {
          console.log(response.data.results.errMessage)
          setListProduct([])
          setIsHidden(true)
        }

      } catch (error) {
        console.error('Call API failed', error);
      }
    }
    getListProduct();
  }, [filterProduct])

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

  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

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
          //onchange={handleSearchCategory}
          />
        </div>
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
