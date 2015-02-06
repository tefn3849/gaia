/* global BaseModule, BroadcastChannel */
'use strict';

(function() {
  var MultiScreenController = function() {};
  MultiScreenController.EVENTS = [
    'message',
    'volumedown'
  ];
  BaseModule.create(MultiScreenController, {
    name: 'MultiScreenController',
    DEBUG: true,
    _start: function() {
      this.bc = new BroadcastChannel('multiscreen');
      this.bc.addEventListener('message', this);
    },
    _handle_message: function(evt) {
      if (evt.data === 'remote-system-started') {
        // window.addEventListener('volumedown', this);
      }
    },
    _handle_volumedown: function() {
      var app = this.service.query('getTopMostWindow');
      if (!app) {
        return;
      }
      this.debug(app.url, app.manifestURL);
      this.bc && this.bc.postMessage({
        url: app.url,
        manifestURL: app.manifestURL
      });
    }
  });
}());