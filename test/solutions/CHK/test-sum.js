var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it
var assert = require('assert');
const checkout = require('../../../lib/solutions/CHK/checkout');

describe('CHK challenge: single item cart', function() {
	it('should return the correct price for single items', () => {
		assert.equal(checkout('A'), 50)
		assert.equal(checkout('B'), 30)
		assert.equal(checkout('C'), 20)
	})
});