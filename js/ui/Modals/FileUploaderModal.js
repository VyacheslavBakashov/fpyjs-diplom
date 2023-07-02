/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.imageContainers = element[0];
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    const closeModalBtn = this.domElm.querySelector('.x.icon');
    const closeBtn = this.domElm.querySelector('.ui.close.button');
    const sendAllBtn = this.domElm.querySelector('.ui.send-all.button');
    const contentBlock = this.domElm.querySelector('.content');

    closeModalBtn.addEventListener('click', () => this.close());

    closeBtn.addEventListener('click', () => this.close());

    sendAllBtn.addEventListener('click', () => this.sendAllImages());

    contentBlock.addEventListener('click', (event) => {

      const target = event.target;
      const imageContainer = target.closest('.image-preview-container');

      if (target.tagName === 'INPUT') {
        imageContainer.querySelector('.input').classList.remove('error');
      }

      if (target.classList.contains('button')) {
        this.sendImage(imageContainer);
      }
    });
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    const imagesHTML = Array.from(images)
    .reverse()
    .map((image) => this.getImageHTML(image))
    .join('');

    this.domElm.querySelector('.content').innerHTML = imagesHTML;
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    const img = document.createElement('img');
    img.src = item.src;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Путь к файлу';

    const btn = document.createElement('button');
    btn.classList.add('ui', 'button');

    const i = document.createElement('i');
    i.classList.add('upload', 'icon');

    btn.appendChild(i);
    const divInput = document.createElement('div');
    divInput.classList.add('ui', 'action', 'input');
    divInput.appendChild(input);
    divInput.appendChild(btn);

    const divContainer = document.createElement('div');
    divContainer.classList.add('image-preview-container');
    divContainer.appendChild(img);
    divContainer.appendChild(divInput);

    const str = divContainer.outerHTML;
    return str;
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    this.imageContainers.querySelectorAll('.image-preview-container').forEach((elm) => {
      this.sendImage(elm);
    });
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const inputBlock = imageContainer.querySelector('.input');
    const inputField = inputBlock.querySelector('input');
    const imagePath = inputField.value.trim();


    function validatePath(path) {
      const matchStr = path.match(/^[\/]?(?:[\w\-А-Я]+[\/]?)*[\w\-А-Я]+/i);

      if (!matchStr || matchStr[0] !== path) {
        return
      }

      if (path.includes('/')) {}
      return path
    }

    if (!imagePath || !validatePath(imagePath)) {
      inputBlock.classList.add('error');
      alert(
      `Пример (для файлов расширения не указывать, папка должна существовать на YaDisk):
      /foldername/../filename
      folderName/filename
      /filename
      filename`
      )
      return;
    }

    inputBlock.classList.add('disabled');

    const imageUrl = imageContainer.querySelector('img').getAttribute('src');
    const fileExtension = '.jpg'



    // if (imagePath.slice(1).includes('/')) {

    //   const pathAdd = imagePath.slice(0, imagePath.lastIndexOf('/'));

    //   console.log(pathAdd + ' fileUp')
    //   console.log(imagePath + ' fileUp')
    //   Yandex.createFolder(pathAdd, (err, response) => {console.log(err)});

    // }


    Yandex.uploadFile(imagePath + fileExtension, imageUrl, () => {
      imageContainer.remove();

      if (this.domElm.querySelector('.image-preview-container') === null) {
        this.close();
      }
    });
  }

}
