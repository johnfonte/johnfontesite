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
  app.use(express.favicon( __dirname + '/favicon.ico'));
});

var navigation = [
  { url: "/", uri: "professional", title: "John Fonte" },
  { url: "/hobbies", uri: "hobbies", title: "John Fonte | Hobbies" },
  { url: "/*", uri: "404", title: "404" }
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

app.get(navigation[1].url, function(req, res){ render(req, res, 1); });

app.get(navigation[2].url, function(req, res){ render(req, res, 2); });

app.listen(3000);
