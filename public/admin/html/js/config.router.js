'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams','$templateCache', '$cookieStore',
      function ($rootScope,   $state,   $stateParams, $templateCache, $cookieStore) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
  
          $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams){
        	  
        	  
        	  var cu = $cookieStore.get("currentUser");
        	  if(cu) {
        		  var currentUser = JSON.parse($cookieStore.get("currentUser"));
        		  if(!$rootScope.currentUser) {
        			  $rootScope.currentUser = currentUser;
        		  }
        	  }
        	  
        	  if (toState.authenticate && !$rootScope.currentUser) {
	              // User isn’t authenticated
	              $state.transitionTo("access.signin");
	              event.preventDefault(); 
        	  }
          });
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
          var layout = "tpl/app.html";

          $urlRouterProvider.when('','/access/signin');
          $urlRouterProvider.otherwise('/access/404');
          
          $stateProvider
	          .state('access', {
	              url: '/access',
	              template: '<div ui-view class="fade-in-right-big smooth"></div>'
	          })
	          .state('access.signin', {
	              url: '/signin',
	              templateUrl: 'tpl/signin.html'
	          })
	          .state('access.signup', {
	              url: '/signin',
	              templateUrl: 'tpl/signup.html'
	          })
            .state('access.404', {
                url: '/404',
                templateUrl: 'tpl/404.html'
            })          
            .state('access.500', {
                url: '/500',
                templateUrl: 'tpl/500.html'
            })          
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: layout
              })
              .state('app.dashboard', {
                  url: '/dashboard',
                  templateUrl: 'tpl/dashboard.html',
                  resolve: load(['js/controllers/chart.js'])
              })
              .state('app.dynamic1', {
                  url: '/:folerName',
                  templateUrl: function ($stateParams){
                	  return 'tpl/'+$stateParams.folerName+'.html'
              	    
              	  }
              })
              .state('app.dynamic2', {
                  url: '/:folerName/:name?page&searchText&json',
                  templateUrl: function ($stateParams){
                	  if($stateParams.json) {
                		  angular.extend($stateParams, JSON.parse($stateParams.json));
                	  }
                	  return 'tpl/'+$stateParams.folerName+'/'+$stateParams.name+'.html'
              	    
              	  }
              })
              .state('app.dynamic3', {
                  url: '/:folerName/:name/:subname?json',
                  templateUrl: function ($stateParams){
                	  if($stateParams.json) {
                		  angular.extend($stateParams, JSON.parse($stateParams.json));
                	  }
                	  return 'tpl/'+$stateParams.folerName+'/'+$stateParams.name+'_'+$stateParams.subname+'.html'
              	  }
              })
              .state('app.dynamic4', {
                  url: '/:folerName/:name/:subname/:id?json',
                  templateUrl: function ($stateParams){
                	  if($stateParams.json) {
                		  angular.extend($stateParams, JSON.parse($stateParams.json));
                	  }
                	  return 'tpl/'+$stateParams.folerName+'/'+$stateParams.name+'_'+$stateParams.subname+'.html'
              	  }
              })
              /*
              .state('app.branch', {
            	  abstract: true,
            	  url: '/branch',
            	  templateUrl: 'tpl/page_template.html'
              })
              .state('app.branch.branch', {
                  url: '/branch',
                  templateUrl: 'tpl/branch/page_branch_list.html'
              })
              .state('app.branch.branch.detail', {
                  url: '/branch/detail/:userId',
                  templateUrl: 'tpl/branch/page_branch_detail.html'
              })
              */
	           ;
          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }


      }
    ]
  );
