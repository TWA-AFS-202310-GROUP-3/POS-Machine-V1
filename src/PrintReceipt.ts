import {loadAllItems, loadPromotions} from './Dependencies'
import { ReceiptItem, Tag } from './interface'

export function printReceipt(tags: string[]): string {

  // Parse input tags and generate receipt items
  const parsedTags: Tag[] | null = parseTags(tags)
  if (!parsedTags) {
    return 'Invalid tags.'
  }
  const receiptItems: ReceiptItem[] = generateReceiptItems(tags)

  // Calculate total and discounted prices
  let total = 0
  let discountedTotal = 0

  receiptItems.forEach(item => {
    total += item.subtotal
    discountedTotal += item.discountedPrice
  })

  // Format receipt output
  let receipt = '***<store earning no money>Receipt ***\n'
  receiptItems.forEach(item => {
    receipt += `Name: ${item.name}, Quantity: ${item.quantity.value} ${item.quantity.quantifier}, ` +
                 `Unit: ${item.unitPrice.toFixed(2)}(yuan), Subtotal: ${item.subtotal.toFixed(2)}(yuan)\n`
  })
  receipt += '----------------------\n'
  receipt += `Total: ${total.toFixed(2)}(yuan)\n`
  receipt += `Discounted prices: ${(total - discountedTotal).toFixed(2)}(yuan)\n`
  receipt += '**********************'

  return receipt
//   return `***<store earning no money>Receipt ***
// Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
// Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
// Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
// ----------------------
// Total：58.50(yuan)
// Discounted prices：7.50(yuan)
// **********************`
}

// function parseTags(tags: string[]): Tag[] | null {
//   const parsedTags: Tag[] = []
//   const tagQuantity: { [tag: string]: number } = {}

//   if (tags.length === 0) {
//     return null
//   }

//   for (const tagFull of tags) {
//     const splitTag = tagFull.split('-')
//     const tag = splitTag[0]

//     if ((tag === 'ITEM000000') || (tag === 'ITEM000001') || (tag === 'ITEM000004') || (tag === 'ITEM000005')) {
//       if (parsedQuantity(tagFull)) {
//         if (tagQuantity[tag]) {
//           tagQuantity[tag]++
//         } else {
//           tagQuantity[tag] = 1
//         }
//       } else {
//         return null
//       }
//     }
//     else {
//       if (tagQuantity[tag]) {
//         tagQuantity[tag]++
//       } else {
//         tagQuantity[tag] = 1
//       }
//     }
//   }

//   for (const [barcode, quantity] of Object.entries(tagQuantity)) {
//     parsedTags.push({ barcode, quantity })
//   }
//   return parsedTags
// }

// function parsedQuantity(tagFull: string): boolean {
//   const splitTag = tagFull.split('-')
//   const q = parseFloat(splitTag[1])
//   return Number.isInteger(q) && isNotEqualToOne(q)
// }

// function isNotEqualToOne(quantity: number): boolean {
//   return quantity !== 1
// }

function parseTags(tags: string[]): Tag[] | null {
  const parsedTags: Tag[] = []
  const tagQuantity: { [tag: string]: number } = {}
  if (tags.length === 0) {
    return null
  }
  for (const tagFull of tags) {
    const splitTag = tagFull.split('-')
    const tag = splitTag[0]
    if ((tag === 'ITEM000000') || (tag === 'ITEM000001') || (tag === 'ITEM000004') || (tag === 'ITEM000005')) {
      const cnt = parsedQuantity(tagFull)
      tagQuantity[tag] += cnt
    }
  }
  for (const [barcode, quantity] of Object.entries(tagQuantity)) {
    parsedTags.push({ barcode, quantity })
  }
  return parsedTags
}
function parsedQuantity(tagFull: string): number {
  const splitTag = tagFull.split('-')
  const q = parseFloat(splitTag[1])
  return Number(q) || 1
}

function generateReceiptItems(tags: string[]): ReceiptItem[] {
  // Load all items from the dependency
  const allItems = loadAllItems()
  const promotions = loadPromotions()

  // Create an object to store item barcodes and their quantities
  const barcodeQuantityMap: { [barcode: string]: number } = {}

  // Count the quantity of each barcode in the input array
  for (const barcode of tags) {
    if (barcodeQuantityMap[barcode]) {
      barcodeQuantityMap[barcode]++
    } else {
      barcodeQuantityMap[barcode] = 1
    }
  }

  promotions.forEach(promotion => {
    if (promotion.type === 'BUY_TWO_GET_ONE_FREE') {
      promotion.barcodes.forEach(promoBarcode => {
        const quantity = barcodeQuantityMap[promoBarcode]
        if (quantity >= 2) {
          const freeItems = Math.floor(quantity / 2)
          barcodeQuantityMap[promoBarcode] -= freeItems
        }
      })
    }
  })

  const receiptItems: ReceiptItem[] = []

  // Iterate through the barcodeQuantityMap and create ReceiptItem objects
  for (const [barcode, quantity] of Object.entries(barcodeQuantityMap)) {
    const item = allItems.find((item) => item.barcode === barcode)

    if (item) {
      const quantifierWithS = item.unit + 's'
      const receiptItem: ReceiptItem = {
        name: item.name,
        quantity: { value: quantity, quantifier: quantifierWithS },
        unitPrice: item.price,
        subtotal: quantity * item.price,
        discountedPrice: quantity * item.price
      }

      receiptItems.push(receiptItem)
    }
  }

  return receiptItems
}

// function renderReceipt(receiptItems: ReceiptItem[]){

// }

const tags: string[] = ['ITEM000001-3', 'ITEM000004-2', 'ITEM000001-1','ITEM000003']
const receipt: string = printReceipt(tags)
console.log(receipt)
