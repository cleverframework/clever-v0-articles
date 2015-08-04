import text from './text'
import image from './image'
import quote from './quote'
import popover from '../../../../../views/admin/blocks/popover.jade'

export default class Blocks {
  constructor(el, app) {
    this.app = app
    this.blocks = []
    this.el = el
    this.container = this.el.find('.js-container')
    this.container.sortable({
      handle: ".block-header"
    })
    this.enabledBlocks = {
      text,
      image,
      quote
    }
    this._bindEvents()
  }

  _bindEvents() {
    $('body').popover({
      html: true,
      content: popover(),
      title: 'Add new block',
      selector: '.js-open-block-popover',
      placement: 'top',
      trigger: 'focus'
    })

    $('body').on('click', '.js-add-block', this.addBlock.bind(this))
  }

  addBlock(e) {
    const block = new this.enabledBlocks[$(e.currentTarget).data('block')]()
    const target = $(e.currentTarget)

    this.blocks.push(block)

    if (target.parents('.js-container').length) {
      target
        .parents('.popover').data('bs.popover').$element.parent()
        .after(block.el)

    } else {
      block.el.prependTo(this.container)
    }
  }
}
