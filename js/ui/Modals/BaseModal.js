/**
 * Класс BaseModal
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    this.semanticElm = element;
    this.domElm = element[0];
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.semanticElm.modal('show');
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.semanticElm.modal('hide');
  }
}