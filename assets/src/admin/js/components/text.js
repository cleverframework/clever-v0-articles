import BaseBlock from './base-block'
import template from '../../../../../views/admin/blocks/text.jade'
import Scribe from 'scribe-editor'
import scribePluginToolbar from 'scribe-plugin-toolbar'
import scribePluginLinkPromptCommand from 'scribe-plugin-link-prompt-command'
import scribePluginIntelligentUnlinkCommand from 'scribe-plugin-intelligent-unlink-command'
import scribePluginHeadingCommand from 'scribe-plugin-heading-command'
import scribePluginCurlyQuotes from 'scribe-plugin-curly-quotes'


export default class TextBlock extends BaseBlock {
  constructor() {
    super(template)
    this.setupEditor()
  }

  setupEditor() {
    console.log(this.el)
    this.scribe = new Scribe(this.el.find('.js-editor')[0], { allowBlockElements: true })
    this.scribe.setContent('<p>Hello, World!</p>')
    this.scribe.use(scribePluginToolbar(this.el.find('.js-editor-toolbar')[0]))
    this.scribe.use(scribePluginLinkPromptCommand())
    this.scribe.use(scribePluginIntelligentUnlinkCommand())
    this.scribe.use(scribePluginHeadingCommand(2))
    this.scribe.use(scribePluginCurlyQuotes())
  }
}
