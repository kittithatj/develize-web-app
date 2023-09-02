import { Api } from '../config/api-config';

export const PersonnelAPI = {
    getAllPersonnel:async() => {
        return fetch(Api.url + Api.personnel_get, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    createPersonnel: async (personnelForm) => {
        return fetch(Api.url + Api.personnel_create, {
            method: 'POST',
            body: JSON.stringify(personnelForm),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    assessPersonnel: async (personnelForm) => {
        return fetch(Api.url + Api.personnel_assess, {
            method: 'POST',
            body: JSON.stringify(personnelForm),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

}