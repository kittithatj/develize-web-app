import React, { useEffect, useState } from 'react'
import { Api } from '../config/api-config'

function Skill() {

    const [skill, setSkill] = useState([])

    const fetchSkillData = () => {
        fetch(Api.url + Api.skill_get)
            .then(res => {
                return res.json()
            })
            .then(data => {
                setSkill(data)
            })
    }

    useEffect(() => {
        fetchSkillData()
    }, [])

    return (
        <div className='main-content'>
            <div>
                {skill.length > 0 && (
                    <ul>
                        {skill.map(skill => (
                            <li key={skill.skill_id}>{skill.skillName}/{skill.skillType}</li>
                        ))}
                    </ul>
                )}
            </div>
            <button onClick={fetchSkillData} className='btn btn-info'>Update Skill</button>
        </div>
    )
}

export default Skill