angular.module('first-app-couchdb').controller('marketController', function($scope, $timeout, Diapers, Sales) {
    $scope.diapers = [];
    $scope.filterField = '';
    $scope.sizeSelected = null;
    $scope.timeToEnd = '';
    $scope.showAlertError =  {
        show: false,
        message: null
    };
    $scope.showLoading = false;
    $scope.selecteToBuy = {
        model: null,
        size: null,
        qtd: 0
    };

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
                    element.qtd = 0;
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
     * processTime
     * @param {Number} time 
     * @return {String} time
     */
    function processTime(time) {
        var data = parseInt(time);
        var s = (data/1000).toFixed(0);
        if (s <= 60) {
            return s + " seconds";
        } else if (s > 60) {
            var m = (s/60).toFixed(0);
            if (m <= 60) {
                return m + ' minutes';
            } else if (m > 60) {
                var h = (m/60).toFixed(0);
                if (h <= 24) {
                    return h + ' hours';
                } else if (h > 24) {
                    var d = (h/24).toFixed(0);
                    return d + ' days';
                }
            }
        }
    }

    /**
     * selectSize
     * @param {Object} diaper
     * @param {Object} size
     */
    $scope.selectSize = function(diaper, size) {
        try {
            $scope.selecteToBuy.model = diaper.model;
            $scope.selecteToBuy.size = size.description;
            $scope.selecteToBuy.qtd = diaper.qtd;
            var ds = Sales.getTimeToEnd();
            ds.get({
                model: diaper.model,
                size: size.description
            }, function(response) {
                diaper.message = "In stock: " + response.data.stock;
                if (response.data.time_remaing != "NaN" && response.data.time_remaing != 0) {
                    var time = processTime(response.data.time_remaing);
                    diaper.message = diaper.message + " This product stock out in " + time;
                }
            }, function(error) {
                console.error('marketController - selectSize: ', error);
                showError('Fatal error on select size...');
            });
        } catch (error) {
            console.error('marketController - selectSize: ', error);
            showError('Fatal error on select size...');
        }
    }

    /**
     * buy
     */
    $scope.buy = function() {
        try {
            var ds = Sales.save();
            ds.save({
                model: $scope.selecteToBuy.model,
                size: $scope.selecteToBuy.size,
                qtd: $scope.selecteToBuy.qtd
            }, function(response) {
                $scope.init();
            }, function(error) {
                console.error('marketController - buy: ', error);
                showError('Fatal error on select size...');
            });
        } catch (error) {
            console.error('marketController - buy: ', error);
            showError('Fatal error on select size...');
        }
    }

    /**
     * init
     */
    $scope.init = function() {
        $scope.diapers = [];
        $scope.filterField = '';
        $scope.sizeSelected = null;
        $scope.timeToEnd = '';
        $scope.showAlertError =  {
            show: false,
            message: null
        };
        $scope.showLoading = false;
        $scope.selecteToBuy = {
            model: null,
            size: null,
            qtd: 0
        };
        getAllDiapers();
    }

    $scope.init();
});