export default (app) => {

  app.on('POST:article', data => {
    console.log(data)

    const req = fetch(`/api/${packageName}`, {
      method: 'post',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'csrf-token': window.csrf
      },
      body: JSON.stringify(data)
    })
      .then((resp) => {
        let json = resp.json()

        if (resp.status >= 200 && resp.status < 300)
          return json
        else
          return json.then(Promise.reject.bind(Promise))
      })
      .then(body => app.emit('POST:article:response', body))
      .catch(function(error) {
        app.emit('POST:article:error', error)
      })
  })

  app.on('PUT:article', (id, data) => {
    fetch(`/api/${packageName}/${id}`, {
      method: 'put',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'csrf-token': window.csrf
      },
      body: JSON.stringify(data)
    })
      .then(checkStatus)
      .then(resp => resp.json())
      .then(body => app.emit('PUT:article:response', body))
      .catch(function(error) {
        app.emit('PUT:article:error', error)
      })
  })

  app.on('DELETE:article', id => {
    const req = fetch(`/api/${packageName}/${id}`, {
      method: 'delete',
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'csrf-token': window.csrf
      }
    })

    req
      .then(resp => resp.json())
      .then(body => app.emit('DELETE:article:response', body))
      .catch(function(body) {
        console.log(body)
        app.emit('DELETE:article:error', body)
      })
  })

  function checkStatus(req, res) {
    if (res.status >= 200 && res.status < 300) {
      return res
    } else {
      res.json()
        .then(data => {
          req.reject(data)
        })
    }
  }
}
