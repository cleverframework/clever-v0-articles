export default (app) => {

  function callListener(e, eventName) {
    // STOP default action
    e.preventDefault();
    e.stopImmediatePropagation();

    // Emit event
    console.log(`Emit: ${eventName}`);
    app.emit(eventName, this);
  }

  $('#addTextBlock').click(function(e) {
    callListener.call(this, e, 'addTextBlock');
  });

  $('#addImageBlock').click(function(e) {
    callListener.call(this, e, 'addImageBlock');
  });

  $('#editGalleryBlock').click(function(e) {
    callListener.call(this, e, 'editGalleryBlock');
  });

  $('#editPage').submit(function(e) {
    callListener.call(this, e, 'editPage');
  });

  $('.deletePage').click(function(e) {
    callListener.call(this, e, 'deletePage');
  });

  return app;
}
