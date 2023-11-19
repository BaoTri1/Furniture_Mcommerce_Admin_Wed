import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { useToast } from '../../../context/toast'
import Table from '../../table/Table'
import Paginate from '../../paginate/paginate'
import ratingandreviewApi from '../../../api/ratingandreviewApi'

const ratingTableHead = [
    'ID',
    'Người dùng',
    'Điểm đánh giá',
    'Bình luận',
    'Thời gian tạo',
    ''
]

const renderHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.idRat}</td>
        <td>{item.fullName}</td>
        <td>{item.point}</td>
        <td>{item.comment}</td>
        <td>{formatDate(item.timeCreate)}</td>
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

const ListReview = () => {
    const history = useHistory();
    const location = useLocation();
    const [listReview, setListReview] = useState([]);
    const [isHidden, setIsHidden] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const [filterReview, setFilterReview] = useState({
        id: '',
        page: 1,
        limit: 20
    });

    useEffect(() => {
        const result = location.state;
    
        if (result) {
            setFilterReview({
                ...filterReview,
                id: result.idProduct
            })
        }
    }, [location.state]);

    useEffect(() => {
        const getListRating = async () => {
            try {
                const paramsString = queryString.stringify(filterReview);
                const response = await ratingandreviewApi.getListReviewForProduct(paramsString);
                if (response.data.errCode === 0) {
                    console.log(response.data);
                    setListReview(response.data.reviews);
                    setTotalPage(response.data.total_page);
                } else {
                    console.log(response.data.errMessage)
                    setListReview([])
                    setIsHidden(true)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getListRating();
    }, [filterReview]);

    const handlePageChange = (event) => {
        console.log('page-category', event.selected + 1)
        setFilterReview({
            ...filterReview,
            page: event.selected + 1
        })
    }

    return (
        <div>
            <div className="top-page-form">
                <button className="btn-design" onClick={() => { history.goBack() }}>Quay lại</button>
                <h2 className='page-header'>
                    Chi tiết đánh giá
                </h2>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                headData={ratingTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={listReview}
                                renderBody={(item, index) => renderBody(item, index)}
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
        </div>
    )
}

export default ListReview
