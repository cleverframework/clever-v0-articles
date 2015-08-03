import slug from 'slugg'
import Blocks from '../components/blocks'

export default (app) => {

  let el = $('.js-article-edit')

  if (el.length === 0) return

  const id = el.data('id')

  // Form
  $('.js-datetime').datetimepicker()

  el.find('.js-title').on('keyup', e => {
    el.find('.js-slug').val(slug(e.target.value))
  })

  // Actions
  el.find('.js-publish').on('click', e => {
    e.preventDefault()
    app.emit('PUT:article', id, { published: true })
    onPublishChange(true)
  })

  el.find('.js-unpublish').on('click', e => {
    e.preventDefault()
    app.emit('PUT:article', id, { published: false })
    onPublishChange(false)
  })

  el.find('.js-delete').on('click', e => {
    e.preventDefault()
    if(!confirm('Are you sure to want delete this article?')) return
    app.emit('DELETE:article', id)
    window.location = `/admin/${packageName}/`
  })

  // Blocks

  const blocks = new Blocks(el.find('.js-blocks'), app)

  function onPublishChange(published) {
    el.find('.js-publish, .js-unpublish').removeClass('active')
    if (published) {
      el.find('.js-publish').addClass('active')
    } else {
      el.find('.js-unpublish').addClass('active')
    }

  }
}
