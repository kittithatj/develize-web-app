import { Api } from '../config/api-config';

export const ProjectAPI = {

    getProject:async() => {
        return fetch(Api.url + Api.project_get, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    createProject:async() => {
        return fetch(Api.url + Api.project_create, {
            method: 'POST',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },     
}