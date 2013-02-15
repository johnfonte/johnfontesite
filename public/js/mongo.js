



function loadTitles() {

define(
    //The name of this module
    "public/js/mongodb/index",

    //The array of dependencies
    ["public/js/mongodb/index"],

    //The function to execute when all dependencies have loaded. The
    //arguments to this function are the array of dependencies mentioned
    //above.
    function (mongodb) {
        //return the mongo constructor function so it can be used by
        //other modules.
        return mongodb;
    }
);

//var _und = require("underscore");

var mongo = {
"hostname":"linus.mongohq.com",
"port":10051,
"username":"root",
"password":"H4sh3d",
"name":"",
"db":"mongoService2"
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

var mongoClient = require('mongodb').MongoClient;


mongoClient.connect(mongourl, function(err, conn) {
	if(err) { return console.dir(err); }
	else { console.log("excellent");
		conn.collection('sidebarLinks', function(err, coll) {
			coll.find({}, {limit:10}, function(err, cursor) {
				cursor.toArray(function(err, items) {
                    for(i=0; i<items.length;i++){
						$('#sidebar').innerHTML = $('#sidebar').innerHTML + __dirname + '/pages/' + items[i].link + '\n';
					}
				});
			});
		});
	}
});


}