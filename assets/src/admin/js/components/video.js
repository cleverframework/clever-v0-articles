import BaseBlock from './base-block'
import template from '../../../../../views/admin/blocks/video.jade'

export default class VideoBlock extends BaseBlock {
  constructor() {
    super(template, 'video')
  }
}
