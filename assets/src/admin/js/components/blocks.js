import text from './text'
import image from './image'
import quote from './quote'
import video from './video'
import gallery from './gallery'
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
      quote,
      gallery,
      video
    }
    this._bindEvents()
    this._addExistingBlocks()
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

    $('body').on('click', '.js-add-block', this.onAddBlockClick.bind(this))
  }

  _addExistingBlocks() {
    const existingBlocks = this.el.data('blocks')
    if (existingBlocks && existingBlocks.length) {
      this.fromArray(existingBlocks)
    }
  }

  onAddBlockClick(e) {
    const target = $(e.currentTarget)
    const blockName = target.data('block')
    const block = this.getBlock(blockName)
    if (target.parents('.js-container').length) {
      target
        .parents('.popover').data('bs.popover').$element.parent()
        .after(block.el)

    } else {
      block.el.prependTo(this.container)
    }

    if (block.type === 'image') block.open()

    this.blocks.push(block)
  }

  getBlock(blockName, data) {

    console.log(blockName)
    const block = new this.enabledBlocks[blockName]()
    if (data) block.fromObject(data)

    block.on('delete', () => {
      this.blocks.splice(this.blocks.indexOf(block), 1)
      block.el.remove()
    })

    return block
  }

  toArray() {
    return this.blocks.map(block => block.toObject())
  }

  fromArray(data) {
    data.sort((a, b) => a.order - b.order)
    this.blocks = data.map(block => this.getBlock(block.type, block))
    this.blocks.forEach(block => block.el.appendTo(this.container))
  }
}
