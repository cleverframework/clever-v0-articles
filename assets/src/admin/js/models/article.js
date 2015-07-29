export default (app) => {

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'csrf-token': window.csrf
  }

  app.on('POST:article', data => {
    fetch(`/api/${packageName}`, {
      method: 'post',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify(data)
    })
      .then(checkStatus)
      .then(body => app.emit('POST:article:response', body))
      .catch(function(error) {
        app.emit('POST:article:error', error)
      })
  })

  app.on('PUT:article', (id, data) => {
    fetch(`/api/${packageName}/${id}`, {
      method: 'put',
      credentials: 'same-origin',
      headers,
      body: JSON.stringify(data)
    })
      .then(checkStatus)
      .then(body => app.emit('PUT:article:response', body))
      .catch(function(error) {
        app.emit('PUT:article:error', error)
      })
  })

  app.on('DELETE:article', id => {
    fetch(`/api/${packageName}/${id}`, {
      method: 'delete',
      credentials: 'same-origin',
      headers
    })
      .then(checkStatus)
      .then(body => app.emit('DELETE:article:response', body))
      .catch(function(body) {
        app.emit('DELETE:article:error', body)
      })
  })

  function checkStatus(resp) {
    let json = resp.json()
    if (resp.status >= 200 && resp.status < 300) return json
    else  return json.then(Promise.reject.bind(Promise))
  }
}
