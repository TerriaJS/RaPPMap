"use strict";

import defined from "terriajs-cesium/Source/Core/defined";
import when from "terriajs-cesium/Source/ThirdParty/when";
import loadWithXhr from "terriajs/lib/Core/loadWithXhr";

export default function showDisclaimer(globalDisclaimer, viewState) {
  if (!globalDisclaimer) {
    return;
  }

  fetchDowntimeNoticeHtml(globalDisclaimer.downtimeNoticeUrl).then(
    downtimeNotice => {
      const hostname = window.location.hostname;
      if (
        globalDisclaimer.enableOnLocalhost ||
        hostname.indexOf("localhost") === -1
      ) {
        let message = "";
        // Sometimes we want to show a preamble if the user is viewing a site
        // other than the official production instance.  This can be expressed
        // as a devHostRegex ("any site starting with staging.") or a negative
        // prodHostRegex ("any site not ending in .gov.au")
        if (
          (defined(globalDisclaimer.devHostRegex) &&
            hostname.match(globalDisclaimer.devHostRegex)) ||
          (defined(globalDisclaimer.prodHostRegex) &&
            !hostname.match(globalDisclaimer.prodHostRegex))
        ) {
          message += require("./lib/Views/DevelopmentDisclaimerPreamble.html");
        }
        if (downtimeNotice) {
          message += downtimeNotice;
        }
        message += require("./lib/Views/GlobalDisclaimer.html");

        const options = {
          title:
            globalDisclaimer.title !== undefined
              ? globalDisclaimer.title
              : "Warning",
          confirmText: globalDisclaimer.buttonTitle || "Ok",
          width: 600,
          height: downtimeNotice ? 600 : 550,
          message: message,
          horizontalPadding: 100
        };
        viewState.notifications.push(options);
      }
    }
  );
}

function fetchDowntimeNoticeHtml(url) {
  if (url) {
    return loadWithXhr(url).otherwise(e => undefined);
  } else {
    return when();
  }
}
