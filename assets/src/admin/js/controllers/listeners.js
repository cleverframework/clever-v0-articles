export default (app) => {

  function sendDataAjax(options) {
    $.ajax({
      url : options.formURL,
      type: options.method, // POST or PUT or PATCH
      data : options.postData,
      success:function(data, textStatus, jqXHR) {
        location.href = `${options.urlCallback}/${data._id}`;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // Show the errors to the page
        options.$errorMessage.html(`${jqXHR.responseJSON[0].msg}.`);
        options.$error.removeClass('hidden');

        // Enable the submit form button
        options.$btn.removeClass('disabled');
      }
    });
  }

  app.on('appStarted', () => {
    console.log(`${app.config.name} started`);
  });

  app.on('addTextBlock', () => {

    const formGroup = document.createElement('div');
    const textarea = document.createElement('textarea');
    const label = document.createElement('label');
    const faSort = document.createElement('i');
    const faMinus = document.createElement('i');

    $(faSort).addClass('fa')
      .addClass('fa-sort')
      .appendTo($(label))

    $(faMinus).addClass('fa')
      .addClass('fa-minus')
      .css('margin-left', '5px')
      .click(e => {
        if(!confirm('Are you sure to want delete this block?')) return false;
        $(formGroup).remove();
      })
      .appendTo($(label))

    $(label).addClass('pull-right')
      .appendTo($(formGroup))

    $(textarea).addClass('form-control')
      .attr('name', 'text[]')
      .attr('Placeholder', 'Feel free to write soemthing...')
      .attr('rows', 5)
      .appendTo($(formGroup))

    $(formGroup).addClass('form-group')
      .appendTo($('#pageBlocks'))
      .click(function(){
        // $(this).remove();
      })
      .hide()
      .slideToggle(300)

  });

  app.on('addImageBlock', () => {

    const formGroup = document.createElement('div');
    const inputSelect = document.createElement('select');
    const label = document.createElement('label');
    const faSort = document.createElement('i');
    const faMinus = document.createElement('i');

    $(faSort).addClass('fa')
      .addClass('fa-sort')
      .appendTo($(label))

    $(faMinus).addClass('fa')
      .addClass('fa-minus')
      .css('margin-left', '5px')
      .click(e => {
        $(formGroup).remove();
      })
      .appendTo($(label))

    $(label).addClass('pull-right')
      .appendTo($(formGroup))

    $(inputSelect).addClass('form-control')
      .attr('name', 'image[]')
      .appendTo($(formGroup))
      .html('<option value=""></option><option value="1">Amazing</option>')
      .autoselect()

    $(formGroup).addClass('form-group')
      .appendTo($('#pageBlocks'))
      .click(function(){
        // $(this).remove();
      })
      .hide()
      .slideToggle(300)

  });

  app.on('editPage', (form) => {

    const $editPageError = $('#editPageError');
    const $editPageBtn = $('#editPageBtn');
    const options = {
      formURL: $(form).attr('action'),
      method: $(form).attr('method'),
      postData: $(form).serialize(),
      urlCallback: '/admin/pages',
      $error: $editPageError,
      $errorMessage: $('#editPageError .message'),
      $btn: $editPageBtn
    }

    // Clear the error message div
    $editPageError.addClass('hidden');

    // Send Ajax
    sendDataAjax(options);

    // Disable the submit form button
    $editPageBtn.addClass('disabled');

  });

  app.on('deletePage', (btn) => {

    if(!confirm('Are you sure to want delete this page?')) return false;

    const $btn = $(btn);

    console.log($btn.data('id'))

    const request = $.ajax({
      url: `/api/pages/${$btn.data('id')}`,
      beforeSend: function (request) {
        request.setRequestHeader('csrf-token', window.csrf);
      },
      method: 'DELETE'
    });

    request.done(function(msg) {
      if(window.urlreload === -1) {
        return location.reload();
      }
      location.href = window.urlreload;
    });

    request.fail(function( jqXHR, textStatus ) {
      console.error(`Request failed: ${textStatus}`);
    });

  });

  return app;
}
