import fetchIntercept from "fetch-intercept";

export const interceptor = ()=> {
  fetchIntercept.register({
  request: function(url, config) {
    if(config.headers){
        config.headers.Authorization ="Bearer "+localStorage.getItem('token')
    }else{
        config  = {
            ...config,
            headers: {
                Authorization: "Bearer "+localStorage.getItem('token')
            }
        }
    }
    return [url, config];
  },

  requestError: function(error) {
    // Called when an error occured during another 'request' interceptor call
    return Promise.reject(error);
  },

  response: function(response) {
    // Modify the reponse object
    return response;
  },

  responseError: function(error) {
    // Handle an fetch error
    return Promise.reject(error);
  }
});
}