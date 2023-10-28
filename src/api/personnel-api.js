import { Api } from '../config/api-config';

export const PersonnelAPI = {

    getPersonnelById:async(id) => {
        return fetch(Api.url + '/personnel/'+id, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

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

    assessPersonnel: async (formData) => {
        return fetch(Api.url + Api.personnel_assess, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    editPersonnel: async (personnelForm) => {
        return fetch(Api.url + Api.personnel_edit, {
            method: 'PUT',
            body: JSON.stringify(personnelForm),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },

    getAccessScore: async (id) => {
        return fetch(Api.url + Api.personnel_get_access_score + id, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    }
}