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

  const uniqueParsedTags = parseTags(tags)
  if(uniqueParsedTags === null){
    return 'Tags are invalid, please check it!'
  }
  const receiptItems = generateReceiptItems(uniqueParsedTags)
  const receipt = renderReceipt(receiptItems)
  return receipt
}

function parseTags(tags: string[]): Tag[] | null{
  const parsedTags:Tag[] =[]
  for(const tag of tags){
    const parsedTag = parseOneTag(tag)
    if(parsedTag === null){
      return null
    }
    parsedTags.push(parsedTag)
  }
  const uniqueParsedTags = generateUniqueParsedTags(parsedTags)
  return uniqueParsedTags
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

function generateUniqueParsedTags(parsedTags: Tag[]): Tag[]{
  const uniqueParsedTags: Tag[] = []
  for(const i in parsedTags){
    if(uniqueParsedTags.find((item)=> item.barcode === parsedTags[i].barcode) === undefined){
      uniqueParsedTags.push({barcode: parsedTags[i].barcode, quantity: 0})
    }
    uniqueParsedTags.map(item =>{
      if(item.barcode === parsedTags[i].barcode){
        item.quantity += parsedTags[i].quantity
        return item
      }
      else{
        return item
      }
    })
  }
  return uniqueParsedTags
}


function generateReceiptItems(tags: Tag[]): ReceiptItem[]{
  const allItems: Item[] = loadAllItems()
  const promotions: Promotion[] = loadPromotions()
  const receiptItems = tags.map(tag => generateReceiptItem(tag, allItems, promotions))
  return receiptItems
}

function generateReceiptItem(tag: Tag, allItems: Item[], promotions: Promotion[]):ReceiptItem{
  let discount = 0
  let discountQ = tag.quantity
  const itemInfo = allItems.find((item) => item.barcode === tag.barcode)

  for(const j in promotions){
    if(promotions[j].barcodes.indexOf(tag.barcode) > -1){
      // tag.quantity =
      const less = Math.floor(tag.quantity / 3)
      discountQ = tag.quantity  - less
      discount = itemInfo!.price * less
    }
  }

  const receiptItem: ReceiptItem ={
    name: itemInfo!.name,
    quantity: {value:tag.quantity, quantifier:itemInfo!.unit},
    unitPrice: itemInfo!.price,
    subtotal: discountQ * itemInfo!.price,
    discountedPrice: discount
  }
  return receiptItem
}

function renderReceipt(receiptItems: ReceiptItem[]): string{
  let receipt = '***<store earning no money>Receipt ***' + '\n'
  const itemList = receiptItems.map(item =>
    `Name：${item.name}，Quantity：${item.quantity.value} ${item.quantity.quantifier}s，Unit：${item.unitPrice.toFixed(2)}(yuan)，Subtotal：${item.subtotal.toFixed(2)}(yuan)`
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
Total：${total.toFixed(2)}(yuan)
Discounted prices：${discountedPrice.toFixed(2)}(yuan)
**********************`
  return receipt
}

