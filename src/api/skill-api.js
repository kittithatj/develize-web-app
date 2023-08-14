import { Api } from '../config/api-config';

export const skillApi = {
    getAllSKills: async () => {
        return fetch(Api.url + Api.skill_get, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    createSkill: async (skillForm) => {
        return fetch(Api.url + Api.skill_create, {
            method: 'POST',
            body: JSON.stringify(skillForm),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    deleteSkill: async (id) => {
        return fetch(Api.url + Api.skill_delete + id, {
            method: 'DELETE'
        })
    },
}