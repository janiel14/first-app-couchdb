angular.module('first-app-couchdb').controller('marketController', function($scope, Diapers) {
    $scope.diapers = [];
    $scope.filterField = '';
    $scope.sizeSelected = null;
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
            console.log(response);
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
        setTimeout(() => {
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