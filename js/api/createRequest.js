/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  const method = options.method.toUpperCase();
  let url = new URL(options.url);
  let params = options.data;
  let headers = options.headers;
  let callback = options.callback;
  let error = null;
  const xhr = new XMLHttpRequest;
  
  xhr.responseType = 'json';

  if (params) {
    Object.entries(params).forEach( (param) => url.searchParams.set(...param) );
  }

  try {
    xhr.open(method, url.href);
    
    if (headers) {
      Object.entries(headers).forEach((header) => xhr.setRequestHeader(...header))
    }

    xhr.send();
  }
  catch (err) {
    error = err;
  }

  xhr.onloadend = function() {
    callback(error, xhr.response);
  }
};
