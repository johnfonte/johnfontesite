var express = require('express')
  , app = express()
  , fs = require('fs')
  , nowww = require('nowww')
  , path = require('path')
  , jade = require('jade');

app.configure(function(){
  app.set('port', process.env.PORT || 3000)
  .set('views', __dirname + '/views')
  .set('view engine', 'jade')
  .use(nowww())
  .use(express.json())
  .use(express.urlencoded())
  .use(express.methodOverride())
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.favicon( __dirname + '/favicon.ico'));
});

var navigation = [
  { url: "/*", uri: "home", title: "John Fonte" }
];

var templates = [];

var getTemplate = function (filename) {
  var template = fs.readFileSync(__dirname + '/views/' + filename + '.jade', 'utf8');
  return jade.compile(template, {filename: __dirname + '/views/' + filename + '.jade', pretty: true});
};

for(var i=0; i<navigation.length; i++) {
  templates[i] = getTemplate(navigation[i].uri);
}

var render = function(req, res, index) {
  res.send(templates[index]({title: navigation[index].title}));
};

app.get(navigation[0].url, function(req, res){ render(req, res, 0); });

// app.get(navigation[1].url, function(req, res){ render(req, res, 1); });

app.listen(3000);
