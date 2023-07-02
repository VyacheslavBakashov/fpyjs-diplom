/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
class VK {

  // static ACCESS_TOKEN = '958eb5d439726565e9333aa30e50e0f937ee432e927f0dbd541c541887d919a7c56f95c04217915c32008';
  static ACCESS_TOKEN = localStorage.getItem('vkToken');
  static lastCallback;
  static baseUrl = 'https://api.vk.com/method/';
  static version = '5.131';

  /**
   * Получает изображения
   * */
  static get(id = '', callback) {
    this.lastCallback = callback;
    if (!this.ACCESS_TOKEN) {
      this.ACCESS_TOKEN = prompt('Введите VK токен');
      localStorage.setItem('vkToken', this.ACCESS_TOKEN);
    } 
    const script = document.createElement('script');
    script.id = 'new-script';
    script.src = `${this.baseUrl}photos.get?owner_id=${id}&album_id=profile&access_token=${this.ACCESS_TOKEN}&v=${this.version}&photo_sizes=1&callback=VK.processData`;
    document.getElementsByTagName('body')[0].appendChild(script);
  }

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    
    document.getElementById('new-script').remove();

    result.onerror = () => {
      alert('Ошибка запроса');
      return
    };

    const photoArray = [];

    function findBestPhoto(responseItem) {
      const types = ['w', 'z', 'y', 'x', 'r', 'q', 'p', 'm', 'o', 's'];
      for (let type of types) {
        for (let size of responseItem.sizes.reverse()) {
          if (size.type === type) {
            return size.url
          }
        }
      }
    }

    for (let item of result.response.items) {
      photoArray.push(findBestPhoto(item));
    }
    this.lastCallback(photoArray);
    this.lastCallback = () => {};
  }
}
