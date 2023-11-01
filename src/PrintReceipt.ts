import {loadAllItems, loadPromotions} from './Dependencies'
export interface Quantity{
  value: number;
  quantifier: string
}

interface ReceiptItem{
  name: string;
  quantity: Quantity;
  unitPrice: number;
  subtotal: number;
  discountedPrice: number
}

interface Tag{
  barcode: string;
  quantity: number
}

interface Item{
  barcode: string;
  name: string;
  unit: string;
  price: number;
}

interface Promotion{
  type: string;
  barcodes: string[];
}

export function printReceipt(tags: string[]): string {

  const parsedTags = parseTags(tags)
  if(parsedTags === null){
    return 'Tags are invalid, please check it!'
  }
  const receiptItems = generateReceiptItems(parsedTags)
  const receipt = renderReceipt(receiptItems)
  return receipt
}

function isTagValid(parsedTag: Tag, allItems: Item[], barcodeOfItemNotSoldInUnit: string[]): boolean{

  if(allItems.find((item) => item.barcode === parsedTag.barcode) === null){
    return false
  }
  else if(barcodeOfItemNotSoldInUnit.indexOf(parsedTag.barcode)===-1 && Math.ceil(parsedTag.quantity) !== parsedTag.quantity){
    return false
  }
  else{
    return true
  }
}

function parseOneTag(tag: string): Tag | null{
  let parsedTag:Tag
  const allItems = loadAllItems()
  const barcodeOfItemNotSoldInUnit: string[] = ['ITEM000002', 'ITEM000003']

  if(tag.includes('-')){
    const splitTag:string[] = tag.split('-')
    parsedTag = {
      barcode: splitTag[0],
      quantity: Number(splitTag[1])
    }

  }
  else{
    parsedTag = {
      barcode: tag,
      quantity: 1
    }
  }

  if(isTagValid(parsedTag, allItems, barcodeOfItemNotSoldInUnit)){
    return parsedTag
  }
  else{
    return null
  }
}

//function generateUniqueParsedTags(parsedTags: Tag[]): Tag[]{

//   const uniqueParsedTags
//   return uniqueParsedTags
// }

function parseTags(tags: string[]): Tag[] | null{
  const parsedTags:Tag[] =[]
  for(const tag in tags){
    const parsedTag = parseOneTag(tag)
    if(parsedTag === null){
      return null
    }
    parsedTags.push(parsedTag)
  }
  return parsedTags
}


function generateReceiptItems(tags: Tag[]): ReceiptItem[]{

  const allItems: Item[] = loadAllItems()
  const promotions: Promotion[] = loadPromotions()

  function generateReceiptItem(tag: Tag):ReceiptItem{
    const discount = 0
    const itemInfo = allItems.find((item) => item.barcode === tag.barcode)

    const receiptItem: ReceiptItem ={
      name: tag.barcode,
      quantity: {value:tag.quantity, quantifier:itemInfo!.unit},
      unitPrice: itemInfo!.price,
      subtotal: tag.quantity * itemInfo!.price - discount,
      discountedPrice: discount
    }
    return receiptItem
  }
  const receiptItems = tags.map(tag => generateReceiptItem(tag))
  return receiptItems
}

function renderReceipt(receiptItems: ReceiptItem[]): string{
  let receipt = '***<store earning no money>Receipt ***' + '\n'
  const itemList = receiptItems.map(item =>
    `Name: ${item.name}, Quantity: ${item.quantity.value} ${item.quantity.quantifier}, Unit: ${item.unitPrice}(yuan), Subtotal: ${item.subtotal}(yuan)`
  ).join('\n')
  receipt += itemList

  let total = 0
  let discountedPrice = 0
  receiptItems.forEach((item)=>{
    total+=item.subtotal
    discountedPrice += item.discountedPrice
  })
  receipt+=`
  ----------------------
  Total: ${total}(yuan)
  Discounted price: ${discountedPrice}(yuan)
  **********************`
  return receipt
}
