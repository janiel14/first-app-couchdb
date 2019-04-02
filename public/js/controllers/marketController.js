angular.module('first-app-couchdb').controller('marketController', function($scope) {
    $scope.diapers = [];
    $scope.filterField = '';
    $scope.sizeSelected = null;

    //sample
    $scope.diapers = [
        {
            model: 'Model A',
            description: 'Description model A',
            sizes: [
                {
                    description: 'Size model A',
                    stock: 10
                }
            ]
        },
        {
            model: 'Model B',
            description: 'Description model B',
            sizes: [
                {
                    description: 'Size model B',
                    stock: 5
                }
            ]
        },
        {
            model: 'Model C',
            description: 'Description model C',
            sizes: [
                {
                    description: 'Size model C',
                    stock: 0
                }
            ]
        }
    ];
});