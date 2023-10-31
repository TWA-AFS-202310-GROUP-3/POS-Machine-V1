import {loadAllItems, loadPromotions} from './Dependencies'

interface Quantity{
  value: number;
  quantifier: string
}

interface ReceiptItem{
  name: string;
  quantity: Quantity;
  unitPrice: number;
  subtotal: number;
  discountedPrice: number
  // barcode: string;
  // name: string;
  // unit: string;
  // price: number;
}

interface Tag{
  barcode: string;
  quantity: number
}

export function printReceipt(tags: string[]): string {
//   return `***<store earning no money>Receipt ***
// Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
// Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
// Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
// ----------------------
// Total：58.50(yuan)
// Discounted prices：7.50(yuan)
// **********************`
  // const items: ReceiptItem[] = loadAllItems()
  // const tagItems: Tag[] = parseTags(tags)
  // const receiptItems: ReceiptItem[] = generateReceiptItems(tagItems, items)
  const tagItemMap = getTagItemMap()
  const receiptItems = generateReceiptItems(tags, tagItemMap)
  const total = calculateTotal(receiptItems)
  const discountedTotal = calculateDiscountedTotal(receiptItems, tagItemMap)
  const receiptText = renderReceipt(receiptItems, total, discountedTotal)

  console.log(receiptText)
  return receiptText
  // return '1'
}

function getTagItemMap() {
  const items = loadAllItems()
  const tagItemMap: { [key: string]: { name: string; unitPrice: number } } = {}
  items.forEach((item) => {
    tagItemMap[item.barcode] = {
      name: item.name,
      unitPrice: item.price,
    }
  })
  return tagItemMap
}

function generateReceiptItems(tags: string[], tagItemMap: {
  [key: string]: { name: string; unitPrice: number };
}): ReceiptItem[] {
  const tagMap: { [key: string]: number } = {}

  tags.forEach((tag) => {
    const [barcode, quantityString] = tag.split('-')
    const quantity = parseFloat(quantityString) || 1
    if (tagMap[barcode]) {
      tagMap[barcode] += quantity
    } else {
      tagMap[barcode] = quantity
    }
  })
  const receiptItems: ReceiptItem[] = []
  Object.entries(tagMap).forEach(([barcode, quantity]) => {
    const item = tagItemMap[barcode]
    const { name, unitPrice } = item
    const subtotal = unitPrice * quantity
    const discountedPrice = subtotal
    receiptItems.push({
      name,
      quantity: { value: quantity, quantifier: getQuantifier(item) },
      unitPrice,
      subtotal,
      discountedPrice,
    })
  })
  return receiptItems
}

function getQuantifier(item: { unitPrice: number }) {
  return item.unitPrice > 1 ? 'bottles' : 'bottle'
}

function calculateTotal(receiptItems: ReceiptItem[]): number {
  let total = 0
  receiptItems.forEach((item) => {
    total += item.subtotal
  })
  return total
}

function calculateDiscountedTotal(receiptItems: ReceiptItem[],tagItemMap: {
  [key: string]: { name: string; unitPrice: number };
}): number {
  const promotions = loadPromotions()
  let discountedTotal = calculateTotal(receiptItems)
  promotions.forEach((promotion) => {
    if (promotion.type === 'BUY_TWO_GET_ONE_FREE') {
      const applicableBarcodes = promotion.barcodes
      applicableBarcodes.forEach((barcode) => {
        const receiptItem = receiptItems.find((item) => item.name === tagItemMap[barcode].name)
        if (receiptItem) {
          const quantity = Math.floor(receiptItem.quantity.value / 3)
          const discount = quantity * receiptItem.unitPrice
          discountedTotal -= discount
          receiptItem.discountedPrice -= discount
        }
      })
    }
  })
  return discountedTotal
}

function renderReceipt(
  receiptItems: ReceiptItem[],
  total: number,
  discountedTotal: number
): string {
  let receiptText = '***<store earning no money>Receipt ***\n'

  receiptItems.forEach((item) => {
    receiptText += `Name: ${item.name}, Quantity: ${item.quantity.value} ${item.quantity.quantifier}, Unit: ${
      item.unitPrice.toFixed(2)
    }(yuan), Subtotal: ${item.subtotal.toFixed(2)}(yuan)\n`
  })

  receiptText += '----------------------\n'
  receiptText += `Total: ${total.toFixed(2)}(yuan)\n`
  receiptText += `Discounted prices: ${(total - discountedTotal).toFixed(2)}(yuan)\n`
  receiptText += '**********************'

  return receiptText
}

// export function parseTags(tags: string[]): Tag[]{
//   const tagItems: Tag[] = []
//   for (const item of tags) {
//     const parts: string[] = item.split('-')
//     const barcode: string = parts[0]
//     const quantity: number = parseFloat(parts[1]) || 1
//     tagItems.push({ barcode, quantity })
//   }
//   return tagItems
// }

// export function generateReceiptItems(tagItems: Tag[], items: ReceiptItem[]): ReceiptItem[]{
//   const receiptItems: ReceiptItem[] = []
//   for (const tagItem of tagItems) {
//     const item: ReceiptItem | undefined = items.find(i => i.barcode === tagItem.barcode)

//     if (item) {
//       receiptItems.push({
//         barcode: item.barcode,
//         name: item.name,
//         unit: item.unit,
//         price: item.price,
//         quantity: tagItems.quantity
//       })
//     }
//   }
//   return receiptItems
// }
