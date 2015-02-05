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

function receiveMessage(event) {
  debug("event.source: " + event.source);
  debug("event.data: " + event.data);
  debug("event.origin: " + event.origin);

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

    // ------------
    // Supposedly the following implementation should move to 'reveiveMessage'.
    var contentURL = this.contentURL;
    var manifestURL = this.manifestURL;

    var remoteAppFrame = document.createElement('iframe');
    remoteAppFrame.setAttribute('id', 'remoteapp');
    remoteAppFrame.setAttribute('mozbrowser', 'true');
    if (manifestURL) {
      remoteAppFrame.setAttribute('mozapp', manifestURL);
    }
    remoteAppFrame.setAttribute('allowfullscreen', 'true');
    remoteAppFrame.setAttribute('style', "overflow: hidden; height: 100%; width: 100%; border: none; position: absolute; left: 0; top: 0; right: 0; bottom: 0; max-height: 100%;");
    remoteAppFrame.setAttribute('src', "data:text/html;charset=utf-8,%3C!DOCTYPE html>%3Cbody style='background:black;");
    var container = document.getElementById('container');
    this.contentBrowser = container.appendChild(remoteAppFrame);
    this.contentBrowser.src = contentURL;
    // ------------
  },

  stop: function shellRemote_stop() {

  },

};

window.addEventListener("message", receiveMessage, false);

window.onload = function() {
  if (systemRemote.hasStarted() == false) {
    systemRemote.start();
  }
};
