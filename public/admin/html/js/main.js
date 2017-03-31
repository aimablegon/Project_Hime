'use strict';

/* Controllers */

angular.module('app')
  .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$http',
    function(              $scope,   $translate,   $localStorage,   $window ,  $http) {
      // add 'ie' classes to html
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      isIE && angular.element($window.document.body).addClass('ie');
      isSmartDevice( $window ) && angular.element($window.document.body).addClass('smart');

      // config
      $scope.app = {
        name: 'Himedia',
        version: '1.0.0',
        // for chart colors
        color: {
          primary: '#7266ba',
          info:    '#23b7e5',
          success: '#27c24c',
          warning: '#fad733',
          danger:  '#f05050',
          light:   '#e8eff0',
          dark:    '#3a3f51',
          black:   '#1c2b36'
        },
        settings: {
          themeID: 1,
          navbarHeaderColor: 'bg-black',
          navbarCollapseColor: 'bg-white-only',
          asideColor: 'bg-black',
          headerFixed: true,
          asideFixed: false,
          asideFolded: false,
          asideDock: false,
          container: false
        }
      }

      // save settings to local storage
      if ( angular.isDefined($localStorage.settings) ) {
        $scope.app.settings = $localStorage.settings;
      } else {
        $localStorage.settings = $scope.app.settings;
      }
      $scope.$watch('app.settings', function(){
        if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
          // aside dock and fixed must set the header fixed.
          $scope.app.settings.headerFixed = true;
        }
        // for box layout, add background image
        $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
        // save to local storage
        $localStorage.settings = $scope.app.settings;
      }, true);

      // angular translate
      $scope.lang = { isopen: false };
      $scope.langs = {en:'English', de_DE:'German', it_IT:'Italian'};
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function(langKey, $event) {
        // set the current lang
        $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
        $translate.use(langKey);
        $scope.lang.isopen = !$scope.lang.isopen;
      };

      function isSmartDevice( $window )
      {
          // Adapted from http://www.detectmobilebrowsers.com
          var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
          // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
          return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
      }


		$http({
			method : "POST",
			url : "/admin/api/branch",
			data : {
				page : 1,
				pageSize : 9999
			}
		}).success(function(data) {

			$scope.branches = JSON.parse(JSON.stringify(data.list));
			$scope.branches.splice(0,1);

			$scope.branches1 = JSON.parse(JSON.stringify(data.list));
			$scope.branches2 = JSON.parse(JSON.stringify(data.list));
			$scope.branchNames = {};
			$scope.branchNames2 = {};

			for(var i=0;i<$scope.branches.length;i++){
				$scope.branchNames[$scope.branches[i].branchCode] = $scope.branches[i].branchName;
			}

			for(var i=0;i<$scope.branches2.length;i++){
				if($scope.branches2[i].branchCode == 'himedia') {
					$scope.branches2[i].branchName = '본사';
				}

				$scope.branchNames2[$scope.branches2[i].branchCode] = $scope.branches2[i].branchName;
			}



		});



		$http({
			method : "POST",
			url : "/admin/api/codes"
		}).success(function(data) {

			$scope.codes = data.codes;
			$scope.codeNames = data.codeNames;
		});



		$http({
			method : "POST",
			url : "/admin/api/courseField"
		}).success(function(data) {

			$scope.fields = data.list;
			$scope.fieldNames = {};

			for(var i=0;i<$scope.fields.length;i++){
				$scope.fieldNames[$scope.fields[i].fieldId] = $scope.fields[i].fieldName;
			}

		});

		$scope.jobCode = {};
		$scope.jobCode.recruitFields = [{
			key : '0',
			value : '시작/편집디자인'
		},{
			key : '1',
			value : '웹디자인'
		},{
			key : '2',
			value : '인테리어'
		},{
			key : '3',
			value : '게임'
		},{
			key : '4',
			value : '프로그래밍/시스템'
		},{
			key : '5',
			value : '세무회계/경리'
		},{
    		key : '7',
    		value : '일반사무'
    	},{
    		key : '6',
    		value : '기타'
    	}];

		$scope.jobCode.recruitNums = [];
		for(var i=1;i<51;i++) {
			$scope.jobCode.recruitNums.push({key : i+"", value : i + "명"});
		}

		$scope.jobCode.recruitTypes = [{
			key : '0',
			value : '정규직'
		},{
			key : '1',
			value : '계약직'
		},{
			key : '2',
			value : '병역특례'
		},{
			key : '3',
			value : '인턴직'
		},{
			key : '4',
			value : '위촉직'
		},{
			key : '5',
			value : '아르바이트'
		}];

		$scope.jobCode.careerConditions = [{
			key : '0',
			value : '신입'
		},{
			key : '1',
			value : '신입/경력'
		},{
			key : '2',
			value : '경력'
		}];

		$scope.jobCode.recruitSexs = [{
			key : '0',
			value : '성별무관'
		},{
			key : '1',
			value : '남성'
		},{
			key : '2',
			value : '여성'
		}];

		$scope.jobCode.educationLevels = [{
    		key : '0',
    		value : '학력무관'
    	},{
    		key : '2',
    		value : '고졸'
    	},{
    		key : '3',
    		value : '초대졸'
    	},{
    		key : '4',
    		value : '대졸'
    	},{
    		key : '5',
    		value : '대학원졸업이상'
    	}];
		
		$scope.authority = function(role){
			
			var isPermitted = false;	
			
			role.map(function(item){				
				if($scope.currentUser.adminRoll == item) {
					isPermitted = true;				
				}
			});
			
			return isPermitted;
		}

		for(var key in $scope.jobCode) {

			var name = key.substring(0,key.length-1);
			if(!$scope.jobCode[name]) {
				$scope.jobCode[name] = {};
			}
			for(var i=0;i<$scope.jobCode[key].length;i++) {
				$scope.jobCode[name][$scope.jobCode[key][i].key] = $scope.jobCode[key][i].value;
			}
		}

		console.log($scope.jobCode);


  }]);


angular.module('app').directive('datepickerPopup', function (){
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
  }
}
});

angular.module('app').directive('fileUpload', function () {
    return {
        scope: true,        //create a new scope
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
            	var o = { files: event.target.files };
            	angular.extend(o, attrs);
                scope.$emit("fileSelected", o);
                el.val(null);
            });
        }
    };
});
