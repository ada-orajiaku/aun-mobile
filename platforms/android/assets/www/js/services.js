angular.module('aun.services',[])

.service('DBService', function() {
	this.startDB = function(){
        var db = openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
        	//tx.executeSql('DROP TABLE IF EXISTS News'); tx.executeSql('DROP TABLE IF EXISTS Events'); tx.executeSql('DROP TABLE IF EXISTS Places'); tx.executeSql('DROP TABLE IF EXISTS Contacts'); tx.executeSql('DROP TABLE IF EXISTS EmergencyContacts'); tx.executeSql('DROP TABLE IF EXISTS Library');
            tx.executeSql('CREATE TABLE IF NOT EXISTS News (ID INTEGER PRIMARY KEY, itemid INTEGER UNIQUE,title,subtext,details,imageid)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Events (ID INTEGER PRIMARY KEY, itemid INTEGER UNIQUE,title,details,imageid,start_date,end_date,start_time,end_time,venue)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Places (ID INTEGER PRIMARY KEY, itemid INTEGER UNIQUE,title,details,imageid)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Contacts (ID INTEGER PRIMARY KEY, itemid INTEGER UNIQUE,title,details,imageid,email,phone)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS EmergencyContacts (ID INTEGER PRIMARY KEY, itemid INTEGER UNIQUE,title,details,imageid,email,phone)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Library (ID INTEGER PRIMARY KEY, itemid INTEGER UNIQUE,title,details,imageid)');
        });
	};

})

.service('NewsService', function ($q,$http,localStorageService) {

	this.fetch = function(startid){
		var q = $q.defer(); var n = this;
	    console.log("GETTING NEWS");
	    $http.get('http://qt.234.com.ng/aunapp/app_request.php?passcode=aunmobileapp&platform=android&school_id=1&action=get_items&type=News&start_id='+startid).success(function(response) {
	    	q.resolve(response); console.log(response); n.storeNews(response);
	    }).error(function(){
	    	q.resolve("ERROR");
	    });
	    return q.promise;
	};

    this.storeNews = function (news) {

        var db = window.openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
        	var sql = "INSERT INTO News (itemid,title,subtext,details,imageid) VALUES (?,?,?,?,?)";
   	 		for (var i=0;i < news.length; i++) {
   	 			var sub = news[i].details.substring(0, 150)+"..."
   	 			tx.executeSql(sql, [news[i].itemid,news[i].title,sub,news[i].details,news[i].imageid],function () { console.log('INSERT news success'); },function(trans,err){console.log("DBase error: "+err.message);});
   	 		}
        });
    };
     this.load =  function(){
			var q = $q.defer();  var news = [];
	    	var db = openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
	        db.transaction(function (tx) {
	        	var sql= "SELECT * FROM News order by itemid desc";
	        	tx.executeSql(sql, null, function (tx, results) {
	   	 			if(results.rows.length > 0){
	   	 				localStorageService.set('lastNewsId',results.rows.length+1);
	   	 				for ( var i=0;i < results.rows.length; i++) {
	   	 					news[i] = results.rows.item(i);
	   	 					q.resolve(news);
	   	 				}
	   	 			}else{ console.log("NO NEWS IN DATABASE"); localStorageService.set('lastNewsId',0); q.resolve(null);}
	   	 		},function(trans,err){console.log("DBase error: "+err.message); q.reject(err);});
	        });
	        return q.promise;
		};


    this.read = function (itemid) {
    	var q = $q.defer();
    	var db = window.openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
        	var sql = "SELECT * FROM News n WHERE n.itemid='"+itemid+"' LIMIT 1";
        	tx.executeSql(sql, null, function (tx, results) {
   	 			if(results.rows.length > 0){
   	 				q.resolve(results.rows.item(0));
   	 				console.log("item from database "+results.rows.item(0));
   	 			}else{ console.log("NO NEWS IN DATABASE"); }
   	 		},function(trans,err){console.log("DBase error: "+err.message); q.reject(err);});
        });
        return q.promise;
    };


})


.service('EventsService', function ($q,$http,localStorageService) {

	this.fetch = function(startid){
		var q = $q.defer(); var event = this;
	    console.log("GETTING EVENTS");
	    $http.get('http://qt.234.com.ng/aunapp/app_request.php?passcode=aunmobileapp&platform=android&school_id=1&action=get_items&type=Event&start_id='+startid)
	    .success(function(response) {
	    	q.resolve(response); console.log("events response "+angular.toJson(response)); event.store(response);
	    }).error(function(){
	    	q.resolve("ERROR");
	    });
	    return q.promise;
	};

    this.store = function (events) {
    	console.log("inside store event");
        var db = window.openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
        	var sql = "INSERT INTO Events (itemid,title,details,imageid,start_date,end_date,start_time,end_time,venue) VALUES (?,?,?,?,?,?,?,?,?)";
   	 		for (var i=0;i < events.length; i++) {
   	 		tx.executeSql(sql, [events[i].itemid,events[i].title,events[i].details,events[i].imageid,events[i].start_date,events[i].end_date,events[i].start_time,events[i].end_time,events[i].venue],function () { console.log('INSERT events success');},function(trans,err){console.log("DBase error: "+err.message); });
   	   	 	}
        });
    };
     this.load =  function(){
			var q = $q.defer();  var events = []; var e=this;
	    	var db = openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
	        db.transaction(function (tx) {
	        	var sql= "SELECT * FROM Events order by itemid desc";
	        	tx.executeSql(sql, null, function (tx, results) {
	   	 			if(results.rows.length > 0){
	   	 				localStorageService.set('lasteventsId',results.rows.length+1);
	   	 				for ( var i=0;i < results.rows.length; i++) {
	   	 					events[i] = results.rows.item(i);
	   	 					q.resolve(events);
	   	 				}
	   	 			}else{ console.log("NO Events IN DATABASE"); localStorageService.set('lastEventId',0); q.resolve(null);}
	   	 		},function(trans,err){console.log("DBase error: "+err.message); q.reject(err);});
	        });
	        return q.promise;
		};


    this.read = function (itemid) {
    	var q = $q.defer();
    	var db = window.openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
        	var sql = "SELECT * FROM Events e WHERE e.itemid='"+itemid+"' LIMIT 1";
        	tx.executeSql(sql, null, function (tx, results) {
   	 			if(results.rows.length > 0){
   	 				q.resolve(results.rows.item(0));
   	 				console.log("Event item from database "+results.rows.item(0));
   	 			}else{ console.log("NO EVENTS IN DATABASE"); }
   	 		},function(trans,err){console.log("DBase error: "+err.message); q.reject(err);});
        });
        return q.promise;
    };


})



.service('ContactsService', function ($q,$http,localStorageService) {

	this.fetch = function(){
		var q = $q.defer(); var cont = this;
	    console.log("GETTING CONTACTS");
	    $http.get('http://qt.234.com.ng/aunapp/app_request.php?passcode=aunmobileapp&platform=android&school_id=1&action=get_items&type=Contacts').success(function(response) {
	    	q.resolve(response); cont.store(response);
	    });
	    return q.promise;
	};

    this.store = function (contact) {
        var db = window.openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
        	var sql = "INSERT INTO Contacts (itemid,title,details,imageid,phone,email) VALUES (?,?,?,?,?,?)";
   	 		for (var i=0;i < contact.length; i++) {
   	 			tx.executeSql(sql, [contact[i].itemid,contact[i].title,contact[i].description,contact[i].imageid,contact[i].phone,contact[i].email],function () { console.log('INSERT CONTACTS success'); },function(trans,err){console.log("DBase error: "+err.message); });
   	   	   	 }
        });
    };
     this.load =  function(){
    	 	var cont = this;
			var q = $q.defer();  var contacts = [];
	    	var db = openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
	        db.transaction(function (tx) {
	        	var sql= "SELECT * FROM Contacts";
	        	tx.executeSql(sql, null, function (tx, results) {
	   	 			if(results.rows.length > 0){
	   	 				for ( var i=0;i < results.rows.length; i++) {
	   	 					contacts[i] = results.rows.item(i);
	   	 					q.resolve(contacts);
	   	 				}
	   	 			}else{ console.log("NO CONTACTS IN DATABASE"); q.resolve(null); }
	   	 		},function(trans,err){console.log("DBase error: "+err.message); q.reject(err);});
	        });
	        return q.promise;
		};

})


.service('PlacesService', function ($q,$http,localStorageService) {

	this.fetch = function(){
		var q = $q.defer(); var cont = this;
	    console.log("GETTING PLACES");
	    $http.get('http://qt.234.com.ng/aunapp/app_request.php?passcode=aunmobileapp&platform=android&school_id=1&action=get_items&type=Places').success(function(response) {
	    	q.resolve(response); cont.store(response);
	    });
	    return q.promise;
	};

    this.store = function (contact) {
        var db = window.openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
        db.transaction(function (tx) {
        	var sql = "INSERT INTO 	Places (itemid,title,details,imageid) VALUES (?,?,?,?)";
   	 		for (var i=0;i < contact.length; i++) {
   	 			tx.executeSql(sql, [contact[i].itemid,contact[i].title,contact[i].description2,contact[i].imageid],function () { console.log('INSERT PLACES success'); },function(trans,err){console.log("DBase error: "+err.message);});
   	   	   	 }
        });
    };
     this.load =  function(){
			var q = $q.defer();  var places = [];
	    	var db = openDatabase('AunDB', '1.0', 'AunDB', 5 * 1024 * 1024);
	        db.transaction(function (tx) {
	        	var sql= "SELECT * FROM Places";
	        	tx.executeSql(sql, null, function (tx, results) {
	   	 			if(results.rows.length > 0){
	   	 				for ( var i=0;i < results.rows.length; i++) {
	   	 					places[i] = results.rows.item(i);
	   	 					q.resolve(places);
	   	 				}
	   	 			}else{ console.log("NO PLACES IN DATABASE");  q.resolve(null); }
	   	 		},function(trans,err){console.log("DBase error: "+err.message); q.reject(err);});
	        });
	        return q.promise;
		};

})
