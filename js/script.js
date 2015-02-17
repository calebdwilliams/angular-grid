'use strict';

var GridApp = angular.module('GridApp', []);

GridApp.controller('GridController', ['$parse', 'LinkFactory', function($parse, LinkFactory) {
	var self = this;

	self.columns = ['A', 'B', 'C', 'D', 'E'];
	self.rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

	self.change = function(item, location) {
		return LinkFactory.checkModel(item, function(result) {
			self.cells[location] = self.cells[result];
		});
	};

	self.focus = function(item) {
		// self.focus = item;
		console.log(item);	
	};

	self.liveParse = function(cell) {
		var value = self.cells[cell];
		try {
			var result = $parse(value)(self);
			if (result) {
				return result;
			} else {
				return value;
			}
		} catch(e) {
			return value;
		}
	}

	self.parse = function(cell) {
		var value = self.cells[cell];
		try {
			var result = $parse(value)(self);
			if (result) {self.cells[cell] = result} else {return value;}
		} catch(e) {
			return value;
		}
	};

	self.tabRow = function(enter, shift, column, row) {
		if (enter && !shift) {
			// if enter and not shift, drop down one row
			var destination = document.getElementById(column + (parseInt(row) + 1));
			if (destination) {
				destination.focus();
			} else {
				if (confirm('Create new row?')) {
					self.rows.push(parseInt(row) + 1);
				}
			}
		} else if (enter && shift) {
			// if enter and shift, go up one row
			var destination = document.getElementById(column + (parseInt(row) - 1));
			if (destination) {
				destination.focus();
			}
		}
	}

	self.cells = {};
	// self.cells.A1 = 'test';
}]);

GridApp.factory('LinkFactory', ['$http', '$q', function($http, $q) {
	return {
		checkModel: function(content, callback) {
			var pattern = /\{[A-Z]+[0-9]\}/i;

			if (content && content.indexOf('{') !== -1) {
				console.log(content);
				var replacement = content.match(pattern)[0];

				replacement = replacement.replace('{','');
				replacement = replacement.replace('}','');
				replacement = replacement.toUpperCase();

				console.log(replacement);
				callback(replacement);
				return replacement;
			} else {
				console.log('nope');
			}
		}
	}
}]);