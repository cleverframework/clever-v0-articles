import config from './config';
import events from 'events';

// controllers
import list from './controllers/list';
import edit from './controllers/edit';

// models
import article from './models/article'


class App extends events.EventEmitter {
  constructor() {
    super();
  }
}

let app = window.app = new App();

// config
config(app);

// ctrls
list(app);
edit(app);

// models
article(app);

$(document).ready(() => {
  app.emit('appStarted');

  // Bootstrap stuff
  $('[data-toggle="tooltip"]').bsTooltip()

});
