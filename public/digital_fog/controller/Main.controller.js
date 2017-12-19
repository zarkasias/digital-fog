/*******************************************************************************
 * Copyright (c) 2017 SAP SE or an affiliate company. All rights reserved.
 ******************************************************************************/


sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/CustomListItem",
  "sap/m/Label",
], function(Controller, CustomListItem, Label) {
  "use strict";

  return Controller.extend("sap.electron.DigitalFog.controller.Main", {

    onInit: function() {
      this.getRouter().attachRouteMatched(this.onRouteMatched, this);

      var oModel = new sap.ui.model.json.JSONModel(this.digitalObject);
      this.model = oModel;
      this.getView().setModel(oModel);

      this.getView().addEventDelegate({
        onAfterShow: jQuery.proxy(function(evt) {
          this.onAfterShow(evt);
        }, this)
      });
    },

    onAfterShow: function() {
      var that = this;
      this.setSecondSettingPosition();
        for (var i in that.config) {
          if (econfig[i]) {
            that.config[i] = econfig[i];
          }
        }
        //that.setupTwitter();
        that.setGreeting();
        that.getNewsFeed();
        that.getNHLFeed();
    },

    onRouteMatched: function(oEvent) {
      var that = this;

      this.weatherlabel = this.getView().byId("current_weather");
      this.forecastlabel = this.getView().byId("forecast_header");
      this.forecastlist = this.getView().byId("forecast_list");

      //news related controls
      this.newscontainer = this.getView().byId("newsfeed_container");
      this.newstitle = this.getView().byId("news_title");
      this.newsdescription = this.getView().byId("news_description");
      this.newsbusy = this.getView().byId("news_busy");
      this.getCurrentTime(this);
      this.getCurrentLocation();
    },

    digitalObject: {
      time: '',
      date: '',
      seconds: '',
      temperature: '',
      nhlheader: '',
      scores: []
    },

    weatherType: '',

    //the location will be configured to be dynamic
    config: {
      language: "en",
      apiVersion: "2.5",
      apiBase: "http://api.openweathermap.org/data/",
      newsfeeds: ["http://news.sap.com/feed/"],
      weatherEndpoint: "weather",
      forecastEndpoint: "forecast",
      location: "Palo Alto",
      openweather_appid: "beaed0ccefc4e0b851224127ab4bcab8",
      count: "7",
      daily: 18,
      animationSpeed: 2.5 * 1000,
      fadeSpeed: 4000,
      greetingUpdateInterval: 30000,
      newsUpdateInterval: 10 * 1000,
      nhlrotateInterval: 20 * 1000,
      nhlreloadInterval: 30 * 60 * 1000,
      forecast_header: "weather forecast",
      greetings: ["Welcome to the d-shop @ the SAP Innovation Space"],
      unit: "imperial", //change to metric for celsius
      //NHL url
      matches: 6,
      nhl_url: "http://live.nhle.com/GameData/RegularSeasonScoreboardv3.jsonp",
      nhl_timeformat: 'ddd h:mm',
      nhl_icon_colored: false,
      //for twitter module
      consumer_key: 'tkwgIgsbtLwDIvpqvOpurWCnV',
      consumer_secret: '1DeNM1G15nDssTfvKJwr1HA6nURWTWP9QyVbzy3Hpvw2MPfGVX',
      access_token_key: '34385027-ICXUWIEJyH6Fc6YzxqwPv4iBEs2Y7XzaXKJDrdYf2',
      access_token_secret: '3gCKhNZ8KDsG8XQW66OijeVVap7NeWZf03HWErwd3OG0e',
      // set the username and either timeline or listname
      screenName: 'zarkasias',
      listToShow: 'TIMELINE'
    },

    rotateIndex: 0,
    gamedetails: {},
    nextMatch: null,
    live: {
      state: false,
      matches: []
    },

    nhlmodes: {
      '01': 'Pre-Season',
      '02': 'Regular-Season',
      '03': 'Playoffs'
    },

    nhldetails: {
      y: (new Date()).getFullYear(),
      t: '01'
    },

    states: {
      '1st': '1ST_PERIOD',
      '2nd': '2ND_PERIOD',
      '3rd': '3RD_PERIOD',
      OT: 'OVER_TIME',
      SO: 'SHOOTOUT',
      FINAL: 'FINAL',
      'FINAL OT': 'FINAL_OVERTIME',
      'FINAL SO': 'FINAL_SHOOTOUT'
    },

    teams: {
      avalanche: 'COL',
      blackhawks: 'CHI',
      bluejackets: 'CBJ',
      blues: 'STL',
      bruins: 'BOS',
      canadiens: 'MTL',
      canucks: 'VAN',
      capitals: 'WSH',
      coyotes: 'ARI',
      devils: 'NJD',
      ducks: 'ANA',
      flames: 'CGY',
      flyers: 'PHI',
      goldenknights: 'VGK',
      hurricanes: 'CAR',
      islanders: 'NYI',
      jets: 'WPG',
      kings: 'LAK',
      lightning: 'TBL',
      mapleleafs: 'TOR',
      oilers: 'EDM',
      panthers: 'FLA',
      penguins: 'PIT',
      predators: 'NSH',
      rangers: 'NYR',
      redwings: 'DET',
      sabres: 'BUF',
      senators: 'OTT',
      sharks: 'SJS',
      stars: 'DAL',
      wild: 'MIN'
    },

    weatherIcons: {
      "01d": "wi-day-sunny",
      "02d": "wi-day-cloudy",
      "03d": "wi-cloudy",
      "04d": "wi-cloudy-windy",
      "09d": "wi-showers",
      "10d": "wi-rain",
      "11d": "wi-thunderstorm",
      "13d": "wi-snow",
      "50d": "wi-fog",
      "01n": "wi-night-clear",
      "02n": "wi-night-cloudy",
      "03n": "wi-night-cloudy",
      "04n": "wi-night-cloudy",
      "09n": "wi-night-showers",
      "10n": "wi-night-rain",
      "11n": "wi-night-thunderstorm",
      "13n": "wi-night-snow",
      "50n": "wi-night-alt-cloudy-windy"
    },


    months: {
      0: "January",
      1: "February",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December"
    },

    days: {
      1: "Monday",
      2: "Tuesday",
      3: "Wednesday",
      4: "Thursday",
      5: "Friday",
      6: "Saturday",
      7: "Sunday"
    },

    setupTwitter: function() {
      var that = this;

      var twitterconfig = {
        "consumer_key" : that.config.consumer_key,
        "consumer_secret" : that.config.consumer_secret,
        "access_token_key" : that.config.access_token_key,
        "access_token_secret" : that.config.access_token_secret,
        "screenName" : that.config.screenName,
        "listToShow" : that.config.listToShow
      };

      var payload = JSON.stringify(twitterconfig);


      $.ajax({
        url: "http://localhost:4800/twitterconfig",
        type: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        data: payload,
        dataType: "json",
        async: true,
        success: function(data) {
          console.log(data.statusText)
        },

        error: function(data) {
        console.log(data.statusText);
        }

      });

    },


    //function used to get users local time and set it to the model
    getCurrentTime: function(controller) {
      var localeOptions = Intl.DateTimeFormat().resolvedOptions();
      var today = new Date().toLocaleString(localeOptions.locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      controller.digitalObject.date = new Date().toLocaleString(localeOptions.locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      controller.digitalObject.time = new Date().toLocaleString(localeOptions.locale, {
        hour: 'numeric',
        minute: 'numeric'
      });
      controller.model.refresh();
      var timer = setTimeout(function() {
        controller.getCurrentTime(controller)
      }, 500);
    },

    getCurrentLocation: function() {
      var that = this;
      var arrayLoc = [];
      //get our current location JSON data:
      var locURL = "https://ipinfo.io/json?callback=?";

      //JSONP call
      $.getJSON(locURL).done(function(data) {
        that.config.location = data.city;
        arrayLoc = data.loc.split(",");
        if (arrayLoc != undefined) {
          that.getLocalWeather(arrayLoc);
          that.getLocalForecast(arrayLoc);
        }
      });

    },

    getLocalWeather: function(latlng) {
      var that = this;
      var url = this.config.apiBase + this.config.apiVersion + "/" + this.config.weatherEndpoint + this.getParams(latlng);

      $.getJSON(url, function(data) {
        //console.log(data);
        that.digitalObject.temperature = parseFloat(data.main.temp).toFixed(0) + "\xB0" + that.getDegree();
        that.weatherType = that.weatherIcons[data.weather[0].icon];
        that.weatherlabel.addStyleClass("wi weathericon " + that.weatherType);
        that.model.refresh();
      })
    },

    getLocalForecast: function(latlng) {
      var that = this;
      var url = this.config.apiBase + this.config.apiVersion + "/" + this.config.forecastEndpoint + this.getParams(latlng);

      $.getJSON(url, function(data) {
        var fheader = that.config.forecast_header + " " + data.city.name + ", " + data.city.country;
        that.forecastlabel.setText(fheader.toUpperCase());
        that.processForecast(data.list);
      })
    },

    processForecast: function(list) {
      var that = this;
      var localeOptions = Intl.DateTimeFormat().resolvedOptions();
      that.forecastlist.removeAllItems();
      var today = new Date().getDate();
      for (var i = 0; i < list.length; i++) {
        var ldate = new Date(list[i].dt_txt).getDate();
        var hour = new Date(list[i].dt_txt).getHours();
        if (ldate !== today && (hour === that.config.daily)) {
          var forecast = new CustomListItem();
          var weekday = new Label({
            text: new Date(list[i].dt_txt).toLocaleString(localeOptions.locale, {
              weekday: "short"
            }),
            width: "50px",
            textAlign: "Right"
          });
          weekday.addStyleClass("xsmall bright bold");
          forecast.addContent(weekday);
          var weatherType = that.weatherIcons[list[i].weather[0].icon];
          var weatherIcon = new Label({
            width: "60px",
            textAlign: "Right"
          }).addStyleClass("small bright bold wi weathericon " + weatherType);
          forecast.addContent(weatherIcon);
          var temp_max = new Label({
            text: parseFloat(list[i].main.temp_max).toFixed(0),
            width: "50px",
            textAlign: "Right"
          });
          temp_max.addStyleClass("xsmall bright bold max-temp");
          forecast.addContent(temp_max);
          var temp_min = new Label({
            text: parseFloat(list[i].main.temp_min).toFixed(0),
            width: "50px",
            textAlign: "Right"
          });
          temp_min.addStyleClass("xsmall bright bold min-temp");
          forecast.addContent(temp_min);
          that.forecastlist.addItem(forecast);
        }

      }
    },

    setSecondSettingPosition: function() {
      var winheight = $(window).height();
      var position = winheight * .61;
      var weatherheight = 457;
      var gc = document.getElementsByClassName('greeting-container');
      gc[0].style.marginTop = (position - weatherheight) + "px";
    },


    /********* Begin - Greeting Loop Feed *******/

    setGreeting: function() {
      var that = this;
      this.greetingItem = 0;
      that.runGreetingFeed(that.config.greetings[that.greetingItem]);
      var greetimer = setInterval(function() {
        that.oldGreetFade();
      }, this.config.greetingUpdateInterval);

    },

    oldGreetFade: function() {
      var that = this;

      var fs = that.config.fadeSpeed / 2;
      var $gt = that.byId("greeting").$();

      $gt.animate({
        opacity: 0
      }, fs, function() {
        that.runGreetingFeed(that.config.greetings[that.greetingItem]);
      });
    },

    runGreetingFeed: function(greet) {
      var that = this;

      var fs = that.config.fadeSpeed;
      var $gt = that.byId("greeting").$();
      var txtMessage = this.getView().byId("greeting");
      txtMessage.setText(greet);

      $gt.animate({
        opacity: 1.0
      }, fs);

      that.greetingItem++;
      if (that.greetingItem >= that.config.greetings.length) {
        that.greetingItem = 0;
      }

    },

    /********* End - Greeting Loop Feed *******/

    /********* Begin - News Feed *******/

    getNewsFeed: function() {
      var that = this;
      moment.locale(this.config.language);

      if (that.newsbusy.hasStyleClass("busy_hide")) {
        that.newsbusy.removeStyleClass("busy_hide");
      }

      this.newsItems = [];
      this.newsTitle = "";
      this.loaded = false;
      this.activeItem = 0;
      var newscontainer = this.getView().byId("newsfeed_container");

      var newsfeeds = this.config.newsfeeds;

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var data = JSON.parse(xhr.responseText);
          if (data.status == 'ok') {
            that.newsTitle = data.feed.title;
            that.newsItems = data.items;

            that.newsItems.sort(function(a, b) {
              var dateA = new Date(a.pubDate);
              var dateB = new Date(b.pubDate);
              return dateB - dateA;
            });

            that.newsbusy.addStyleClass('busy_hide');
            that.startNewsFeed();
          }
        }
      };
      xhr.open('GET', 'https://api.rss2json.com/v1/api.json?rss_url=' + newsfeeds[0], true);
      xhr.send();

    },

    startNewsFeed: function() {
      var that = this;
      that.runNewsFeed(that.newsTitle, that.newsItems[that.activeItem]);
      var timer = setInterval(function() {
        that.oldNewsFade();
      }, this.config.newsUpdateInterval);

    },

    oldNewsFade: function() {
      var that = this;

      var as = that.config.animationSpeed / 2;
      var $nt = that.byId(that.newstitle.getId()).$();
      var $nd = this.byId(that.newsdescription.getId()).$();

      $nt.animate({
        opacity: 0
      }, as);
      $nd.animate({
        opacity: 0
      }, as, function() {
        that.runNewsFeed(that.newsTitle, that.newsItems[that.activeItem]);
      });
    },

    runNewsFeed: function(title, item) {
      var that = this;

      var as = that.config.animationSpeed;
      var $nt = that.byId(that.newstitle.getId()).$();
      var $nd = this.byId(that.newsdescription.getId()).$();

      that.newstitle.setText(title + ", " + moment(new Date(item.pubDate)).fromNow() + ":");
      that.newsdescription.setText(item.title);

      $nt.animate({
        opacity: 1.0
      }, as);
      $nd.animate({
        opacity: 1.0
      }, as);

      that.activeItem++;
      if (that.activeItem >= that.newsItems.length) {
        that.activeItem = 0;
      }

    },

    /********* End - News Feed *******/

    /********* Begin - NHL Feed ******/


    getNHLFeed: function() {
      var that = this;

      //initialize nhl table to be hidden
      var $nhlt = that.byId("nhlScores").$();
      $nhlt.animate({
        opacity: 0
      }, 0);

      that.nhldata = [];

      $.ajax({
        url: this.config.nhl_url + '?callback=?',
        type: "GET",
        dataType: "jsonp",
        jsonpCallback: "loadScoreboard"
      });

      window.loadScoreboard = function(data) {
        that.scores = [];
        for (var i = data.games.length - 1; i >= 0; i -= 1) {
          if (data.games[i].tsc !== 'final' || i === data.games.length - 1) {
            var id = data.games[i].id.toString();
            that.gamedetails = {
              y: id.slice(0, 4),
              t: id.slice(4, 6)
            };
          }
          that.scores.unshift(data.games[i]);
        }
        that.setNHLMode();
      }


    },

    setNHLMode: function() {
      var allEnded = true;
      var next = null;
      var now = Date.now();
      var inGame = 'progress';
      var ended = 'final';
      for (var i = 0; i < this.scores.length; i += 1) {
        var temp = this.scores[i];
        if (this.scores[i].bsc === '') {
          var time = temp.bs.split(' ')[0].split(':');
          var mom = moment().tz('America/Los_Angeles');
          if (temp.ts !== 'TODAY') {
            var date = temp.ts.split(' ')[1].split('/');
            mom.set('month', date[0]);
            mom.set('date', date[1]);
            mom.subtract(1, 'month');
          }
          mom.set('hour', time[0]);
          mom.set('minute', time[1]);
          mom.set('second', 0);
          if (temp.bs.slice(-2) === 'PM') {
            mom.add(12, 'hours');
          }
          this.scores[i].starttime = mom;
          allEnded = false;
          if (next === null) {
            next = this.scores[i];
          }
        } else if ((inGame === this.scores[i].bsc || Date.parse(this.scores[i].starttime) > now) &&
          this.live.matches.indexOf(this.scores[i].id) === -1) {
          allEnded = false;
          this.live.matches.push(this.scores[i].id);
          this.live.state = true;
        } else if (ended === this.scores[i].bsc && this.live.matches.includes(this.scores[i].id)) {
          this.live.matches.splice(this.live.matches.indexOf(this.scores[i].id), 1);
          if (this.live.matches.length === 0) {
            this.live.state = false;
          }
        }
      }
      if (allEnded === true) {
        this.nextMatch = null;
      }

      if ((next !== null && this.nextMatch === null && allEnded === false) || this.live.state === true) {
        this.nextMatch = {
          id: next.id,
          time: next.starttime
        };
      }


      this.getView().getModel().getData().nhlheader = "NHL " + this.nhlmodes[this.gamedetails.t] + " " + this.gamedetails.y;
      this.getView().getModel().refresh();
      this.startNhlFeed();
    },

    startNhlFeed: function() {
      var that = this;
      var nhlmax = Math.min(that.rotateIndex + that.config.matches, that.scores.length);
      for (var i = that.rotateIndex; i < nhlmax; i += 1) {
        that.appendNHLRow(that.scores[i]);
      }
      var as = that.config.animationSpeed;
      var $nhlt = that.byId("nhlScores").$();

      $nhlt.animate({
        opacity: 1.0
      }, as);


      var nhltimer = setInterval(function() {
        if (that.rotateIndex + that.config.matches >= that.scores.length) {
              that.rotateIndex = 0;
          } else {
              that.rotateIndex = that.rotateIndex + that.config.matches;
          }
        that.oldNHLFade();
      }, that.config.nhlrotateInterval);

    },

    oldNHLFade: function() {
      var that = this;

      var as = that.config.animationSpeed / 2;
      var $nhlt = that.byId("nhlScores").$();


      $nhlt.animate({
        opacity: 0
      }, as, function() {
        that.nhldata = [];
        var nhlmax = Math.min(that.rotateIndex + that.config.matches, that.scores.length);
        for (var i = that.rotateIndex; i < nhlmax; i += 1) {
          that.appendNHLRow(that.scores[i]);
        }

        var as = that.config.animationSpeed;
        var $nhlt = that.byId("nhlScores").$();

        $nhlt.animate({
          opacity: 1.0
        }, as);
      });
    },

    appendNHLRow: function(data) {
      var that = this;
      var rBundle = this.getView().getModel("i18n").getResourceBundle();

      var nhlrow = {
        "gamedate": "",
        "over": false,
        "third": "",
        "time": "",
        "icon_color": false,
        "hometeam": "",
        "homeicon": "",
        "homescore": "",
        "awayteam": "",
        "awayicon": "",
        "awayscore": ""
      };

      if (data.bsc === 'progress') {
        if (data.ts === 'PRE GAME') {
          nhlrow.gamedate = rBundle.getText("PRE_GAME");
          nhlrow.over = true;
        } else if (['1st', '2nd', '3rd'].includes(data.ts.slice(-3))) {
          nhlrow.over = false;
          nhlrow.third = rBundle.getText(that.states[data.ts.slice(-3)]);
          if (data.ts.slice(0, 3) !== 'END') {
            nhlrow.time = data.ts.slice(0, -4) + " " + rBundle.getText('TIME_LEFT');
          }
        }
      } else if (data.bsc === '' && Object.prototype.hasOwnProperty.call(data, 'starttime')) {
        nhlrow.gamedate = moment(data.starttime).format(this.config.nhl_timeformat);
        nhlrow.over = false;
      } else if (data.bsc === 'final') {
        nhlrow.over = true;
        nhlrow.gamedate = rBundle.getText(this.states[data.bs]);
        nhlrow.over = true;
      } else {
        nhlrow.gamedate = rBundle.getText('UNKNOWN');
        nhlrow.over = true;
      }

      if (!this.config.nhl_icon_colored) {
        nhlrow.icon_color = false;
      } else {
        nhlrow.icon_color = true;
      }

      nhlrow.hometeam = this.teams[data.htv];
      nhlrow.homeicon = 'digital_fog/icons/' + this.teams[data.htv] + ".png";
      nhlrow.homescore = data.hts === '' ? 0 : data.hts;

      nhlrow.awayscore = data.ats === '' ? 0 : data.ats;
      nhlrow.awayicon = 'digital_fog/icons/' + this.teams[data.atv] + ".png";
      nhlrow.awayteam = this.teams[data.atv];

      that.nhldata.push(nhlrow);
      that.getView().getModel().getData().scores = that.nhldata;
      that.getView().getModel().refresh();

    },

    nhlVisFormatter: function(value) {
      if (value) {
        return true;
      } else {
        return false;
      }
    },


    /********* End - NHL Feed ******/


    getDegree: function() {
      var degrees = "";
      switch (this.config.unit) {
        case "metric":
          degrees = "C";
          break;
        case "imperial":
          degrees = "F";
          break;
        case "default":
          degrees = "K";
          break;
      }
      return degrees;
    },


    getParams: function(latlng) {
      var params = "?";
      if (this.config.location) {
        params += "q=" + this.config.location;
      } else if (latlng.length === 2) {
        params += "lat=" + latlng[0] + "&lon=" + latlng[1]
      }
      params += "&APPID=" + this.config.openweather_appid + "&units=" + this.config.unit;
      return params;
    },


    getRouter: function() {
      return sap.ui.core.UIComponent.getRouterFor(this);
    }

  });

});
