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

	it('should return -1 for invalid input', () => {
		assert.equal(checkout('a'), -1)
		assert.equal(checkout('-'), -1)
		assert.equal(checkout('ABCa'), -1)
	})

	it('should handle free offers correctly', () => {

		assert.equal(checkout('EEB'), 80)
		assert.equal(checkout('EB'), 70)
		assert.equal(checkout('AAAAEEB'), 130 + 50 + 80)
		assert.equal(checkout('AAAAAEEB'), 200 + 80)
		assert.equal(checkout('AAAAAAAEEB'), 200 + 100 + 80)

		assert.equal(checkout('AAAAAAAAAA'), 400)
		assert.equal(checkout('EEEEBB'), 160)
		assert.equal(checkout('BEBEEE'), 160)

		assert.equal(checkout('EE'), 80)

		assert.equal(checkout('ABCDEABCDE'), 280)
		assert.equal(checkout('CCADDEEBBA'), 280)
	})
	
	it('should handle buy multi get free orders correctly', () => {
		assert.equal(checkout('FFF'), 20)
		assert.equal(checkout('FF'), 20)
		assert.equal(checkout('FFFF'), 30)
		assert.equal(checkout('FFFFF'), 40)
		assert.equal(checkout('FFFFFF'), 40)

	})

	it('should handle the new items correctly', () => {
		assert.equal(checkout('OPPPPP'), 200 + 10)
		assert.equal(checkout('RRRQ'), 150)
		assert.equal(checkout('UUU'), 120)
		assert.equal(checkout('UUUU'), 120)
	})
});


/* | N    | 40    | 3N get one M free      |
| O    | 10    |                        |
| P    | 50    | 5P for 200             |
| Q    | 30    | 3Q for 80              |
| R    | 50    | 3R get one Q free      |
| S    | 30    |                        |
| T    | 20    |                        |
| U    | 40    | 3U get one U free      |
| V    | 50    | 2V for 90, 3V for 130  | */
