import React from 'react'
import { useParams } from 'react-router-dom'

function PersonnelInfo() {

    const { id } = useParams();

    return (
        <div className='main-content'>Personnel {id}</div>
    )
}

export default PersonnelInfo