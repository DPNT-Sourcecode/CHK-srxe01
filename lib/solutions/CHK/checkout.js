'use strict';

/* +------+-------+------------------------+
| Item | Price | Special offers         |
+------+-------+------------------------+
| A    | 50    | 3A for 130, 5A for 200 |
| B    | 30    | 2B for 45              |
| C    | 20    |                        |
| D    | 15    |                        |
| E    | 40    | 2E get one B free      |
+------+-------+------------------------+ */

const skuPriceTable = {
    A: { price: 50, multi: { 3: 130, 5: 200 }},
    B: { price: 30, multi: { 2: 45 }},
    C: { price: 20 },
    D: { price: 15 },
    E: { price: 40 }, free: { 2: 'B' }
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
        console.dir(skuPricing)
        let priceDiscount = 0
        if ('free' in skuPricing) {
            const freeLevels = Object.keys(skuPricing.free).map((str) => parseInt(str, 10))
            let validFree = null
            freeLevels.map((level) => {
                if (cartCount >= level) {
                    const freeSku = skuPricing.free[level.toString(10)]
                    if (cartCount[freeSku] > 0) priceDiscount -= skuPriceTable[freeSku].price
                }
            })
        }
        if ('multi' in skuPricing) {
            let remaingItems = cartCount
            const multiLevels = Object.keys(skuPricing.multi).map((str) => parseInt(str, 10)).sort((a, b) => b - a)
            let multiBuyPrice = 0
            for(let i = 0; i < multiLevels.length; i++) {
                const multiLevel = multiLevels[i]
                if (remaingItems >= multiLevel) {
                    remaingItems -= multiLevel
                    multiBuyPrice += skuPricing.multi[multiLevel.toString(10)]
                }
            }
            if (remaingItems > 0) multiBuyPrice += remaingItems * skuPricing.price
            return acc + multiBuyPrice + priceDiscount
        } else {
            return acc + (cartCount * skuPricing.price) + priceDiscount
        }
    }, 0)
};