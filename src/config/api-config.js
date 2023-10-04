export const Api = {
    url: 'http://localhost:8080',
    //url: '*Online URL*',
    skill_get: '/skill/get',
    skill_delete: '/skill/delete/',// + id
    skill_create: '/skill/create',

    user_get:'user/get',
    user_login: '/user/login',
    user_register: '/user/register',
    user_refresh_token: '/user/refresh-token',

    personnel_get: '/personnel/get',
    personnel_create: '/personnel/create',
    personnel_set_skill: '/personnel/skill/set',
    personnel_division_list:'/personnel/division/list',
    personnel_assess:'/personnel/assess',
    personnel_edit:'/personnel/edit',

    project_get: '/project/get-list',
    project_create:'/project/create'
}