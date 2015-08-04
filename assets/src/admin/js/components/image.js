import BaseBlock from './base-block'
import template from '../../../../../views/admin/blocks/image.jade'
import modal from '../../../../../views/admin/image-picker-modal.jade'

export default class ImageBlock extends BaseBlock {
  constructor() {
    super(template, 'image')
    this.setupModal()
  }

  setupModal() {
    this.modal = $(modal({images: window.imageList}))
    this.modal.appendTo(this.el)

    const images = this.modal.find('.js-image')

    images.on('click', e => {
      const clicked = $(e.currentTarget)
      images.removeClass('is-selected')
      clicked.addClass('is-selected')
    })

    this.modal.find('.js-confirm').on('click', () => {
      const selected = images.filter('.is-selected')
      if (!selected.length) return alert('Please select an image.')
      this.el.find('[name="value"]').val(selected.data('id'))
      this.el.find('.js-preview').attr('src', selected.data('src'))
      this.modal.modal('hide')
    })
  }

  fromObject(obj) {
    this.el.find('[name="value"]').val(obj.value)
    this.el.find('.js-preview').attr('src', obj.src)
  }

  toObject() {
    let obj = super.toObject()
    obj.src = this.el.find('.js-preview').attr('src')
    return obj
  }

  open() {
    this.modal.modal({
      backdrop: 'static'
    })
  }
}
