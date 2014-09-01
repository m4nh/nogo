var Mongo = require('mongodb');
var Server = Mongo.Server;
var Db = Mongo.Db;
var BSON = Mongo.BSONPure;
var Q = require("q");

module.exports = function(host, port, dbName) {
    var self = this;

    self.server = new Server(host, port, {safe: false, auto_reconnect: true});
    self.db = new Db(dbName, self.server);
    self.handle = null;

    var patternObjRefine = function(patternObj) {
        var newPattern = {};
        for (var k in patternObj) {
            if (k == "id") {
                newPattern["_id"] = new BSON.ObjectID(patternObj.id);
            } else {
                newPattern[k] = patternObj[k];
            }
        }
        return newPattern;
    };

    self.connect = function() {
        var q = Q.defer();
        self.db.open(function(err, handle) {
            if (!err) {
                self.handle = handle;
                q.resolve(handle);
            } else {
                q.reject(null);
            }
        });
        return q.promise;
    };


    self.getCollection = function(collectionName) {
        var q = Q.defer();
        if (self.handle != null) {
            self.handle.collection(collectionName, {strict: false}, function(err, collection) {
                if (err) {
                    q.reject(err);
                } else {
                    q.resolve(collection);
                }
            });
        }
        return q.promise;
    };


    self.findOne = function(collectionName, patternObj) {
        var q = Q.defer();
        self.getCollection(collectionName).then(function(collection) {
            collection.findOne(patternObjRefine(patternObj), function(err, item) {
                if (err) {
                    q.reject(err);
                } else {
                    q.resolve(item);
                }
            });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    };

    self.find = function(collectionName, patternObj, page, size, sort) {
        var q = Q.defer();
        if(sort instanceof String){
            sort = {sort:1};
        }
        self.getCollection(collectionName).then(function(collection) {
            collection.find(patternObjRefine(patternObj))
                    .skip(page*size)
                    .limit(size)
                    .sort(sort)
                    .toArray(function(err, list) {
                        if (err) {
                            q.reject(err);
                        } else {
                            q.resolve(list);
                        }
                    });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    };

    return self;
};