import React from 'react'
import ReactPaginate from 'react-paginate';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './pagination.css';

const paginate = props => {
    return (
        props.totalPage ? 
        <div className='paginate-wrapper'>
            <ReactPaginate
                activeClassName={'item pagination__active '}
                breakClassName={'item break-me '}
                breakLabel={'...'}
                containerClassName={'pagination'}
                disabledClassName={'disabled-page'}
                marginPagesDisplayed={2}
                nextClassName={"item next "}
                nextLabel={<ArrowForwardIosIcon style={{ fontSize: 18, width: 150 }} />}
                onPageChange={props.handlePageChange}
                pageCount={props.totalPage}
                pageClassName={'item pagination-page '}
                pageRangeDisplayed={2}
                previousClassName={"item previous"}
                previousLabel={<ArrowBackIosIcon style={{ fontSize: 18, width: 150 }} />}
            />
        </div> : <div></div>
    )
}

export default paginate


