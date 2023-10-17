import React from 'react'

import './search.css'

const Search = props => {

    const searchHandler = () => {
        if(props.type === 'search-user'){
            console.log('tìm kiếm khách hàng')
        }
        else if(props.type === 'search-product'){
            console.log('tìm kiếm sản phẩm')
        }
        else if(props.type === 'search-category'){
            console.log('tìm kiếm danh mục')
        }

    }

  return (
    <div className="topnav__search">
        <input type="text" placeholder='Tìm kiếm tại đây...' />
        <i className='bx bx-search' onClick={() => searchHandler()}></i>
    </div>
  )
}

export default Search
