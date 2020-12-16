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
    E: { price: 40, free: { 2: 'B' } }
}

const validSkus = Object.keys(skuPriceTable)

const getZeroSkusDict = () => {
    return validSkus.reduce((acc, sku) => {
        acc[sku] = 0
        return acc
    }, {})
}

const getMultiBuyPrice = (sku, number) => {
    console.log(`g ${sku} ${number}`)
    const skuPricing = skuPriceTable[sku]

    if ('multi' in skuPricing) {
        let remaingItems = number
        const multiLevels = Object.keys(skuPricing.multi).map((str) => parseInt(str, 10)).sort((a, b) => b - a)
        let multiBuyPrice = 0
        for(let i = 0; i < multiLevels.length; i++) {
            const multiLevel = multiLevels[i]
            while (remaingItems >= multiLevel) {
                remaingItems -= multiLevel
                multiBuyPrice += skuPricing.multi[multiLevel.toString(10)]
            }
        }
        console.log(`mbp: ${multiBuyPrice}`)
        if (remaingItems > 0) multiBuyPrice += remaingItems * skuPricing.price
        console.log('here here')
        return multiBuyPrice
    } else {
        console.log('there there')
        return (number * skuPricing.price)
    }
}

//noinspection JSUnusedLocalSymbols
module.exports = function (skus) {
    let cartSkuCount = getZeroSkusDict()
    
    let validInput = true

    skus.split('').map((sku) => {
        if (validSkus.indexOf(sku) > -1) {
            cartSkuCount[sku]++
        } else {
            validInput = false
        }
    })
    console.dir(cartSkuCount)
    if (validInput === false) return -1

    let cartIntermediaryCost = Object.keys(cartSkuCount).reduce((acc, sku) => {
        const cartCount = cartSkuCount[sku]
        const skuPricing = skuPriceTable[sku]
        acc[sku] = getMultiBuyPrice(sku, cartCount)
        return acc
    }, {})
    console.dir(cartIntermediaryCost)
    let freeItemsCount = getZeroSkusDict()

    Object.keys(cartSkuCount).map((sku) => {
        const cartCount = cartSkuCount[sku]
        const skuPricing = skuPriceTable[sku]
        if ('free' in skuPricing) {
            let remainingItemsFree = cartCount;
            const freeLevels = Object.keys(skuPricing.free).map((str) => parseInt(str, 10))
            freeLevels.map((level) => {
                while (remainingItemsFree >= level) {
                    remainingItemsFree -= level
                    const freeSku = skuPricing.free[level.toString(10)]
                    freeItemsCount[freeSku]++
                }
            })
        }
    })
    console.log('free: ')
    console.dir(freeItemsCount)
    return Object.keys(cartIntermediaryCost).reduce((acc, sku) => {
        let cost = cartIntermediaryCost[sku]
        if (freeItemsCount[sku] > 0) {
            if (cartSkuCount[sku] > 0) {
                if (cartSkuCount[sku] >= freeItemsCount[sku]) {
                    console.log('here')
                    cost -= getMultiBuyPrice(sku, freeItemsCount[sku])
                } else if (freeItemsCount[sku] > cartSkuCount[sku]) {
                    console.log('there')
                    cost -= getMultiBuyPrice(sku, cartSkuCount[sku])
                }
            }
        }
        return acc + cost
    }, 0)
};

