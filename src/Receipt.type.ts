export interface ItemQuantity {
	value: number,
	unit: string
}
export interface ReceiptItem {
	name: string;
	quantity: ItemQuantity,
	unitPrice: number,
	subtotal: number,
	discount: number
}

export interface Tag {
	item: string;
	quantity: string
}
