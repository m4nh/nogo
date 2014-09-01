var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 

var start = process.hrtime();

var elapsed_time = function(note){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note); // print message + time
    start = process.hrtime(); // reset the timer
}

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('users', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'users' database");
        db.collection('users', {strict:false}, function(err, collection) {
            if (err) {
                console.log(err);

            }
var c = 0;

if(c==0){
	for(var i = 0; i < 1000; i++){
	    var user = {
		username:"user_"+i,
		password:"password_"+i		
	    };
	    collection.insert(user, {safe:true}, function(err, result) {});
	}
	console.log("Insert done!");

}
if(c==1){
    
    db.collection('users', function(err, collection) {
        elapsed_time("Fetch");
        collection.findOne({'username': 'user_88888'}, function(err, item) {
        elapsed_time("Fetch end");
            console.log("Found:",item);
        });
    });
}

if(c==2){
collection.find().toArray(function(err, items) {
		console.log(items);
return;
            var user = items[1];
		var add = {prova:"prova"};
		collection.update({'_id':new BSON.ObjectID(user._id)}, add, {safe:true}, function(err, result) {
		    if (err) {
		        console.log('Error updating wine: ' + err);

		    } else {
		        console.log('' + result + ' document(s) updated');

		    }
		});
        });
}
        });

	
    }
});
