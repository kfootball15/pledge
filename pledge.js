'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js deferral-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

var $Promise = function(){
	this.handlerGroups = [];
	this.state = 'pending';
};

var Deferral = function(){
	this.$promise = new $Promise();
};

var defer = function(){
	return new Deferral();
}

Deferral.prototype.resolve = function(data){
	if (this.$promise.state === 'pending') {
		this.$promise.state = 'resolved'; 
		this.$promise.value = data;		
	}
}

Deferral.prototype.reject = function(reason){
	if (this.$promise.state === 'pending'){
		this.$promise.state = 'rejected';
		this.$promise.value = reason;
	}
}

$Promise.prototype.then = function(successfulFunc, errorFunc) {
	var obj = {};

	if (typeof successfulFunc == 'function') {
		obj.successCb = successfulFunc;
		// this.callHandlers(this.value);
	} else {
		obj.successCb = false;
	}
	if (typeof errorFunc == 'function') {
		obj.errorCb = errorFunc;
		// this.callHandlers(this.value);
	} else {
		obj.errorCb = false;
	}

	this.handlerGroups.push(obj);
	

	this.callHandlers(this.handlerGroups[0]);
	// this.callHandlers(this.handlerGroups[0]);
};

$Promise.prototype.callHandlers = function(arrayObj) {
	if (typeof arrayObj.successCb == 'function' && typeof arrayObj.errorCb == 'function'){
		if (this.state === 'resolved') {
			arrayObj.successCb();
		} else {
			arrayObj.errorCb();
		}		
	} else if (typeof arrayObj.successCb === 'function') {
		if (this.state === 'resolved') {
			arrayObj.successCb();
		} else {
			return false;
		}		
	} else if (typeof arrayObj.errorCb === 'function') {
		if (this.state === 'resolved') {
			return false;
		} else {
			arrayObj.errorCb();
		}		
	}
	// else {
	// 	return false;
	// }

}






/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = {
  defer: defer,
};

So in a Node-based project we could write things like this:

var pledge = require('pledge');
…
var myDeferral = pledge.defer();
var myPromise1 = myDeferral.$promise;
--------------------------------------------------------*/
