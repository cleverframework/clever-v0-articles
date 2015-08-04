import BaseBlock from './base-block'
import template from '../../../../../views/admin/blocks/quote.jade'

export default class QuoteBlock extends BaseBlock {
  constructor() {
    super(template, 'quote')
  }

  toObject() {
    const obj = super.toObject()
    obj.credit = this.el.find('input[name="credit"]').val()
    return obj
  }

  fromObject(obj) {
    super.fromObject(obj)
    this.el.find('input[name="credit"]').val(obj.credit)
  }
}
