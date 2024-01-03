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

    getProjectById:async(id) => {
        return fetch(Api.url + '/project/'+id, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    updateProject:async() => () => {
        return fetch(Api.url + Api.project_update, {
            method: 'GET',
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    createProject:async(form) => {
        return fetch(Api.url + Api.project_create, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    },     

    deleteProject: async (id) => {
        return fetch(Api.url + Api.project_delete + id, {
            method: 'DELETE',
        }).then((res) => {
            if (res.status === 200) {
                return res
            }else{
                throw new Error(res.statusText);
            }
        })
    },

    matchSkillProject:async(form) => {
        return fetch(Api.url + Api.project_match, {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => {
            if (res.status === 200) {
                return res.json()
            }else{
                throw new Error(res.statusText);
            }
        })
    }, 
}