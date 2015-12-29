// Ionic Starter aun, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('aun', ['ionic','ngCordova','ionic.contrib.ui.cards','RequestModule','chieffancypants.loadingBar', 'ngAnimate','LocalStorageModule','oc.lazyLoad','aun.controllers','aun.services'])

/*.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})*/


  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
  })


	.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
		$ocLazyLoadProvider.config({
			asyncLoader: $script
		});
	}])


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('aun', {
      url: "/aun",
      abstract: true,
      templateUrl: "templates/menu.html"
    })

    .state('aun.dashboard', {
      url: "/",
      views: {
        'menuContent' :{
          templateUrl: "templates/dashboard.html",
          controller: 'AunCtrl',
          service: 'DBService'
        }
      }
    })

    .state('aun.news', {
      url: "/news",
      views: {
        'menuContent' :{
          templateUrl: "templates/news.html",
          controller: 'NewsCtrl',
          service: 'NewsService'
        }
      }
    })

    .state('aun.newsItem', {
      url: "/news/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/newsItem.html",
          controller: 'NewsItemCtrl',
          service: 'NewsService'
        }
      }
    })

    .state('aun.events', {
      url: "/events",
      views: {
        'menuContent' :{
          templateUrl: "templates/events.html",
          controller: 'EventsCtrl',
          service: 'EventsService'
        }
      }
    })

    .state('aun.eventItem', {
      url: "/event/:id",
      views: {
        'menuContent' :{
          templateUrl: "templates/eventItem.html",
          controller: 'EventItemCtrl',
          service: 'EventsService'
        }
      }
    })

    .state('aun.contacts', {
      url: "/contacts",
      views: {
        'menuContent' :{
          templateUrl: "templates/contacts.html",
          controller: 'ContactsCtrl',
          service: 'ContactsService'
        }
      }
    })

   .state('aun.parents', {
      url: "/parents",
      views: {
        'menuContent' :{
          templateUrl: "templates/parents.html"
        }
      }
    })

   .state('aun.tuition', {
      url: "/tuition",
      views: {
        'menuContent' :{
          templateUrl: "templates/tuition.html"
        }
      }
    })

    .state('aun.security', {
      url: "/security",
      views: {
        'menuContent' :{
          templateUrl: "templates/security.html"
        }
      }
    })

    .state('aun.map', {
      url: "/map",
      views: {
        'menuContent' :{
          templateUrl: "templates/map.html",
          controller: "MapCtrl",
			resolve: {
				test: ['$ocLazyLoad', function($ocLazyLoad) {
					return $ocLazyLoad.load({
						name: 'ngMap',
						files: ['https://maps.googleapis.com/maps/api/js?v=3.exp&' +'callback=initialize',
						        'lib/js/map_libs/namespace.js',
						        'lib/js/map_libs/directives/map_controller.js',
						        'lib/js/map_libs/directives/map.js',
						        'lib/js/map_libs/directives/marker.js',
						        'lib/js/map_libs/directives/shape.js',
						        'lib/js/map_libs/services/geo_coder.js',
						        'lib/js/map_libs/services/navigator_geolocation.js',
						        'lib/js/map_libs/services/attr2_options.js',
						        'lib/js/ngMapMoudle.js']
					});
				}]
			}
        }
      }
    })

    .state('aun.library', {
      url: "/library",
      views: {
        'menuContent' :{
          templateUrl: "templates/library.html"
        }
      }
    })

    .state('aun.info', {
      url: "/info",
      views: {
        'menuContent' :{
          templateUrl: "templates/info.html"
        }
      }
    })

    .state('aun.places', {
      url: "/places",
      views: {
        'menuContent' :{
          templateUrl: "templates/places.html",
          controller:'CardsCtrl',
          service:'PlacesService'
        }
      }
    })

    .state('aun.emergency', {
      url: "/emergency",
      views: {
        'menuContent' :{
          templateUrl: "templates/emergency.html"
        }
      }
    })


    .state('aun.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider

  .otherwise('/aun/');

});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    //Initialize anything you need to. aka: Google analytics.
	console.log("INSIDE DEVICE READY");
    //Set other evens you need to listen to.
    document.addEventListener("online", onOnline, false);
    document.addEventListener("offline", onOffline, false);
 }

function onOffline(){
	$('#offline').show();
}

function onOnline(){
	$('#offline').hide();
}

