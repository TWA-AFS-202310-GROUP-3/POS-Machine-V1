export interface ReceiptItem {
	name: string;
	barcode: string;
	quantity: number,
	unit: string;
	unitPrice: number,
	subtotal: number,
	discount: number
}

export interface Tag {
	item: string;
	quantity: number
}
