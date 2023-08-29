import React from 'react'
import { useParams } from 'react-router-dom'

function PersonnelAssessment() {

    const { id } = useParams();
    
    return (
        <div>PersonnelAssessment</div>
    )
}

export default PersonnelAssessment