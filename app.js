var express = require('express')
  , app = express()
  , fs = require('fs')
  , path = require('path')
  , jade = require('jade');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});

var navigation = [
  { url: "/", uri: "home", title: "Home" },
  { url: "/programming", uri: "programming", title: "Programming" },
  { url: "/technology", uri: "technology", title: "Technology" },
  { url: "/gaming", uri: "gaming", title: "Gaming" },
  { url: "/ultimate", uri: "ultimate", title: "Ultimate" },
  { url: "/*", uri: "404", title: "404" }
];

var render = function(req, res, index) {
  res.render(
    navigation[index].uri,
    {title: navigation[index].title}
  );
};

app.get(navigation[0].url, function(req, res){ render(req, res, 0); });

app.get(navigation[1].url, function(req, res){ render(req, res, 1); });

app.get(navigation[2].url, function(req, res){ render(req, res, 2); });

app.get(navigation[3].url, function(req, res){ render(req, res, 3); });

app.get(navigation[4].url, function(req, res){ render(req, res, 4); });

app.get(navigation[5].url, function(req, res){ render(req, res, 5); });

app.listen(3000);
