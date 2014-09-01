var MDatabase = require("./MDatabase");


var database = new MDatabase('localhost', '27017', 'users');

database.connect().then(function(dbHandle) {

//    database.getCollection("users").then(function(collection) {
//        collection.find({'username': new RegExp('r_99')}).toArray(function(err, item) {
//            console.log("Found:", item);
//        });
//    });

//    database.find("users", {username: "user_1"}).then(function(list) {
    database.find("users", null,0,2,{username:-1}).then(function(list) {
        console.log("List:",list);
    },function(err){
        console.log("Error",err);
    });

});
