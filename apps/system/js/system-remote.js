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
      this.bc.postMessage('remote-system-started');
    },

    handleEvent: function(evt) {
      var container = document.getElementById('container');
      var contentURL = evt.data.url;
      var manifestURL = evt.data.manifestURL;

      if (this.contentBrowser) {
        var frameToRemove = this.contentBrowser;
        var remoteAppFrame = this.createAppFrame(contentURL, manifestURL);
        this.contentBrowser = container.appendChild(remoteAppFrame);

        // Remove the previous app until the new frame is loaded to
        // avoid blinking.
        var self = this;
        this.contentBrowser.addEventListener('mozbrowserloadend',
                                             function onloadend() {
          container.removeChild(frameToRemove);
          self.contentBrowserremoveEventListener(onloadend);
        });

        return;
      }

      var remoteAppFrame = this.createAppFrame(contentURL, manifestURL);
      this.contentBrowser = container.appendChild(remoteAppFrame);
    },

    createAppFrame: function(url, manifestURL) {
      var remoteAppFrame = document.createElement('iframe');
      remoteAppFrame.setAttribute('id', 'remoteapp');
      remoteAppFrame.setAttribute('remote', 'true');
      remoteAppFrame.setAttribute('mozbrowser', 'true');
      if (manifestURL) {
        remoteAppFrame.setAttribute('mozapp', manifestURL);
      }
      remoteAppFrame.setAttribute('allowfullscreen', 'true');
      remoteAppFrame.setAttribute('style',
        'overflow: hidden; height: 100%; width: 100%; border: none; ' +
        'position: absolute; left: 0; top: 0; right: 0; bottom: 0; ' +
        'max-height: 100%;');
      remoteAppFrame.src = url;
      return remoteAppFrame;
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
