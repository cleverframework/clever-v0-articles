import BaseBlock from './base-block'
import template from '../../../../../views/admin/blocks/text.jade'

export default class TextBlock extends BaseBlock {
  constructor() {
    super(template)
  }
}
