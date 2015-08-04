import BaseBlock from './base-block'
import template from '../../../../../views/admin/blocks/gallery.jade'

export default class GalleryBlock extends BaseBlock {
  constructor() {
    super(template, 'gallery')
  }

  render() {
    this.el = $(template({galleries: window.galleryList}))
  }

  fromObject(obj) {
    this.el.find('[name="value"] option')
      .prop('selected', false)
      .filter('[value="'+obj.value+'"]')
      .prop('selected', true)
  }
}
