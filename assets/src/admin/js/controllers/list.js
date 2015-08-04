import modal from '../../../../../views/admin/create-modal.jade'
import slug from 'slugg'

export default (app) => {

  let el = $('.js-article-list')

  if (el.length === 0) return

  let createModal = null

  el.find('.js-create').on('click', e => {
    e.preventDefault()
    createModal = $(modal())
    createModal
      .appendTo('body')
      .modal()

    setTimeout(() => {
      createModal.find('input').focus()
    }, 150)


    createModal.on('submit', '.js-form', e => {
      e.preventDefault()
      createModal.find('.js-error').hide()
      const title = createModal.find('.js-title').val()
      app.emit('POST:article', { title: title, slug: slug(title) })
    })

    createModal.on('hidden.bs.modal', () => {
      createModal.remove()
      createModal = null
    })

  })

  el.find('.js-publish').on('click', e => {
    e.preventDefault()
    app.emit('PUT:article', e.currentTarget.dataset.id, { published: true })
  })

  el.find('.js-unpublish').on('click', e => {
    e.preventDefault()
    app.emit('PUT:article', e.currentTarget.dataset.id, { published: false })
  })

  el.find('.js-delete').on('click', e => {
    e.preventDefault()
    if(!confirm('Are you sure to want delete this article?')) return
    app.emit('DELETE:article', e.currentTarget.dataset.id)
  })

  app.on('PUT:article:response', () => window.location.reload())

  app.on('POST:article:response', response => {
    window.location = `/admin/${packageName}/${response._id}/edit`
  })

  app.on('DELETE:article:response', () => window.location.reload())

  // TODO: missing DELETE:article:error

  app.on('POST:article:error', error => {
    createModal.find('.js-error')
      .text(error[0].msg)
      .show()
  })

}
