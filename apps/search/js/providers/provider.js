'use strict';

/**
 * Base Provider class
 */
function Provider() {
}

Provider.prototype = {

  /**
   * Name of the provider
   * Overridden at the child provider level
   */
  name: 'Provider',

  /**
   * Whether or not this provider dedupes results.
   */
  dedupes: false,

  /**
   * Initializes the provider container and adds listeners
   */
  init: function(searchObj) {
    this.searchObj = searchObj;
    this.container = document.getElementById(this.name.toLowerCase());
    this.container.addEventListener('click', this.click.bind(this));
  },

  /**
   * Clears the rendered results of this provider from the app grid
   */
  clear: function() {
    this.container.innerHTML = '';
  },

  /**
   * Handler when a result is clicked
   */
  click: function() {},

  /**
   * Aborts any in-progress request.
   */
  abort: function() {
    if (this.request && this.request.abort) {
      this.request.abort();
    }
  },

  /**
   * Renders a set of results.
   * Each result may contain the following attributes:
   * - title: The title of the app.
   * - meta: Secondary content to show for the result.
   * - icon: The icon of the result.
   * - dataset: Data attributes to apply to the result.
   * - label: Aria-label for the result.
   * - description: Additional description for the result.
   */
  buildResultsDom: function(results) {
    //<div class="result" data-url="mozilla.com" role="link"
    //  aria-label="My Urlasljd alskdja lsdjka sldjk"
    //  aria-describedby="description-0">
    //  <div class="icon">
    //    <img role="presentation" src="..." />
    //  </div>
    //  <div class="urlwrapper">
    //    <span class="title">My Urlasljd <span class="highlight">alskd</span>
    //      ja lsdjka sldjk</span>
    //    <small id="description-0" class="url"
    //      aria-label="http://url.com">http://url.com</small>
    //  </div>
    //</div>

    var frag = document.createDocumentFragment();
    results.forEach(function(config, index) {

      var result = document.createElement('div');
      var iconWrapper = document.createElement('div');
      var icon = document.createElement('img');
      var description = document.createElement('div');
      var title = document.createElement('span');
      var meta = document.createElement('small');

      result.classList.add('result');
      iconWrapper.classList.add('icon');
      iconWrapper.classList.add('empty');
      description.classList.add('description');
      title.classList.add('title');
      meta.classList.add('meta');

      for (var i in config.dataset) {
        result.dataset[i] = config.dataset[i];
      }

      title.textContent = config.title || config.url;
      if (config.meta) {
        meta.textContent = config.meta;
        // Expose meta infrormation as a helpful description for each result.
        if (config.description) {
          meta.id = this.name + '-description-' + index;
          meta.setAttribute('aria-label', config.description);
          result.setAttribute('aria-describedby', meta.id);
        }
      }

      icon.setAttribute('role', 'presentation');

      result.setAttribute('role', 'link');
      // Either use an explicit label or, if not present, title.
      result.setAttribute('aria-label', config.label || config.title);

      description.appendChild(title);
      description.appendChild(meta);
      iconWrapper.appendChild(icon);
      result.appendChild(iconWrapper);
      result.appendChild(description);
      frag.appendChild(result);
    }, this);
    return frag;
  },

  render: function(results) {
    var dom = this.buildResultsDom(results);
    this.container.appendChild(dom);
  }
};
