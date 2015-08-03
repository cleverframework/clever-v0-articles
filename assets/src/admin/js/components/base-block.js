export default class BaseBlock {
  constructor(template) {
    this.el = $(template())

    this.el.find('.js-delete').on('click', this.delete.bind(this))
  }

  delete() {

  }
}
