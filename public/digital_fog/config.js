var econfig = {
   language : "en",

   //set news feed - array currently only takes one parameter - will be extended to take more feeds
   newsfeeds : ["http://news.sap.com/feed/"],
   location : "Palo Alto",
   count : "7",
   daily : 18,
   fadeSpeed: 4000,
   forecast_header: "weather forecast",

   //greetings array - can take as many messages user wants
   greetings: ["Welcome to the d-shop @ the SAP Innovation Space", "Seasons Greetings!!"],
   unit: "imperial",

   //NHL Feed configiurations
   matches: 4,
   nhl_timeformat: "ddd h:mm",
   nhl_icon_colored: true,

   //Twitter keys and consumer secrets - these fields will all be required to perform oAuth2
   //https://dev.twitter.com/oauth/overview/application-owner-access-tokens.

   // consumer_key: "REQUIRED",
   // consumer_secret: "REQUIRED",
   // access_token_key: "REQUIRED",
   // access_token_secret: "REQUIRED",
   // screenName: "REQUIRED",
   // listToShow: "TIMELINE"
};
