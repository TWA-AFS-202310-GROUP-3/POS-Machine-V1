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

export function printReceipt(tags: string[]): string {

  const parsedTags = parseTags(tags)
  const receiptItems = generateReceiptItems(parsedTags)
  const receipt = renderReceipt(receiptItems)
  return receipt
}

function parseQuantity(tag: string): number
{

}
function parseTags(tags: string[]): Tag[]
{
  const parsedTags:Tag[] =[]
  for(const tag in tags){
    const quantity = parseQuantity(tag)
    const parsedTag:Tag={
      barcode: tag.slice(0,10),
      quantity: quantity
    }
    parsedTags.push(parsedTag)
  }
  return parsedTags
}

function generateReceiptItems(tags: Tag[]): ReceiptItem[]
{
  return receiptItems
}
function renderReceipt(receiptItems: ReceiptItem[]): string{
  return receipt
}
