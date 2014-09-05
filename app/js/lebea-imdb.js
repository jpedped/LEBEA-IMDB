(function() {
	var app = angular.module('lebea-imdb', []);
	
	//Service which houses http calls
	app.factory("SearchService", ['$http', '$q', function($http, $q) {		
		return {
			searchOMDBByTitle: function(searchText) {
				var omdbWeb =  "http://www.omdbapi.com/?";
				
				return $http.get(omdbWeb+'s='+encodeURIComponent(searchText)).then(function(response) {
					if(typeof response.data === 'object' && !response.data.Error){
						return response.data.Search;
					} else {
						return $q.reject(response.data);
					}
				});
			},
			searchOMDBByID: function(id) {
				var omdbWeb =  "http://www.omdbapi.com/?";
				
				return $http.get(omdbWeb+'i='+encodeURIComponent(id)).then(function(response) {
					if(typeof response.data === 'object' && !response.data.Error) {
						return response.data;
					} else {
						return $q.reject(response.data);
					}
					
				});
			}
		};
	}]);
	
	app.controller("MovieController", ['$scope','SearchService', function($scope,SearchService) {
		$scope.movieListing = [];
		$scope.movieDetails = {};
		$scope.error = {};
		this.criteria = {};
		
		this.searchOMDB = function(movieListing) {
			$scope.error = {};		//reset errors
			$scope.movieListing = [];
			
			SearchService.searchOMDBByTitle(this.criteria.searchText).then(function(data) {
				$scope.movieListing = data;	//reset MovieListing (will "delete" listing from screen while searching)
			}, function(error) {
				//most often - movie title doesnt return any results
				$scope.error.text = error.Error;
			});
		};
		
		this.getMovie = function(movieId) {
			$scope.error = {};		//reset errors
			$scope.movieDetails = {};	//reset MovieDetails (will "delete" the current movie from screen while searching)
			
			SearchService.searchOMDBByID(movieId).then(function(data) {
				$scope.movieDetails = data;
			}, function(error) {
				$scope.error.text = error.Error;
			});
		}
	}]);
	
	app.directive("errorText", function() {
		//normal error message directive <error-text></error-text>
		return {
			restrict: 'E',
			templateUrl: 'error.html'
		};
	});
})();