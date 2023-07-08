/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    let yaToken = localStorage.getItem('yaToken');
    if (!yaToken) {
      yaToken = prompt('Введите токен для YaDisk: ');
      localStorage.setItem('yaToken', yaToken);
    }
    return yaToken;
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){

    const options = {
      method: 'POST',
      url: Yandex.HOST + '/resources/upload',
      data: { url, path },
      headers: {
        'Authorization': `OAuth ${Yandex.getToken()}`
      },
      callback,
    }

    createRequest(options);
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){

    const options = {
      method: 'DELETE',
      url: Yandex.HOST + '/resources',
      data: { path },
      headers: {
        'Authorization': `OAuth ${Yandex.getToken()}`,
      },
      callback,
    }

    createRequest(options);
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){

    const options = {
      method: 'GET',
      url: Yandex.HOST + '/resources/files',
      data: { limit: 100 },
      headers: {
        'Authorization': `OAuth ${Yandex.getToken()}`,
      },
      callback,
    }

    createRequest(options);
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(path) {
    let a = document.createElement('a');
    a.href = path;
    console.log(path);
    a.click();


  }


  // static createFolder(path, callback) {
  //   const options = {
  //     method: 'PUT',
  //     url: Yandex.HOST + '/resources',
  //     data: { path },
  //     headers: {
  //       'Authorization': `OAuth ${Yandex.getToken()}`
  //     },
  //     callback
  //   }

  //   createRequest(options);
  // }
}
