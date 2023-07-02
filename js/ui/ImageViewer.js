/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.element = element;
    this.photoPreview = this.element.getElementsByTagName('img')[0];
    this.blockImages = this.element.querySelector('.images-list .grid .row');
    console.log(this.blockImages)
    this.drawImages = this.drawImages.bind(this);
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    let preview = this.photoPreview;

    this.blockImages.addEventListener('dblclick', (e) => {

      if (e.target.tagName === 'IMG') {
        let src = e.target.getAttribute('src');
        preview.setAttribute('src', src);
      }
    })

    this.blockImages.addEventListener('click', (e) => {
      
      if (e.target.tagName === 'IMG') {
        e.target.classList.toggle('selected');
        this.checkButtonText();
      }
    })

    document.querySelector('.select-all').addEventListener('click', () => {
      const photos = Array.from(this.blockImages.getElementsByTagName('img'));
      let count = 0;

      for (let photo of photos) {
        if (photo.classList.contains('selected')) {
          count++;
        }
      }

      if (count) {
        photos.forEach((element) => element.classList.remove('selected'));
      } else {
        photos.forEach((element) => element.classList.add('selected'));
      }

      this.checkButtonText();
    })

    document.querySelector('.show-uploaded-files').addEventListener('click', () => {
      const filePreviewer = App.getModal('filePreviewer');
      filePreviewer.open();
      const i = document.querySelector('.asterisk.loading.icon.massive');
      Yandex.getUploadedFiles((err, data) => filePreviewer.showImages(data));
    })

    document.querySelector('.send').addEventListener('click', () => {
      const uploader = App.getModal('fileUploader');
      const selected = this.blockImages.getElementsByClassName('selected');
      uploader.open();
      uploader.showImages(selected);
    })
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    const photos = Array.from(this.blockImages.getElementsByClassName('image-wrapper'));

    if (photos.length) {
      photos.forEach((e) => e.remove());
    }
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    
    let selectAllBtn = document.getElementsByClassName('select-all')[0];

    if (images) {

      selectAllBtn.classList.remove('disabled')
      for (let elm of images) {
      
        const img = document.createElement('img');
        const div = document.createElement('div');
        img.src = elm;
        div.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
        div.appendChild(img);
        this.blockImages.appendChild(div);
      }
    } else {
      selectAllBtn.classlist.add('disabled')
      
    }
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    const photos = this.blockImages.getElementsByTagName('img');

    const selectAllBtn = document.getElementsByClassName('select-all')[0];
    const sendBtn = document.getElementsByClassName('send')[0];
    let countSelected = 0;
    for (let photo of photos) {
      if (photo.classList.contains('selected')) {
        countSelected++;
      }
    }

    if (countSelected === photos.length) {
      selectAllBtn.textContent = 'Снять выделение';
    } else {
      selectAllBtn.textContent = 'Выбрать всё';
    }

    if (countSelected > 0) {
      sendBtn.classList.remove('disabled');
    } else {
      sendBtn.classList.add('disabled');
    }
  }
}
