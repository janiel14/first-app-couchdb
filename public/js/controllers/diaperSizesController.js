angular.module('first-app-couchdb').controller('diaperSizesController', function($scope, $timeout, $routeParams, Diapers) {
    $scope.diaper = {
        model: null,
        description: null,
        sizes: []
    };
    $scope.size = {
        description: null,
        stock: 0
    };
    $scope.filterField = '';
    $scope.disableModel = false;
    $scope.showAlertError =  {
        show: false,
        message: null
    };
    $scope.showLoading = false;

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
     * getDiaper
     */
    function getDiaper() {
        try {
            $scope.showLoading = true;
            var ds = Diapers.get();
            if ($routeParams.model == 0) {
                $scope.showLoading = false;
            } else {
                ds.get({model: $routeParams.model},function(response) {
                    $scope.showLoading = false;
                    if (response.data) {
                        $scope.diaper = response.data;
                        $scope.disableModel = true;
                    } 
                }, function(error) {
                    $scope.showLoading = false;
                    console.error('diaperSizesControllers - getDiaper: ', error);
                    showError('Fatal error on get diaper...');
                });
            }
        } catch (error) {
            console.error('diaperSizesControllers - getDiaper: ', error);
            showError('Fatal error on get diaper...');
        }
    }

    /**
     * selectSize
     */
    $scope.selectSize = function(size) {
        $scope.size = size;
    }

    /**
     * closeDelete
     */
    $scope.closeDelete = function() {
        $scope.size = {
            description: null,
            stock: 0
        };
    }

    /**
     * deleteSize 
     */
    $scope.deleteSize = function() {
        try {
            $scope.showLoading = true;
            var ds = Diapers.save();
            var newList = [];
            $scope.diaper.sizes.forEach(function(item) {
                if (item.description != $scope.size.description) {
                    newList.push(item);
                }
            });
            $scope.diaper.sizes = newList;
            ds.save({
                model: $scope.diaper.model,
                description: $scope.diaper.description,
                sizes: JSON.stringify($scope.diaper.sizes)
            },function(response) {
                $scope.showLoading = false;
                $scope.closeDelete();
                $scope.init();
            }, function(error) {
                $scope.showLoading = false;
                console.error('diaperNewSizeController - deleteSize: ', error);
                showError('Fatal error on delete size...');
            });
        } catch (error) {
            console.error('diaperSizesControllers - getDiaper: ', error);
            showError('Fatal error on get diaper...');
        }
    }

    /**
     * init
     */
    $scope.init = function() {
        getDiaper();
    }

    $scope.init();
});