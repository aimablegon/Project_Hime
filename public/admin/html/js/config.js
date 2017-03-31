// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
  .factory('sessionChecker', ['$q', '$injector', function($q, $injector) {  
	    var sessionRecoverer = {
	            responseError: function(response) {
	                if (response.status == 401){
	                	window.location = "/admin";
	                }else if (response.status == 500){
	                	console.log(response);
	                	if(response.data) {
	                		alert(response.data);	
	                	}
	                	
	                }
	                return $q.reject(response);
	            }
	    };
	    return sessionRecoverer;
  	}
  ])
  .config(
    [        '$httpProvider',
    function ($httpProvider) {
     
        
        $httpProvider.interceptors.push("sessionChecker");
    }
    ])
  
  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }]);