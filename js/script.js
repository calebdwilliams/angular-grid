'use strict';

var GridApp = angular.module('GridApp', []);

GridApp.controller('GridController', ['$parse', function($parse) {
	var self = this;

	self.columns = ['A', 'B', 'C', 'D', 'E'];
	self.rows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

	function checkCells(content) {
		if (content && typeof content === 'string' && content.indexOf('{') !== -1 && content.indexOf('}') !== -1) {
			var pattern = /\{[A-Z]+[0-9]\}/ig;
			var variables = content.match(pattern),
				varLocation = [];

			for (var i = 0; i < variables.length; i++) {
				varLocation.push(content.indexOf(variables[i]));
			}

			return {
				variables: variables,
				location: varLocation
			};
		} else {
			return null;
		}
	};

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
		var replace = checkCells(value);

		if (replace) {
			for (var i = 0; i < replace.variables.length; i++) {
				var newCell = replace.variables[i].replace('{','').replace('}','').toUpperCase().trim();
				value = value.replace(replace.variables[i], self.cells[newCell]);
			}
		}

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

		var replace = checkCells(value);

		if (replace) {
			for (var i = 0; i < replace.variables.length; i++) {
				var newCell = replace.variables[i].replace('{','').replace('}','').toUpperCase().trim();
				value = value.replace(replace.variables[i], self.cells[newCell]);
			}
		}

		try {
			var result = $parse(value)(self);
			if (result && !replace) {
				self.cells[cell] = result;
			} else if (result && replace) {
				self.cells[cell].result = result;
				return value;
			}
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
}]);