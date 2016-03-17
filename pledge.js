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

		if (this.$promise.handlerGroups){
			for (var i = 0; i < this.$promise.handlerGroups.length; i++) {
				this.$promise.callHandlers(this.$promise.handlerGroups[i])
			}
			this.$promise.handlerGroups = [];
		}
	}
}

Deferral.prototype.reject = function(reason){
	if (this.$promise.state === 'pending'){
		this.$promise.state = 'rejected';
		this.$promise.value = reason;

		if (this.$promise.handlerGroups){
			// console.log(this.$promise.handlerGroups)
			for (var i = 0; i < this.$promise.handlerGroups.length; i++) {
				this.$promise.callHandlers(this.$promise.handlerGroups[i]);
			}
			this.$promise.handlerGroups = [];
		}
	}
}

$Promise.prototype.then = function(successfulFunc, errorFunc) {
	var obj = {};

	//Success Callback
	if (typeof successfulFunc == 'function') {
		obj.successCb = successfulFunc;
		// this.callHandlers(this.value);
	} else {
		obj.successCb = false;
	}

	//Error Callback
	if (typeof errorFunc == 'function') {
		obj.errorCb = errorFunc;
	} else {
		obj.errorCb = false;
	}

	this.handlerGroups.push(obj);

	this.handlerGroups[this.handlerGroups.length - 1].forwarder = defer();
	var forwardedPromise = this.handlerGroups[this.handlerGroups.length - 1].forwarder.$promise;

	if (this.state !== 'pending'){	
		// console.log(this);
		this.callHandlers(this.handlerGroups[this.handlerGroups.length - 1]);
		// this.handlerGroups.push({forwarder: new Deferral});

	} 
	// else {
	// 	this.then(forwardedPromise);
	// }
	// defer.resolve(forwardedPromise).bind(this);
	return forwardedPromise;
};

$Promise.prototype.catch = function(errfunction) {
	return this.then(null, errfunction);
};

$Promise.prototype.callHandlers = function(arrayObj) {
	console.log(this);
		if (this.state === 'resolved'){
			if (typeof arrayObj.successCb === 'function'){
				arrayObj.successCb(this.value);
			} else {
				arrayObj.forwarder.resolve(this.value);
				return false;
			}
		} else if(this.state === 'rejected') {
			if(typeof arrayObj.errorCb === 'function'){
				arrayObj.errorCb(this.value);
			} else {
				arrayObj.forwarder.reject(this.value);
				return false;
			}
		} 
};

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
