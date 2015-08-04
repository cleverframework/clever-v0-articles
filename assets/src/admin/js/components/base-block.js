import {EventEmitter} from 'events'

export default class BaseBlock extends EventEmitter {
  constructor(template) {
    super()
    this.el = $(template())
    this.el.find('.js-delete').on('click', this.delete.bind(this))
  }

  delete() {
    if(!confirm('Are you sure to want delete this block?')) return false
    this.emit('delete')
  }
}
