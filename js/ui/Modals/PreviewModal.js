/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    const content = this.domElm.querySelector('.content');
    const modalCloseButton = this.domElm.querySelector('.x.icon');

    modalCloseButton.addEventListener('click', () => {
      this.close();
    });

    content.addEventListener('click', (event) => {
      const target = event.target;

      if (target.classList.contains('delete')) {
        const icon = target.querySelector('i');
        icon.classList.add('icon', 'spinner', 'loading');
        target.classList.add('disabled');

        const path = target.dataset.path;

        Yandex.removeFile(path, (err, data) => {

          if (!err && !data) {
            const container = target.closest('.image-preview-container');
            container.parentNode.removeChild(container);
          } else {
            console.error(`Failed to remove file '${path}'`, err || data);
            icon.classList.remove('icon', 'spinner', 'loading');
            target.classList.remove('disabled');
          }
        });
      } else if (target.classList.contains('download')) {
        const fileUrl = target.dataset.file;
        console.log(fileUrl);
        Yandex.downloadFileByUrl(fileUrl);
      }
    });
  }



  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    if (!data) {
      this.domElm.querySelector('.content').innerHTML = '';
    }
    const reversedImages = data.items.reverse();

    const containers = reversedImages.map((image) => {
      const imageInfo = this.getImageInfo(image);

      return `<div class="image-preview-container">${imageInfo}</div>`;
    });

    this.domElm.querySelector('.content').innerHTML = containers.join('');
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const dateObj = new Date(date);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return dateObj.toLocaleString('ru', options);
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    const name = item.name;
    const preview = item.preview;
    const path = item.path;
    const file = item.file;
    const created = this.formatDate(item.created);
    const size = Math.round(item.size / 1024);

    return `
      <img src="${preview}" />
      <table class="ui celled table">
        <thead>
          <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
        </thead>
        <tbody>
          <tr><td>${name}</td><td>${created}</td><td>${size} Кб</td></tr>
        </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path="${path}">
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file="${file}">
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    `;
  }
}

