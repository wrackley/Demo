//this declares the HTML to be pushed to the user after it is dynamically created 
var pets;
//stadard declaration of the Angular JS application name, imports some needed modules in order for the code to compile correctly 
var app = angular.module('findLocalPets', ['ngSanitize', 'ngResource']);
app.config(['$sceProvider', function($sceProvider) {
    $sceProvider.enabled(false);
}]);
app.controller('findLocalPetsCtrl', function($scope, $http, $resource, $sce) {
    $scope.page = 0;
    //the GET parameters are strung together in an URL and uses JSONP and a callback for cross domain calls
    function getAnimals(zipCode, offSet) {
        //the GET parameters are strung together in an URL and uses JSONP and a callback for cross domain calls
        var petUrl = "https://api.petfinder.com/pet.find"
        if(!$scope.selectedRsltPerPage){
            $scope.selectedRsltPerPage = "";
        }
        if(!$scope.selectedAnimal) {
            $scope.selectedAnimal = "";
        }
        if(!$scope.selectedSex) {
            $scope.selectedSex = "";
        }
        if(!offSet) {
            offSet = "";
        }
        console.log("Url: " + petUrl);
        console.log("Off set: " + offSet);
        $http({
            method: 'jsonp',
            url: petUrl,
            jsonpCallbackParam: 'callback',
            params: {
                key: '7310a3202957b2aa5d90e0b18d9c4ce2',
                format: 'json',
                location: zipCode,
                offset: offSet,
                animal: angular.lowercase($scope.selectedAnimal),
                count: $scope.selectedRsltPerPage,
                sex: $scope.selectedSex
            }
        }).then(function successCallback(response) {
            console.log("success");
            console.log(response);
            $scope.pets = response.data.petfinder.pets.pet;
            $scope.petLength = ($scope.pets).length
            console.log("Length:" + $scope.petLength);
        }, function errorCallback(response) {
            console.log(response);
        });
    }
    $scope.cardClicked = function(name) {
        console.log("Card Clicked" + name);
        $scope.showModal = !$scope.showModal;
    }
    $scope.findPets = function() {
        //calls the PetFinderAPI passing in the user inputed zipCode and number of results for each pet type
        $scope.page = 0;
        getAnimals($scope.inputData.zipCode, 0);
        console.log(pets);
        console.log("Zip Code:" + $scope.inputData.zipCode);

    }
    $scope.getPic = function(picUrl) {
        return picUrl;
    }
    $scope.changePage = function(isFoward) {
        var offSet;
        if (isFoward) {
            $scope.page += 1;
            offSet = $scope.page * $scope.selectedRsltPerPage;
            getAnimals($scope.inputData.zipCode, offSet);
        } else if (!isFoward && $scope.page > 0) {
            $scope.page -= 1;
            offSet = $scope.page * $scope.selectedRsltPerPage;
            getAnimals($scope.inputData.zipCode, offSet);
        }
        console.log("Page: " + $scope.page);
        window.scrollTo(0, 0);
    }

});
