angular.module('first-app-couchdb', ['ngRoute','ngResource']).config(function($routeProvider) {

    //routes
    $routeProvider.when('/market', {
        templateUrl: 'views/market.html',
        controller: 'marketController'
    })
    $routeProvider.when('/admin', {
        templateUrl: 'views/administration.html',
        controller: 'adminController'
    });
    $routeProvider.when('/admin/diaper/:model', {
        templateUrl: 'views/newdiaper.html',
        controller: 'diaperController'
    });
    $routeProvider.otherwise({redirectTo: '/market'});
});