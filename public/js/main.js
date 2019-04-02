angular.module('first-app-couchdb', ['ngRoute']).config(function($routeProvider) {

    //routes
    $routeProvider.when('/market', {
        templateUrl: 'views/market.html',
        controller: 'marketController'
    })
    $routeProvider.when('/admin', {
        templateUrl: 'views/administration.html',
        controller: 'adminController'
    });
    $routeProvider.otherwise({redirectTo: '/market'});
});