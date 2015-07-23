export default (app) => {

  function callListener(e, eventName) {
    // STOP default action
    e.preventDefault();
    e.stopImmediatePropagation();

    // Emit event
    console.log(`Emit: ${eventName}`);
    app.emit(eventName, this);
  }

  $('#inputTitle').bind('keyup mouseup', function(e) {
    let replaced = $(this).val().replace(/ /g,'-');
    replaced = replaced.replace(/'/g,'-');
    replaced = replaced.replace(/[&\/\\#,+()$~%.":*?!`|<>{}]/g,'');
    $('#inputSlug').val(replaced.toLowerCase());
  });

  $('#addTextBlock').click(function(e) {
    callListener.call(this, e, 'addTextBlock');
  });

  $('#addQuoteBlock').click(function(e) {
    callListener.call(this, e, 'addQuoteBlock');
  });

  $('#addImageBlock').click(function(e) {
    callListener.call(this, e, 'addImageBlock');
  });

  $('#addGalleryBlock').click(function(e) {
    callListener.call(this, e, 'addGalleryBlock');
  });

  $('#addVideoBlock').click(function(e) {
    callListener.call(this, e, 'addVideoBlock');
  });

  $('#createPage').submit(function(e) {
    callListener.call(this, e, 'createPage');
  });

  $('#editPage').submit(function(e) {
    callListener.call(this, e, 'editPage');
  });

  $('.deletePage').click(function(e) {
    callListener.call(this, e, 'deletePage');
  });

  $('.fa-minus').click(function(e) {
    if(!confirm('Are you sure to want delete this block?')) return false;
    $(`#formGroup${$(this).data('target')}`).remove();
  });

  return app;
}
