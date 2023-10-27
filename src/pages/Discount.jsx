import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import queryString from 'query-string'

import Search from '../components/search/Search'
import Table from '../components/table/Table'
import { useToast } from '../context/toast'
import ConfirmDialog from '../components/confirmdialog/ConfirmDialog'
import discountApi from '../api/discountApi'
import Paginate from '../components/paginate/paginate'

const discountHead = [
    'ID',
    'Tên khuyến mãi',
    'Sản phẩm khuyến mãi',
    'Giá trị(%)',
    'Số lượng',
    'Ngày bắt đầu',
    'Ngày kết thúc',
    '',
    ''
]

const renderDiscountHead = (item, index) => (
    <th key={index}>{item}</th>
)

const formatDate = (dateString) => {
    var dateObject = new Date(dateString);

    // Trích xuất thông tin về ngày, tháng và năm
    var day = dateObject.getDate();
    var month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, nên cộng thêm 1
    var year = dateObject.getFullYear();

    var formattedMonth = (month < 10) ? '0' + month : month;

    return `${year}-${formattedMonth}-${day}`

}

const Discount = () => {

    const [listDiscount, setListDiscount] = useState([]);
    const [filterDiscount, setFilterDiscount] = useState({
        page: 1,
        limit: 20,
        search: ''
    });
    const [open, setopen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [titleDialog, setTitleDialog] = useState('');
    const [contentDialog, setContentDialog] = useState('');
    const [id, setID] = useState('');
    const { error, success } = useToast();

    const typingTimeoutRef = useRef(null);

    const renderDiscountBody = (item, index) => (
        <tr key={index}>
            <td>{item.idDiscount}</td>
            <td>{item.nameDiscount}</td>
            <td>{item.nameProduct}</td>
            <td>{item.value}</td>
            <td>{item.numDiscount}</td>
            <td>{formatDate(item.dayStart)}</td>
            <td>{formatDate(item.dayEnd)}</td>
            <td><Link to={{
                pathname: `/discount/edit/${item.idDiscount}`,
                state: {
                    idDiscount: item.idDiscount, 
                    idProduct: item.idProduct,
                    nameDiscount: item.nameDiscount,
                    value: item.value,
                    numDiscount: item.numDiscount,
                    dayStart: item.dayStart,
                    dayEnd: item.dayEnd
                }
            }}
                className='customLink'>
                <i className='bx bx-edit-alt' style={{ fontSize: '1.7rem' }}></i></Link></td>
            <td onClick={() => openDialogConfirm(
                'Xóa danh mục',
                `Bạn chắc chắn muốn xóa khuyến mãi ${item.nameDiscount}`,
                item.idDiscount,
            )}><i className='bx bx-trash' style={{ fontSize: '1.7rem' }}></i></td>
        </tr>
    )

    useEffect(() => {
        const getListDiscount = async () => {
            try {
                const paramsString = queryString.stringify(filterDiscount);
                const response = await discountApi.getListDiscountByPage(paramsString);
                console.log(response.data);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results.data);
                    setListDiscount(response.data.results.data);
                    setTotalPage(response.data.results.total_page);
                } else {
                    console.log(response.data.results.errMessage)
                    setListDiscount([])
                    setIsHidden(true)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getListDiscount();
    }, [filterDiscount])

    const handleSearch = (e) => {
        const value = e.target.value;

        if (value === '') {
            typingTimeoutRef.current = setTimeout(() => {
                setFilterDiscount({
                    ...filterDiscount,
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
            setFilterDiscount({
                ...filterDiscount,
                page: 1,
                search: value
            })
            setIsHidden(false);
        }, 300);
    }

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

    const handleDelete =  async () => {
        const reponse = await discountApi.deleteDiscount(id);
        if (reponse.data.results.errCode !== 0) {
            error(reponse.data.results.errMessage)
        } else {
            success(reponse.data.results.errMessage)
            window.location.reload();
        }
    }

    const handlePageChange = (event) => {
        console.log('page-product', event.selected + 1)
        setFilterDiscount({
            ...filterDiscount,
            page: event.selected + 1
        })
    }

    return (
        <div>
            <div className="top-page">
                <h2 className='page-header'>Quản lý khuyến mãi</h2>
                <div className='page-actions'>
                    <div>
                        <Link to='/discount/add'><button className='btn-design'>Thêm mới</button></Link>
                    </div>
                    <Search
                        onchange={handleSearch}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                headData={discountHead}
                                renderHead={(item, index) => renderDiscountHead(item, index)}
                                bodyData={listDiscount}
                                renderBody={(item, index) => renderDiscountBody(item, index)}
                            />
                        </div>
                        <div className="card__footer">
                            {
                                !isHidden ? <Paginate
                                    totalPage={totalPage}
                                    handlePageChange={handlePageChange}
                                /> : <div></div>
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

export default Discount
