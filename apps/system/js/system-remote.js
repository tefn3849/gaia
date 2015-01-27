/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

function getContentWindow() {
  return systemRemote.contentBrowser.contentWindow;
}

function debug(str) {
  dump(' -*- System-Remote.js: ' + str + '\n');
}

var systemRemote = {

  get contentURL() {
    return "app://clock.gaiamobile.org/index.html";
    //return "http://www.amazon.com";
  },

  get manifestURL() {
    return "app://clock.gaiamobile.org/manifest.webapp";
    //return null;
  },

  _started: false,
  hasStarted: function systemRemote_hasStarted() {
    return this._started;
  },

  start: function systemRemote_start() {
    debug("---- Starting system remote! ----");
    this._started = true;

    var contentURL = this.contentURL;
    var manifestURL = this.manifestURL;
    var contentApp = document.getElementById('content');

    contentApp.src = contentURL;
    if (manifestURL) {
      contentApp.mozApp = manifestURL;
    }

  },

  stop: function shellRemote_stop() {

  },

};

window.onload = function() {
  if (systemRemote.hasStarted() == false) {
    debug("Ready to start system remote....");
    systemRemote.start();
  }
};
