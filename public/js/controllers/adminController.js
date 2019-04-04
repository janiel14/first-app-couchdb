angular.module('first-app-couchdb').controller('adminController', function($scope, $timeout, Diapers) {
    $scope.diapers = [];
    $scope.filterField = '';
    $scope.showAlertError =  {
        show: false,
        message: null
    };
    $scope.showLoading = false;

    /**
     * getAllDiapers
     */
    function getAllDiapers() {
        $scope.showLoading = true;
        var ds = Diapers.getAll();
        ds.get(function(response) {
            $scope.showLoading = false;
            if (response.data.rows.length > 0) {
                response.data.rows.forEach(function (element) {
                    $scope.diapers.push(element.colletion);
                });
            } else {
               showError('No have diapers to sold'); 
            }
        }, function(error) {
            $scope.showLoading = false;
            console.error('getAllDiapers: ', error);
            showError('Failed on load items from the server...!');
        });
    }

    /**
     * showError
     * @param {String} message 
     */
    function showError(message) {
        $scope.showAlertError.message = message;
        $scope.showAlertError.show = true;
        $timeout(function() {
            $scope.showAlertError =  {
                show: false,
                message: null
            };
        }, 3000);
    }

    /**
     * init
     */
    $scope.init = function() {
        getAllDiapers();
    }

    $scope.init();
});