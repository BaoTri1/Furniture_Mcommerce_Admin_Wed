import React from 'react'
import './comboboxfilter.css';

const ComBoBoxFilter = props => {
    return (
        <div className='container-select'>
            <select value={props.selectOption} onChange={props.handleSeclectChange}>
                {props.listOption.map((option, index) => (
                    <option key={index} value={option.idcatParent}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default ComBoBoxFilter
