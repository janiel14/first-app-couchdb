angular.module('first-app-couchdb').controller('diaperNewSizesController', function($scope, $timeout, $location, $routeParams, Diapers) {
    $scope.diaper = {
        model: null,
        description: null,
        sizes: []
    };
    $scope.size = {
        description: null,
        stock: 0
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
                        $scope.size = $scope.diaper.sizes.find(function(item) {
                            return $routeParams.description === item.description;
                        });
                        if ($scope.size) {
                            var newList = [];
                            $scope.diaper.sizes.forEach(function(item) {
                                if (item.description != $routeParams.description) {
                                    newList.push(item);
                                }
                            });
                            $scope.diaper.sizes = newList;
                            $scope.disableModel = true;
                        } else {
                            $scope.size = {
                                description: null,
                                stock: 0
                            };   
                        }
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
     * @param {String} description
     */
    $scope.checkExists = function(description) {
        try {
            var finded = $scope.diaper.sizes.find(function(item) {
                return description === item.description;
            });
            if (finded) {
                showError('Size name exists!!! Try other');
                $scope.size = {
                    description: null,
                    stock: 0
                };
            }
        } catch (error) {
            showError('Fatal error on check name of model!!!');
        }
    }

    /**
     * formSubmit
     */
    $scope.formSubmit = function() {
        try {
            if ($scope.size.description == null || $scope.size.description.length == 0) {
                showError('Inform description of size!');
            } else {
                $scope.showLoading = true;
                var ds = Diapers.save();
                $scope.diaper.sizes.push($scope.size);
                ds.save({
                    model: $scope.diaper.model,
                    description: $scope.diaper.description,
                    sizes: JSON.stringify($scope.diaper.sizes)
                },function(response) {
                    $scope.showLoading = false;
                    $location.path("admin/diaper/sizes/" + $scope.diaper.model);
                }, function(error) {
                    $scope.showLoading = false;
                    console.error('diaperNewSizeController - formSubmit: ', error);
                    showError('Fatal error on save diaper...');
                });
            }
        } catch (error) {
            console.error('diaperNewSizeController - formSubmit: ', error);
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