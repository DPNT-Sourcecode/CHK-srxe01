'use strict';

/* +------+-------+----------------+
| Item | Price | Special offers |
+------+-------+----------------+
| A    | 50    | 3A for 130     |
| B    | 30    | 2B for 45      |
| C    | 20    |                |
| D    | 15    |                |
+------+-------+----------------+ */

const skuPriceTable = {
    A: { price: 50, multi: { num: 3, price: 130 }},
    B: { price: 30, multi: { num: 2, price: 45 }},
    C: { price: 20 },
    D: { price: 15 }
}

const validSkus = Object.keys(skuPriceTable)

//noinspection JSUnusedLocalSymbols
module.exports = function (skus) {
    let cartSkuCount = validSkus.reduce((acc, sku) => {
        acc[sku] = 0
        return acc
    }, {})

    let validInput = true

    skus.split('').map((sku) => {
        if (validSkus.indexOf(sku) > -1) {
            cartSkuCount[sku]++
        } else {
            validInput = false
        }
    })

    if (validInput === false) return -1

    return Object.keys(cartSkuCount).reduce((acc, sku) => {
        const cartCount = cartSkuCount[sku]
        const skuPricing = skuPriceTable[sku]
        if ('multi' in skuPricing && cartCount >= skuPricing.multi.num) {
            // Use multi price
            const numMultis = Math.floor(cartCount / skuPricing.multi.num);
            const multiRemainder = cartCount % skuPricing.multi.num;
            return acc + (numMultis * skuPricing.multi.price) + (multiRemainder * skuPricing.price)
        } else {
            return acc + (cartCount * skuPricing.price)
        }
    }, 0)
};