import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import Table from '../components/table/Table'
import Search from '../components/search/Search'
import Paginate from '../components/paginate/paginate'

import ratingandreviewApi from '../api/ratingandreviewApi'

const ratingTableHead = [
    'Sản phẩm',
    'Điểm đánh giá',
    'Số lượng đánh giá',
    '',
]

const renderHead = (item, index) => (
    <th key={index}>{item}</th>
)

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.nameProduct}</td>
        <td>{item.AVGPoint}</td>
        <td>{item.NumReviews}</td>
        {
            item.NumReviews > 0 ? 
            <td><Link to={{
                pathname: `/reviews/${item.idProduct}`,
                state: {idProduct: item.idProduct}
            }}
                className='customLink'>
                <i className='bx bx-show' style={{ fontSize: '1.7rem' }}></i></Link></td>
                : <td></td>
        }
    </tr>
)

const RatingAndReview = () => {

    const [isHidden, setIsHidden] = useState(false);
    const [totalPage, setTotalPage] = useState(1);
    const typingTimeoutRef = useRef(null);

    const [list, setList] = useState([]);
    const [filterRating, setFilterRating] = useState({
        page: 1,
        limit: 20,
        search: ''
    });

    useEffect(() => {
        const getListRating = async () => {
            try {
                const paramsString = queryString.stringify(filterRating);
                const response = await ratingandreviewApi.getRatingProduct(paramsString);
                if (response.data.results.errCode === 0) {
                    console.log(response.data.results);
                    setList(response.data.results.reviews);
                    setTotalPage(response.data.results.total_page);
                } else {
                    console.log(response.data.results.errMessage)
                    setList([])
                    setIsHidden(true)
                }

            } catch (error) {
                console.error('Call API failed', error);
            }
        }
        getListRating();
    }, [filterRating])

    const handleSearch = (e) => {
        // const value = e.target.value;

        // if (value === '') {
        //     typingTimeoutRef.current = setTimeout(() => {
        //         setFilterUser({
        //             ...filterUser,
        //             page: 1,
        //             search: ''
        //         })
        //         setIsHidden(false);
        //     }, 300);
        // }

        // if (typingTimeoutRef.current) {
        //     clearTimeout(typingTimeoutRef.current);
        // }

        // typingTimeoutRef.current = setTimeout(() => {
        //     setFilterUser({
        //         ...filterUser,
        //         page: 1,
        //         search: value
        //     })
        //     setIsHidden(false);
        // }, 300);
    }

    const handlePageChange = (event) => {
        console.log('page-category', event.selected + 1)
        setFilterRating({
            ...filterRating,
            page: event.selected + 1
        })
    }

    return (
        <div>
            <div className="top-page">
                <h2 className='page-header'>Quản lý đánh giá</h2>
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
                                headData={ratingTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={list}
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

export default RatingAndReview
