import {loadAllItems, loadPromotions} from './Dependencies'

interface Product {
      barcode: string,
      name: string,
      unit: string,
      price: number
}

interface Tag {
  barcode : string,
  quantity: number
}

interface ReceiptItem {
  name : string,
  unit: string,
  quantity : number,
  price: number,
  subtotal: number,
  discountedPrice: number
}

const allproducts : Product[] = []
const promotionCodes : string[] = []

export function printReceipt(tags: string[]): string {


  const parsedTags : Tag[] = []
  const receiptItems: ReceiptItem[] = []
  let result = ''

  loadProductsAndPromotionCodes(allproducts, promotionCodes)

  parseTags(tags, parsedTags)

  generateReceiptItems(parsedTags, receiptItems)

  result += render(receiptItems)

  // console.log(allproducts);
  // console.log(parsedTags)
  // console.log(receiptItems)

  // console.log(result)

//     return `***<store earning no money>Receipt ***
// Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
// Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
// Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
// ----------------------
// Total：58.50(yuan)
// Discounted prices：7.50(yuan)
// **********************`
  return result;
}

function render(receiptItems: ReceiptItem[]) {
  let result = `***<store earning no money>Receipt ***\n`
  let total = 0
  let discounted = 0
  receiptItems.forEach(item => {
    total += item.discountedPrice
    discounted += (item.subtotal - item.discountedPrice)
    result += `  Name:${item.name},Quantity:${item.quantity} ${item.unit},Unit:${item.price}(yuan),Subtotal:${item.discountedPrice}(yuan)\n`
  })

  result += `----------------------
  Total: ${total.toFixed(2)}(yuan)
  Discounted prices: ${discounted.toFixed(2)}(yuan)
  **********************`

  return result;
}

function generateReceiptItems(parsedTags : Tag[], receiptItems: ReceiptItem[]) {
  // interface ReceiptItem {
  //   name : string,
  //   unit: string,
  //   quantity : number,
  //   price: number,
  //   subtotal: number,
  //   discountedPrice: number
  // }
  parsedTags.forEach(tag => {
    let receiptItem : ReceiptItem = {
      name : '',
      unit: '',
      quantity : 0,
      price: 0,
      subtotal: 0,
      discountedPrice: 0
    }
    let found = allproducts.find(product => {
      return tag.barcode.includes(product.barcode)
    })
    receiptItem.name = found!.name;
    receiptItem.price = found!.price;
    receiptItem.unit = found!.unit;
    receiptItem.quantity = tag.quantity;
    receiptItem.subtotal = receiptItem.price * receiptItem.quantity;
    let foundDiscount = promotionCodes.find(code => {
      return tag.barcode.includes(code)
    })
    let discount = 0;
    if (foundDiscount) {
      discount = Math.floor(receiptItem.quantity / 3) * receiptItem.price;
    }
    console.log(receiptItem.quantity / 3)
    console.log('discount' + discount)

    receiptItem.discountedPrice = receiptItem.subtotal - discount;
    receiptItems.push(receiptItem)
  })
  
}

function loadProductsAndPromotionCodes(allproducts : Product[], promotionCodes : string[]) {
  const loadedItems = loadAllItems()
  loadedItems.forEach(item => {
    allproducts.push(item)
  })

  const promotionIdx = 0
  const loadedPromotionCodes = loadPromotions()[promotionIdx].barcodes
  loadedPromotionCodes.forEach(code => {
    promotionCodes.push(code)
  })
  
}

function parseTags(tags : string[], parsedTags : Tag[]) {
  tags.forEach(tag => {
    if (!isCodeValid(tag)) {
      throw new Error(`The tag ${tag} is invalid, Program terminate abnormally!`)
    }
    insertTag(tag, parsedTags)
  })
}

function isCodeValid(code : string) : boolean {
  if (code === '') return false
  const found = allproducts.find((product) => {
    return code.indexOf(product.barcode) === 0
  })
  if (found) return true
  return false
}

function insertTag(tag : string, parsedTags : Tag[]) {
  const found = parsedTags.find((theTag) => {
    return tag.includes(theTag.barcode)
  })
  const tagArr : string[] = tag.split('-')
  let tagQuantity
  const quantityInString = tagArr[1]
  if (quantityInString === undefined) {
    tagQuantity = 1
  } else {
    if (quantityInString.includes('.')) {
      tagQuantity = parseFloat(quantityInString)
    } else {
      tagQuantity = parseInt(quantityInString)
    }
  }
  if (!found) {
    const newTag : Tag = {
      barcode : tag,
      quantity: tagQuantity
    }
    parsedTags.push(newTag)
  } else {
    found.quantity += tagQuantity
  }
}




printReceipt( [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2.5',
  'ITEM000005',
  'ITEM000005-2',
])


