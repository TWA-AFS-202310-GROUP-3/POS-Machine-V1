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

const allproducts : Product[] = []
const promotionCodes : string[] = []

export function printReceipt(tags: string[]): string {


  const parsedTags : Tag[] = []

  loadProductsAndPromotionCodes(allproducts, promotionCodes)

  parseTags(tags, parsedTags)
  // console.log(allproducts);
  console.log(parsedTags)
    return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
  // return "";
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
// console.log(isCodeValid('ITEM000001-2'));



//   return `***<store earning no money>Receipt ***
// Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
// Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
// Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
// ----------------------
// Total：58.50(yuan)
// Discounted prices：7.50(yuan)
// **********************`
