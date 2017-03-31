angular.module('app')
  .directive('uiButterbar', ['$rootScope', '$anchorScroll', function($rootScope, $anchorScroll) {
     return {
      restrict: 'AC',
      template:'<span class="bar"></span>',
      link: function(scope, el, attrs) {        
        el.addClass('butterbar hide');
        scope.$on('$stateChangeStart', function(event) {
          $anchorScroll();
          el.removeClass('hide').addClass('active');
        });
        scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
          event.targetScope.$watch('$viewContentLoaded', function(){
            el.addClass('hide').removeClass('active');
          })
        });
      }
     };
  }]);

angular.module('app').directive('ifLoading', ['$http', '$anchorScroll', function ($http,$anchorScroll) {

  return {
    restrict: 'A',
    link : function (scope, el) {

      scope.isLoading = function () {
          return $http.pendingRequests.length > 0;
      };

      scope.$watch(scope.isLoading, function (v)
      {
          if(v){
              el.show();
          }else{
              el.hide();
          }
      });
    }
  }
}]);