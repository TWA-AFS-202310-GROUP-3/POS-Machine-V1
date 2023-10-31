import { loadAllItems, loadPromotions } from './Dependencies';
import { ItemInfo, ReceiptItem, Promotions } from './model';

export function printReceipt(items: string[]): string {
  const allItems = loadAllItems();
  const promotionInfo = loadPromotions();

  const parsedItems = parseQuantity(items);
  const addedItems = addItemInfo(parsedItems, allItems);
  const subtotalPrice = computeSubtotal(addedItems);
  const discountPrice = computeDiscountPrice(subtotalPrice, promotionInfo);
  const receipt = generateReceipt(discountPrice);

  return receipt;
}

function parseQuantity(items: string[]): ReceiptItem[] {
  
  const itemMap = new Map<string, number>();
  for (const item of items) {
    const [barcode, quantity] = item.split('-');
    const parsedQuantity = Number(quantity) || 1; // item with no - quantity default = 1
    if (!itemMap.has(barcode)) {
      itemMap.set(barcode, parsedQuantity); // create new item in the Map
    } else {
      const currentQuantity = itemMap.get(barcode);
      if (currentQuantity !== undefined) {
        itemMap.set(barcode, currentQuantity + parsedQuantity); // add quantity for the existed item
      }
    }
  }
  const result = Array.from(itemMap).map(([barcode, quantity]) => ({ barcode, quantity })); // transform the [[]] to [{}]
  return result;
}


function addItemInfo(items: ReceiptItem[], allItems: ItemInfo[]): ReceiptItem[] {
  const itemsMap = new Map(allItems.map(item => [item.barcode, item])); //copy the allItemInfo into a map
  return items.map(item => {
    const matchedItem = itemsMap.get(item.barcode); // find the matched item
    if (matchedItem) {
      item.itemInfo = matchedItem;
    }
    return item;
  }).filter(item => item.itemInfo);
}

function computeSubtotal(receiptItems: ReceiptItem[]): ReceiptItem[] {
  return receiptItems.map(item => {
    const { itemInfo, quantity } = item; // auto match the property
    const totalPrice = itemInfo ? itemInfo.price * quantity! : 0;
  
    return { ...item, totalPrice };
  });
}

function computeDiscountPrice(items: ReceiptItem[], promotions: Promotions[]): ReceiptItem[] {
  return items.map(item => {
    const promotion = promotions.find(promotion => promotion.barcodes.includes(item.barcode));
    const { quantity, itemInfo } = item; // auto match the property
    if (promotion?.type === 'BUY_TWO_GET_ONE_FREE') {  // the type is nonesense actually
      const discountedQuantity = Math.floor(quantity / 3);
      const discount = discountedQuantity * (itemInfo!.price || 0);
      return { ...item, discount };
    }
    return {...item, discount: 0}
  });
}

function generateReceipt(items: ReceiptItem[]): string {
  let receipt = '***<store earning no money>Receipt ***\n';
  let total = 0;
  let discountedPrices = 0;

  items.forEach(item => {
    const unit = item.itemInfo!.unit;
    const unitText = item.quantity! > 1 ? (item.itemInfo!.unit !== '' ? `${unit}s` : unit) : (item.itemInfo!.unit !== '' ? `${unit}s` : unit);

    const itemTotalPrice = (item.subtotal! - item.discountPrice!);
    total += itemTotalPrice;
    discountedPrices += item.discountPrice!;

    receipt += `Name: ${item.itemInfo!.name}, Quantity: ${item.quantity} ${unitText}, Unit: ${item.itemInfo!.price.toFixed(2)}(yuan), Subtotal: ${itemTotalPrice.toFixed(2)}(yuan)\n`;
  });

  receipt += '----------------------\n';

  const totalFormatted = total.toFixed(2);
  receipt += `Total: ${totalFormatted}(yuan)\n`;

  const discountedPricesFormatted = discountedPrices.toFixed(2);
  receipt += `Discounted prices: ${discountedPricesFormatted}(yuan)\n`;
  receipt += '**********************';

  return receipt;
}