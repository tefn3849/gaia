/* global BaseModule, BroadcastChannel */
'use strict';

(function() {
  var MultiScreenController = function() {};
  MultiScreenController.EVENTS = [
    'volumedown'
  ];
  BaseModule.create(MultiScreenController, {
    name: 'MultiScreenController',
    _start: function() {
      this.bc = new BroadcastChannel('multiscreen');
      this.publish('mozContentEvent', {
        type: 'launch-remote'
      }, true);
    },
    _handle_volumedown: function() {
      var app = this.service.query('getTopMostWindow');
      if (!app) {
        return;
      }
      this.bc && this.bc.postMessage({
        url: app.url,
        manifestURL: app.manifestURL
      });
    }
  });
}());