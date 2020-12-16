'use strict';

/*
+------+-------+---------------------------------+
| Item | Price | Special offers                  |
+------+-------+---------------------------------+
| A    | 50    | 3A for 130, 5A for 200          |
| B    | 30    | 2B for 45                       |
| C    | 20    |                                 |
| D    | 15    |                                 |
| E    | 40    | 2E get one B free               |
| F    | 10    | 2F get one F free               |
| G    | 20    |                                 |
| H    | 10    | 5H for 45, 10H for 80           |
| I    | 35    |                                 |
| J    | 60    |                                 |
| K    | 70    | 2K for 120                      |
| L    | 90    |                                 |
| M    | 15    |                                 |
| N    | 40    | 3N get one M free               |
| O    | 10    |                                 |
| P    | 50    | 5P for 200                      |
| Q    | 30    | 3Q for 80                       |
| R    | 50    | 3R get one Q free               |
| S    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 | XX
| T    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 | XX 
| U    | 40    | 3U get one U free               |
| V    | 50    | 2V for 90, 3V for 130           |
| W    | 20    |                                 |
| X    | 17    | buy any 3 of (S,T,X,Y,Z) for 45 | XX
| Y    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 | XX
| Z    | 21    | buy any 3 of (S,T,X,Y,Z) for 45 | XX
+------+-------+---------------------------------+ */

const skuPriceTable = {
    A: { price: 50, multi: { 3: 130, 5: 200 } },
    B: { price: 30, multi: { 2: 45 } },
    C: { price: 20 },
    D: { price: 15 },
    E: { price: 40, free: { 2: 'B' } },
    F: { price: 10, bmgf: { 2: 1 } }, // Buy Multi Get Free
    G: { price: 20 },
    H: { price: 10, multi: { 5: 45, 10: 80 } },
    I: { price: 35 },
    J: { price: 60 },
    K: { price: 80, multi: { 2: 150 } },
    L: { price: 90 },
    M: { price: 15 },
    N: { price: 40, free: { 3: 'M' } },
    O: { price: 10 },
    P: { price: 50, multi: { 5: 200 } },
    Q: { price: 30, multi: { 3: 80 }  },
    R: { price: 50, free: { 3: 'Q' }  },
    S: { price: 30 },
    T: { price: 20 },
    U: { price: 40, bmgf: { 3: 1 } },
    V: { price: 50, multi: { 2: 90, 3: 130 } },
    W: { price: 20 },
    X: { price: 90 },
    Y: { price: 10 },
    Z: { price: 50 }
}

const groupPricingTable = [
    { skus: ['S', 'T', 'X', 'Y', 'Z'], num: 3, price: 45 }
]

const validSkus = Object.keys(skuPriceTable)

const getZeroSkusDict = () => {
    return validSkus.reduce((acc, sku) => {
        acc[sku] = 0
        return acc
    }, {})
}

const getMultiBuyPrice = (sku, number) => {
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
        if (remaingItems > 0) multiBuyPrice += remaingItems * skuPricing.price
        return multiBuyPrice
    }
    if ('bmgf' in skuPricing) {
        let remaingItemsBmgf = number
        const bmgfLevels = Object.keys(skuPricing.bmgf).map((str) => parseInt(str, 10)).sort((a, b) => b - a)
        let bmgfPrice = 0
        for(let i = 0; i < bmgfLevels.length; i++) {
            const bmgfLevel = bmgfLevels[i]
            const requiredItems = bmgfLevel + skuPricing.bmgf[bmgfLevel.toString(10)]
            while (remaingItemsBmgf >= requiredItems) {
                remaingItemsBmgf -= requiredItems
                bmgfPrice += bmgfLevel * skuPricing.price
            }
        }
        if (remaingItemsBmgf > 0) bmgfPrice += remaingItemsBmgf * skuPricing.price
        return bmgfPrice
    }
    
    return (number * skuPricing.price)
    
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
    
    if (validInput === false) return -1

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

    let groupCost = 0
    groupPricingTable.map((group) => {
        let numItems = 0
        group.skus.map((sku) => {
            numItems += cartSkuCount[sku]
        })
        console.log(numItems)
        let numberOfItemsToRemove = 0
        while(numItems >= group.num) {
            numItems -= group.num
            groupCost += group.price
            numberOfItemsToRemove += group.num
        }
        if (numberOfItemsToRemove > 0) {
            const skusByPrice = group.skus.map((sku) => {
                return { price: skuPriceTable[sku].price, sku }
            }).sort((a, b) => b.price - a.price)
            console.dir(skusByPrice)
            let skuOffset = 0
            let count = 0
            while (numberOfItemsToRemove > 0 && skuOffset < skusByPrice.length) {
                count++
                let currItem = skusByPrice[skuOffset]
                const numItemsInCart = cartSkuCount[currItem.sku]
                console.log(numberOfItemsToRemove)
                console.log(numItemsInCart)
                console.dir(currItem)
                if (numItemsInCart > 0) {
                    if (numItemsInCart > numberOfItemsToRemove) {
                        cartSkuCount[currItem.sku] -= numberOfItemsToRemove
                        numberOfItemsToRemove = 0
                    } else {
                        numberOfItemsToRemove -= cartSkuCount[currItem.sku]
                        cartSkuCount[currItem.sku] = 0
                    }
                }
                skuOffset++
            }
        }
    })

    let cartIntermediaryCost = Object.keys(cartSkuCount).reduce((acc, sku) => {
        const cartCount = cartSkuCount[sku]
        if (cartCount > 0) {
            acc[sku] = getMultiBuyPrice(sku, cartCount - freeItemsCount[sku])
        }
        return acc
    }, {})

    return Object.keys(cartIntermediaryCost).reduce((acc, sku) => {
        let cost = cartIntermediaryCost[sku]
        return acc + cost
    }, 0) + groupCost
};
