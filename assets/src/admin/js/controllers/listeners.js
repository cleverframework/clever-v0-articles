export default (app) => {

  function sendDataAjax(options) {
    $.ajax({
      url : options.formURL,
      type: options.method, // POST or PUT or PATCH
      data : options.postData,
      dataType : 'JSON',
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

    // $('#addBlock').dropdown('toogle');

    const formGroup = document.createElement('div');
    const textarea = document.createElement('textarea');
    const label = document.createElement('label');
    const faSort = document.createElement('i');
    const faMinus = document.createElement('i');
    const labelName = document.createElement('span');

    $(labelName).addClass('pull-left')
      .html('<b>TEXT</b>')
      .appendTo($(label));

    $(faMinus).addClass('fa')
      .addClass('fa-minus')
      .addClass('pull-right')
      .css('margin-right', '5px')
      .click(e => {
        if(!confirm('Are you sure to want delete this block?')) return false;
        $(formGroup).remove();
      })
      .appendTo($(label));

    $(faSort).addClass('fa')
      .addClass('fa-sort')
      .addClass('pull-right')
      .appendTo($(label));

    $(label).css('width', '100%')
      .appendTo($(formGroup));

    $(textarea).addClass('form-control')
      .addClass('page-blocks')
      .attr('data-type', 'text')
      .attr('name', 'texts[]')
      .attr('Placeholder', 'Feel free to write soemthing...')
      .attr('rows', 5)
      .appendTo($(formGroup));

    $(formGroup).addClass('form-group')
      .appendTo($('#pageBlocks'))
      .click(function(){
        // $(this).remove();
      })
      .hide()
      .slideToggle(300);

  });

  app.on('addQuoteBlock', () => {

    // $('#addBlock').dropdown('toogle');

    const formGroup = document.createElement('div');
    const textarea = document.createElement('textarea');
    const label = document.createElement('label');
    const faSort = document.createElement('i');
    const faMinus = document.createElement('i');
    const labelName = document.createElement('span');

    $(labelName).addClass('pull-left')
      .html('<b>QUOTE</b>')
      .appendTo($(label));

    $(faMinus).addClass('fa')
      .addClass('fa-minus')
      .addClass('pull-right')
      .css('margin-right', '5px')
      .click(e => {
        if(!confirm('Are you sure to want delete this block?')) return false;
        $(formGroup).remove();
      })
      .appendTo($(label));

    $(faSort).addClass('fa')
      .addClass('fa-sort')
      .addClass('pull-right')
      .appendTo($(label));

    $(label).css('width', '100%')
      .appendTo($(formGroup));

    $(textarea).addClass('form-control')
      .addClass('page-blocks')
      .attr('data-type', 'quote')
      .attr('name', 'quotes[]')
      .attr('Placeholder', 'Feel free to write soemthing...')
      .attr('rows', 5)
      .appendTo($(formGroup));

    $(formGroup).addClass('form-group')
      .appendTo($('#pageBlocks'))
      .click(function(){
        // $(this).remove();
      })
      .hide()
      .slideToggle(300);

  });

  app.on('addImageBlock', () => {

    // $('#addBlock').dropdown('toogle');

    const formGroup = document.createElement('div');
    const inputSelect = document.createElement('select');
    const label = document.createElement('label');
    const faSort = document.createElement('i');
    const faMinus = document.createElement('i');
    const labelName = document.createElement('span');

    let inputSelectOptions = '<option value="-1" selected></option>';

    window.imageList.forEach(function(image, index) {
      inputSelectOptions += `<option value="${image._id}">${image.title}</option>`;
    });

    $(labelName).addClass('pull-left')
      .html('<b>IMAGE</b>')
      .appendTo($(label));

    $(faMinus).addClass('fa')
      .addClass('fa-minus')
      .addClass('pull-right')
      .css('margin-right', '5px')
      .click(e => {
        if(!confirm('Are you sure to want delete this block?')) return false;
        $(formGroup).remove();
      })
      .appendTo($(label));

    $(faSort).addClass('fa')
      .addClass('fa-sort')
      .addClass('pull-right')
      .appendTo($(label));

    $(label).css('width', '100%')
      .appendTo($(formGroup));

    $(inputSelect).addClass('form-control')
      .addClass('page-blocks')
      .attr('data-type', 'image')
      .attr('name', 'images[]')
      .attr('placeholder', 'Select an image from your library')
      .appendTo($(formGroup))
      .html(inputSelectOptions);

    $(formGroup).addClass('form-group')
      .appendTo($('#pageBlocks'))
      .click(function(){
        // $(this).remove();
      })
      .hide()
      .slideToggle(300);

  });

  app.on('addGalleryBlock', () => {

    // $('#addBlock').dropdown('toogle');

    const formGroup = document.createElement('div');
    const inputSelect = document.createElement('select');
    const label = document.createElement('label');
    const faSort = document.createElement('i');
    const faMinus = document.createElement('i');
    const labelName = document.createElement('span');

    let inputSelectOptions = '<option value="-1" selected></option>';

    window.galleryList.forEach(function(gallery, index) {
      inputSelectOptions += `<option value="${gallery._id}">${gallery.title}</option>`
    });

    $(labelName).addClass('pull-left')
      .html('<b>GALLERY</b>')
      .appendTo($(label));

    $(faMinus).addClass('fa')
      .addClass('fa-minus')
      .addClass('pull-right')
      .css('margin-right', '5px')
      .click(e => {
        if(!confirm('Are you sure to want delete this block?')) return false;
        $(formGroup).remove();
      })
      .appendTo($(label));

    $(faSort).addClass('fa')
      .addClass('fa-sort')
      .addClass('pull-right')
      .appendTo($(label));

    $(label).css('width', '100%')
      .appendTo($(formGroup));

    $(inputSelect).addClass('form-control')
      .addClass('page-blocks')
      .attr('data-type', 'gallery')
      .attr('name', 'images[]')
      .attr('placeholder', 'Select a gallery from your library')
      .appendTo($(formGroup))
      .html(inputSelectOptions);

    $(formGroup).addClass('form-group')
      .appendTo($('#pageBlocks'))
      .click(function(){
        // $(this).remove();
      })
      .hide()
      .slideToggle(300);

  });

  app.on('addVideoBlock', () => {

    // $('#addBlock').dropdown('toogle');

    const formGroup = document.createElement('div');
    const inputText = document.createElement('input');
    const label = document.createElement('label');
    const faSort = document.createElement('i');
    const faMinus = document.createElement('i');
    const labelName = document.createElement('span');

    $(labelName).addClass('pull-left')
      .html('<b>VIDEO</b>')
      .appendTo($(label));

    $(faMinus).addClass('fa')
      .addClass('fa-minus')
      .addClass('pull-right')
      .css('margin-right', '5px')
      .click(e => {
        if(!confirm('Are you sure to want delete this block?')) return false;
        $(formGroup).remove();
      })
      .appendTo($(label));

    $(faSort).addClass('fa')
      .addClass('fa-sort')
      .addClass('pull-right')
      .appendTo($(label));

    $(label).css('width', '100%')
      .appendTo($(formGroup));

    $(inputText).addClass('form-control')
      .addClass('page-blocks')
      .attr('data-type', 'video')
      .attr('name', 'videos[]')
      .attr('placeholder', 'https://www.youtube.com/watch?v=MV_3Dpw-BRY')
      .appendTo($(formGroup));

    $(formGroup).addClass('form-group')
      .appendTo($('#pageBlocks'))
      .click(function(){
        // $(this).remove();
      })
      .hide()
      .slideToggle(300);

  });

  app.on('createPage', (form) => {

    const $createPageError = $('#createPageError');
    const $createPageBtn = $('#createPageBtn');

    const postData = {
      title: $('#inputTitle').val(),
      slug: $('#inputSlug').val(),
      standfirst: $('#inputStandfirst').val(),
      start: $('#inputStart').val().trim(' ') === '' ? undefined : $('#inputStart').val(),
      end: $('#inputEnd').val().trim(' ') === '' ? undefined : $('#inputEnd').val(),
      blocks: [],
      _csrf: $('#inputCsrf').val()
    };

    $('.page-blocks').each(function(index) {
      const block = {};
      block.type = $(this).data('type');
      block.value = $(this).val();
      block.order = index;
      postData.blocks.push(block);
    });

    const options = {
      formURL: $(form).attr('action'),
      method: $(form).attr('method'),
      postData: postData,
      urlCallback: '/admin/articles',
      $error: $createPageError,
      $errorMessage: $('#createPageError .message'),
      $btn: $createPageBtn
    };

    // Clear the error message div
    $createPageError.addClass('hidden');

    // Send Ajax
    sendDataAjax(options);

    // Disable the submit form button
    $createPageBtn.addClass('disabled');

  });

  app.on('editPage', (form) => {

    const $editPageError = $('#editPageError');
    const $editPageBtn = $('#editPageBtn');

    const putData = {
      title: $('#inputTitle').val(),
      slug: $('#inputSlug').val(),
      standfirst: $('#inputStandfirst').val(),
      start: $('#inputStart').val().trim(' ') === '' ? undefined : $('#inputStart').val(),
      end: $('#inputEnd').val().trim(' ') === '' ? undefined : $('#inputEnd').val(),
      blocks: [],
      _csrf: $('#inputCsrf').val()
    };

    $('.page-blocks').each(function(index) {
      const block = {};
      block.type = $(this).data('type');
      block.value = $(this).val();
      block.order = index;
      putData.blocks.push(block);
    });

    const options = {
      formURL: $(form).attr('action'),
      method: $(form).attr('method'),
      postData: putData,
      urlCallback: '/admin/articles',
      $error: $editPageError,
      $errorMessage: $('#editPageError .message'),
      $btn: $editPageBtn
    };

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
      url: `/api/articles/${$btn.data('id')}`,
      beforeSend: function (request) {
        request.setRequestHeader('csrf-token', window.csrf);
      },
      method: 'DELETE'
    });

    request.done(function(msg) {
      if(window.urlreload === false) {
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
