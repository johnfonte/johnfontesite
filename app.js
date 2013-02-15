#!/bin/env node
// JohnFonte.com
// John Fonte

var express = require('express');
var fs      = require('fs');

var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//---------------BEGIN SCHEMAS-------------------------------
var pagesSchema = new Schema({
    name: String,
    link: String
});

var Pages = mongoose.model('Pages', pagesSchema);

var kittySchema = new Schema({
    name: String,
    timestamp: { type: Date, default: Date.now }
});


kittySchema.methods.speak = function () {
  var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
  console.log(greeting);
}

var Kitten = mongoose.model('Kitten', kittySchema);

//----------------END SCHEMAS---------------------------------

//-----------------BEGIN MONGODB VARS------------------------

var mongo = {
"hostname":"linus.mongohq.com",
"port":10041,
"username":"root",
"password":"H4sh3d",
"name":"",
"db":"johnFonteDB"
};

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
    else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
};
var mongourl = generate_mongo_url(mongo);

//----------------END MONGODB VARS---------------------------------

/**
 *  Define the application.
 */
var JohnFonteDotCom = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.VCAP_APP_HOST || '127.0.0.1';
        self.port      = process.env.VCAP_APP_PORT || 3000;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No internal IP, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.cache === "undefined") {
            self.cache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.cache['index.html'] = fs.readFileSync('./pages/index.html');
    };

    self.getLinks = function() {
    	console.log("getLinks");

        self.links = { };
        mongoose.connect(mongourl);
        console.log(mongourl);

        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function callback () {
        	console.log("go");
            // console.log(Pages);
            Pages.find({}, function(err, data) {
            	console.log(data);
                if(data.length > 0) {
                    for(var page in data) {
                        // console.log(page);
                        // console.log(data[page]);
                        self.links[data[page].name] = fs.readFileSync('./pages/'+data[page].link);
                        // console.log(data[page].name + " " + data[page].link);
                    }
                }
                console.log("disconnect");
                console.log(self.links);
                mongoose.disconnect();
            });
        });
        console.log(self.links);
    };

    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.cache[key]; };

    self.link_get = function(key) { return self.links[key]; };

    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/contact.html'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.link_get('Contact Me') );
        };

        self.routes['/resume.html'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.link_get('Resume') );
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };

        self.routes['/js*'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(fs.readFileSync("./public/" + req.url) );
        };

        self.routes['/css*'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(fs.readFileSync("./public/" + req.url) );
        };

    }; 


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.getLinks();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */

/**
 *  main():  Main code.
 */
var app = new JohnFonteDotCom();
app.initialize();
app.start();

