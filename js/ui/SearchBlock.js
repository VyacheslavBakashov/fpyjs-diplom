/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;
    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {

    const replaceBtn = this.element.querySelector('.replace');
    const addBtn = this.element.querySelector('.add');
    const inpArea = this.element.getElementsByTagName('input')[0];
    // const userId = inpArea.value.trim();

    replaceBtn.addEventListener('click', () => {
      const userId = inpArea.value.trim();

      if (userId) {
        App.imageViewer.clear();
        VK.get(userId, App.imageViewer.drawImages);
      } else {
        alert('Введите VK id');
      }
    });

    addBtn.addEventListener('click', () => {
      const userId = inpArea.value.trim();
      if (userId) {
        VK.get(userId, App.imageViewer.drawImages);
      } else {
        alert('Введите VK id');
      }
    });
  }
}
