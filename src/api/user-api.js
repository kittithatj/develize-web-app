import { Api } from '../config/api-config';

export const userApi = {
    login: async (userForm) => {
        return fetch(Api.url + Api.user_login, {
            method: 'POST',
            body: JSON.stringify(userForm),
            headers: { 'Content-Type': 'application/json' }
        }).then((res) => {
            if (res.status === 200) {
                return res.json().then((data) => {
                    localStorage.setItem('token', data.token);
                })
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
                })
            }else{
                throw new Error(res.statusText);
            }
        })
    }
}