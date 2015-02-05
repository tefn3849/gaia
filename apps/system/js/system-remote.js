'use strict';
(function() {
  function debug(str) {
    window.dump(' -*- System-Remote.js: ' + str + '\n');
  }

  var systemRemote = {
    _started: false,
    hasStarted: function systemRemote_hasStarted() {
      return this._started;
    },

    start: function systemRemote_start() {
      debug('---- Starting system remote! ----');
      this._started = true;

      this.bc = new window.BroadcastChannel('multiscreen');
      this.bc.addEventListener('message', this);
    },

    handleEvent: function(evt) {
      console.log('broadcast:' + evt);
      var contentURL = evt.url;
      var manifestURL = evt.manifestURL;

      var remoteAppFrame = document.createElement('iframe');
      remoteAppFrame.setAttribute('id', 'remoteapp');
      remoteAppFrame.setAttribute('mozbrowser', 'true');
      if (manifestURL) {
        remoteAppFrame.setAttribute('mozapp', manifestURL);
      }
      remoteAppFrame.setAttribute('allowfullscreen', 'true');
      remoteAppFrame.setAttribute('style',
        'overflow: hidden; height: 100%; width: 100%; border: none; ' +
        'position: absolute; left: 0; top: 0; right: 0; bottom: 0; ' +
        'max-height: 100%;');
      var container = document.getElementById('container');
      this.contentBrowser = container.appendChild(remoteAppFrame);
      this.contentBrowser.src = contentURL;
    },

    stop: function shellRemote_stop() {
      this._started = false;
      this.bc && this.bc.close();
    }
  };

  window.onload = function() {
    if (systemRemote.hasStarted() === false) {
      systemRemote.start();
    }
  };
}());
