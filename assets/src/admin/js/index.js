import config from './config';
import events from 'events';

class App extends events.EventEmitter {
  constructor() {
    super();
  }
}

// controllers
import listener from './controllers/listeners';
import register from './controllers/register';
// import jqueryAutoselect from 'jquery-autoselect';

let app = window.app = new App();

// jQuery plugins
// jqueryAutoselect($);

// config
config(app);

// ctrls
listener(app);
register(app);

$(document).ready(() => {
  app.emit('appStarted');

  // Bootstrap stuff
  $('[data-toggle="tooltip"]').bsTooltip()

});
