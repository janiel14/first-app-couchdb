angular.module('first-app-couchdb').controller('diaperController', function($scope, $timeout, $location, $routeParams, Diapers) {
    $scope.diaper = {
        model: null,
        description: null
    };
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
                    console.error('diaperControllers - getDiaper: ', error);
                    showError('Fatal error on get diaper...');
                });
            }
        } catch (error) {
            console.error('diaperControllers - getDiaper: ', error);
            showError('Fatal error on get diaper...');
        }
    }

    /**
     * checkExists
     * @param {String} model
     */
    $scope.checkExists = function(model) {
        try {
            var ds = Diapers.get();
            ds.get({model: model},function(response) {
                if (response.data) {
                    showError('Model name exists!!! Try other');
                    $scope.diaper = {
                        model: null,
                        description: null
                    };
                } 
            }, function(error) {
                console.error('diaperControllers - checkExists: ', error);
                showError('Fatal error on get diaper...');
            });
        } catch (error) {
            showError('Fatal error on check name of model!!!');
        }
    }

    /**
     * formSubmit
     */
    $scope.formSubmit = function() {
        try {
            if ($scope.diaper.model == null || $scope.diaper.model == 0) {
                showError('Inform name of model!');
            } else if ($scope.diaper.description == null || $scope.diaper.description.length == 0) {
                showError('Inform description of model!');
            } else {
                $scope.showLoading = true;
                var ds = Diapers.save();
                ds.save({
                    model: $scope.diaper.model,
                    description: $scope.diaper.description,
                    sizes: JSON.stringify([])
                },function(response) {
                    $scope.showLoading = false;
                    $location.path("admin");
                }, function(error) {
                    $scope.showLoading = false;
                    console.error('diaperControllers - formSubmit: ', error);
                    showError('Fatal error on save diaper...');
                });
            }
        } catch (error) {
            console.error('diaperControllers - formSubmit: ', error);
            showError('Fatal error on save diaper!!!');
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