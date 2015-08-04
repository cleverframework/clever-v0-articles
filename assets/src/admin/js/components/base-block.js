import {EventEmitter} from 'events'

export default class BaseBlock extends EventEmitter {
  constructor(template, type) {
    super()
    this.type = type
    this.render(template)
  }

  render(template) {
    this.el = $(template())
  }

  addEvents() {
    this.el.find('.js-delete').on('click', this.delete.bind(this))
  }

  delete() {
    if(!confirm('Are you sure to want delete this block?')) return false
    this.emit('delete')
  }

  toObject() {
    const input = this.el.find('[name="value"]')
    return {
      value: input.val(),
      order: this.el.index(),
      type: this.type
    }
  }

  fromObject(obj) {
    this.el.find('[name="value"]').val(obj.value)
    this.type = obj.type
  }
}
