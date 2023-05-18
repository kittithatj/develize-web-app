import React from 'react'
import { useParams } from 'react-router-dom'

function PersonnelEdit() {

    const { id } = useParams();

    return (
        <div className='main-content'>PersonnelEdit {id}</div>
    )
}

export default PersonnelEdit