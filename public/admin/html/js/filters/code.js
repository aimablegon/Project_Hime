'use strict';

/* Filters */
// need load the moment.js to use this filter. 

angular.module('app').filter('orderStatus', function() {
	return function(input) {

		console.log("#"+input);

		if(input == "01") {
			return "결제대기";
		} else if(input == "02") {
			return "결제완료";
		} else if(input == "03") {
			return "배송완료";
		} else if(input == "04") {
			return "결제완료";
		} else if(input == "90") {
			return "주문취소";
		}

		return input;
	}
});