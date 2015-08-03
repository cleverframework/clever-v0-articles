import BaseBlock from './base-block'
import template from '../../../../../views/admin/blocks/quote.jade'

export default class QuoteBlock extends BaseBlock {
  constructor() {
    super(template)
  }
}
