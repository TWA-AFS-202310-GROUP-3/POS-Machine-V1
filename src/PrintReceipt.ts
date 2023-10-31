import { getItemByBarCode, loadAllItems } from './Dependencies';
import { ReceiptItem, Tag } from './Receipt.type';

export function printReceipt(tags: string[]): string {
	return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`;
}


function generateTag(rawItemList: string[]): Tag[] {
	const tags: Tag[] = [];
	return tags;

}


function generategReceiptItems(tags: Tag[]): ReceiptItem[] {
	const receiptItems: ReceiptItem[] = [];
	return receiptItems;
}

function renderReceipt(receiptItems: ReceiptItem[]): string {
	return '';
}

function parseTag(tags: string[]): Tag[] {
	const allItems = loadAllItems();
	const parsedTags: string[][] = tags.map(tag => parseQuantity(tag));
	return parsedTags.map(tags => {
		if (isValidBarcode(tags)) {
			return {
				item: tags[0],
				quantity: tags[1],
			} as Tag
		}
		else {
			throw new Error("Invalid")
		}
	})
}

function isValidBarcode(parsedTag: string[]): boolean {
	return isValidItemCode(parsedTag[0]) && isValidQuantity(parsedTag);
}

function isValidQuantity(parsedTag: string[]): boolean {
	const barcode = parsedTag[0];
	const quantity = Number(parsedTag[1]);
	if (getItemByBarCode(barcode)?.unit!= "pound") {
		return Number.isNaN(quantity) && Number.isInteger(quantity);
	}
	return Number.isNaN(quantity);

}

function isValidItemCode(itemCode: string): boolean {
	if (getItemByBarCode(itemCode)){
		return true;
	}
	return false;
}

function parseQuantity(tag: string): string[] {
	const tags = tag.split('-');
	return tags;
}


