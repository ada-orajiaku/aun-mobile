angular.module('aun.controllers', [])

.controller('AunCtrl', function(DBService,$rootScope) {
	DBService.startDB();
	$rootScope.$viewHistory.backView = null;
})


.controller('NewsCtrl',function($scope, NewsService,localStorageService,cfpLoadingBar,$cordovaNetwork) {

	// $scope.online = $cordovaNetwork.isOnline(); $scope.offline = $cordovaNetwork.isOffline();

    $scope.news = ''; $scope.loader = false; $scope.error = false;
    NewsService.load().then(function(resp) {
    	$scope.news  = resp;
    	console.log('resp is '+resp);
    	if(resp == null){
    		cfpLoadingBar.start(); $scope.loader = true;
            NewsService.fetch(0).then(function(resp) {
            	$scope.news = resp;
            	cfpLoadingBar.complete(); $scope.loader = false;
            });
    	}
    });

    $scope.fetchNews = function(){
    	cfpLoadingBar.start(); $scope.loader = true;
        var startid = localStorageService.get('lastNewsId');
        NewsService.fetch(startid).then(function(resp) {
        	cfpLoadingBar.complete(); $scope.loader = false;
        	if(resp=="ERROR"){
        		$scope.error = true;
        	}else{
        		$scope.news = $scope.news+resp; $scope.error = false;
        	}
        });
    };

})

.controller('NewsItemCtrl', function(NewsService,$stateParams,$scope) {
	$scope.news = '';
    NewsService.read($stateParams.id).then(function(resp) {
    	$scope.news  = resp;
    });
})




.controller('EventsCtrl', function($scope, EventsService,localStorageService,cfpLoadingBar,$cordovaNetwork) {

	//$scope.offline = $cordovaNetwork.isOffline();

    $scope.events = ''; $scope.error = false;
    EventsService.load().then(function(resp) {
    	$scope.events  = resp;
    	console.log('resp is '+resp);
    	if(resp == null){
            EventsService.fetch(0).then(function(resp) {
            	$scope.events = resp;
            });
    	}
    });

    $scope.fetchEvents = function(){
    	cfpLoadingBar.start(); $scope.loader = true;
        var startid = localStorageService.get('lastEventId');
        EventsService.fetch(startid).then(function(resp) {
        	cfpLoadingBar.complete(); $scope.loader = false;
        	if(resp=="ERROR"){
        		$scope.error = true;
        	}else{
        		$scope.events = $scope.events+resp; $scope.error = false;
        	}
        });
    };
})

.controller('EventItemCtrl', function(EventsService,$stateParams,$scope) {
	$scope.event = '';
    EventsService.read($stateParams.id).then(function(resp) {
    	$scope.event  = resp;
    });
})




.controller('ContactsCtrl', function($scope, ContactsService,localStorageService) {
	//$scope.offline = $cordovaNetwork.isOffline();
	$scope.contacts  = '';
    ContactsService.load().then(function(resp) {
    	$scope.contacts  = resp;
    	if(resp == null){
            ContactsService.fetch(0).then(function(resp) {
            	$scope.contacts = resp;
            });
    	}
    });

})


.controller('MapCtrl', function($scope, $interval,$cordovaNetwork) {
	//$scope.offline = $cordovaNetwork.isOffline();

    $scope.positions =[ [9.191127, 12.499686], [9.191128, 12.499687]];

 /*   $interval(function() {
    	var numMarkers = Math.floor(Math.random() * 4) + 4; //between 4 to 8 markers
        var positions = [];
        for (i = 0; i < numMarkers; i++) {
        	var lat = 9.191127 + (Math.random() / 250);
            var lng = 12.499686 + (Math.random() / 250);
            positions.push([lat, lng]);
         }
         $scope.positions = positions;
    }, 2000);
    */
})


/*

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})*/

.controller('CardsCtrl', function($scope, $ionicSwipeCardDelegate,PlacesService, cfpLoadingBar) {
  var cardTypes = [
    { title: 'Library', image: 'img/places/1.jpg' },
    { title: 'Cafeteria', image: 'img/places/2.jpg' },
    { title: 'Laboratory', image: 'img/places/3.jpg' },
    { title: 'Hall', image: 'img/places/4.jpg' },
    { title: 'Peter Okocha Hall', image: 'img/places/5.jpg' }
  ];


  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);

  /*$scope.loader = false;
  PlacesService.load().then(function(places){
	  $scope.offline = false;
	  if(places == null){
		  cfpLoadingBar.start();  $scope.offline = $cordovaNetwork.isOffline();
          PlacesService.fetch(0).then(function(places) {
        	  cardTypes = places;
        	  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);
            	cfpLoadingBar.complete(); $scope.loader = false;
            });
	  }else{
		  cardTypes = places;
		  $scope.cards = Array.prototype.slice.call(cardTypes, 0, 0);
	  }
  });
*/


  $scope.cardSwiped = function(index) {
    $scope.addCard();
  };

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCard = function() {
    var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    newCard.id = Math.random();
    $scope.cards.push(angular.extend({}, newCard));
  };
})

.controller('CardCtrl', function($scope, $ionicSwipeCardDelegate) {
  $scope.goAway = function() {
    var card = $ionicSwipeCardDelegate.getSwipebleCard($scope);
    card.swipe();
  };
})


.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});;
