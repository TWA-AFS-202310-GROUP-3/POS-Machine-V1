import { checkPromotionsExist, getItemByBarCode } from './Dependencies';
import { ReceiptItem, Tag } from './Receipt.type';

export function printReceipt(tags: string[]): string {

  const generatedTag: Tag[] = generateTag(tags);
  const receiptionList: ReceiptItem[] = generateReceiptItems(generatedTag);
  const renderedList = renderReceiptList(receiptionList);
  let total = 0;
  let discount = 0;
  receiptionList.forEach( item => total+=item.subtotal);
  receiptionList.forEach( item => discount+=item.discount);
  return `***<store earning no money>Receipt ***
${renderedList}
----------------------
Total：${total.toFixed(2)}(yuan)
Discounted prices：${discount.toFixed(2)}(yuan)
**********************`
}


export function generateTag(rawItemList: string[]) {
  console.log(parseTag(rawItemList));
  return parseTag(rawItemList);
}

function renderReceiptList(receiptItems: ReceiptItem[]): string {
  return receiptItems.map(item => `Name：${item.name}，Quantity：${item.quantity} ${item.unit}${item.quantity>1?'s':''}，Unit：${item.unitPrice.toFixed(2)}(yuan)，Subtotal：${item.subtotal.toFixed(2)}(yuan)`).join('\n');
}

export function parseTag(tags: string[]): Tag[] {
  const parsedTags: string[][] = tags.map(tag => parseQuantity(tag));
  return parsedTags.map(tags => {
    if (isValidBarcode(tags)) {
      return {
        item: tags[0],
        quantity: tags[1] ?? 1
      } as Tag;
    } else {
      throw new Error('Invalid');
    }
  });
}

export function generateReceiptItems(tags: Tag[]): ReceiptItem[] {
  const receiptItems: ReceiptItem[] = transferTagToReceiptItem(tags);
  const itemsWithDiscount: ReceiptItem[] = calculateDiscount(receiptItems);
  const finalReceiptItems: ReceiptItem[] = calculateItemSubtotal(itemsWithDiscount);
  console.log(finalReceiptItems);
  return receiptItems;
}

function transferTagToReceiptItem(tags: Tag[]): ReceiptItem[] {
  const receiptItems: ReceiptItem[] = [];

  tags.forEach(tag => {
    const addedItem = receiptItems.find(item => item.barcode === tag.item);
    if (addedItem) {
      addedItem.quantity += Number(tag.quantity);
    } else {
      const item = getItemByBarCode(tag.item);
      if (item) {
        receiptItems.push({
          name: item.name,
          barcode: item.barcode,
          quantity: Number(tag.quantity),
          unitPrice: item.price,
          unit: item.unit,
          discount: 0,
          subtotal: 0
        });
      }
    }
  });
  return receiptItems;
}

function calculateDiscount(receiptItems: ReceiptItem[]): ReceiptItem[] {
  return receiptItems.map(receiptItem => {
    if (checkPromotionsExist(receiptItem.barcode)) {
      receiptItem.discount = receiptItem.unitPrice * Math.floor(receiptItem.quantity / 3);
    }
    return receiptItem;
  });
}

function calculateItemSubtotal(receiptItems: ReceiptItem[]): ReceiptItem[] {
  return receiptItems.map(receiptItem => {
    receiptItem.subtotal = receiptItem.quantity * receiptItem.unitPrice - receiptItem.discount;
    return receiptItem;
  });
}

function isValidBarcode(parsedTag: string[]): boolean {
  return isValidItemCode(parsedTag[0]) && isValidQuantity(parsedTag);
}

function isValidQuantity(parsedTag: string[]): boolean {
  const barcode = parsedTag[0];
  if (parsedTag.length === 1) return true;
  const quantity = Number(parsedTag[1]);
  if (!Number.isNaN(quantity)) {
    if (getItemByBarCode(barcode)?.unit !== 'pound') {
      return Number.isInteger(quantity);
    }
    return true;
  }
  return false;

}

function isValidItemCode(itemCode: string): boolean {
  if (getItemByBarCode(itemCode)) {
    return true;
  }
  return false;
}

function parseQuantity(tag: string): string[] {
  const tags = tag.split('-');
  return tags;
}


