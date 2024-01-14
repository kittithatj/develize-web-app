import { Api } from '../config/api-config';

export const userApi = {
    login: async (userForm) => {
        return fetch(Api.url + Api.user_login, {
            method: 'POST',
            body: JSON.stringify(userForm),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    register: async (userForm) => {
        return fetch(Api.url + Api.user_register, {
            method: 'POST',
            body: JSON.stringify(userForm),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    localStorage.setItem('token', data.token);
                    return data;
                })
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    approve: async (form) => {
        return fetch(Api.url + Api.user_approve, {
            method: 'PUT',
            body: JSON.stringify(form),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    edit: async (userForm) => {
        return fetch(Api.url + Api.user_edit, {
            method: 'PUT',
            body: JSON.stringify(userForm),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    getAllUser: async () => {
        return fetch(Api.url + Api.user_get, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    deleteUser: async (id) => {
        return fetch(Api.url + Api.user_delete + id, {
            method: 'DELETE'
        }).then((res) => {
            if (res.status === 200) {
                return res
            }else{
                throw new Error(res.statusText);
            }
        })
    },
}