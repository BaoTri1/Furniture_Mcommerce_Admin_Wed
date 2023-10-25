import React from 'react'

import './search.css'

const Search = props => {

  return (
    <div className="topnav__search">
        <input type="text" placeholder='Tìm kiếm tại đây...' onChange={props.onchange}/>
        <i className='bx bx-search'></i>
    </div>
  )
}

export default Search
