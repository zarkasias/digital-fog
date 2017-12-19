/*******************************************************************************
 * Copyright (c) 2017 SAP SE or an affiliate company. All rights reserved.
 ******************************************************************************/

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
