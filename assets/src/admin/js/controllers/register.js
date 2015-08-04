// export default (app) => {
//
//   function callListener(e, eventName) {
//     // STOP default action
//     e.preventDefault();
//     e.stopImmediatePropagation();
//
//     // Emit event
//     console.log(`Emit: ${eventName}`);
//     app.emit(eventName, this);
//   }
//
//
//
//   $('#addTextBlock').click(function(e) {
//     callListener.call(this, e, 'addTextBlock');
//   });
//
//   $('#addQuoteBlock').click(function(e) {
//     callListener.call(this, e, 'addQuoteBlock');
//   });
//
//   $('#addImageBlock').click(function(e) {
//     callListener.call(this, e, 'addImageBlock');
//   });
//
//   $('#addGalleryBlock').click(function(e) {
//     callListener.call(this, e, 'addGalleryBlock');
//   });
//
//   $('#addVideoBlock').click(function(e) {
//     callListener.call(this, e, 'addVideoBlock');
//   });
//
//   $('#createArticle').submit(function(e) {
//     callListener.call(this, e, 'createArticle');
//   });
//
//   $('#editArticle').submit(function(e) {
//     callListener.call(this, e, 'editArticle');
//   });
//
//   $('.deleteArticle').click(function(e) {
//     callListener.call(this, e, 'deleteArticle');
//   });
//
//   $('.fa-minus').click(function(e) {
//     if(!confirm('Are you sure to want delete this block?')) return false;
//     $(`#formGroup${$(this).data('target')}`).remove();
//   });
//
//   return app;
// }
