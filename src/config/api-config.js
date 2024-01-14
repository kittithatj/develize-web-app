export const Api = {
    // url: 'http://localhost:8080',
    //url: '*Online URL*',
    url:'https://develize-api.azurewebsites.net',
    skill_get: '/skill/get-list',
    skill_delete: '/skill/delete/',// + id
    skill_create: '/skill/create',

    user_get:'/user/get-list',
    user_login: '/user/login',
    user_register: '/user/register',
    user_approve: '/user/approve',
    user_edit: '/user/edit',
    user_refresh_token: '/user/refresh-token',
    user_delete: '/user/delete/',// + id

    personnel_get: '/personnel/get-list',
    personnel_create: '/personnel/create',
    personnel_set_skill: '/personnel/skill/set',
    personnel_division_list:'/personnel/division/list',
    personnel_assess:'/personnel/assess',
    personnel_edit:'/personnel/edit',
    personnel_get_access_score:'/personnel/get-access/',// + id
    personnel_overview_access_score:'/personnel/overview-access/',// + id
    personnel_delete:'/personnel/delete/',// + id
    position_list_get:'/personnel/position/list',
    division_list_get:'/personnel/division/list',

    project_get: '/project/get-list',
    project_create:'/project/create',
    project_update:'/project/edit',
    project_delete:'/project/delete/',// + id
    project_match:'/project/match-skill',
}