export interface Quantity {
    value: number;
    quantifier:string
}

export interface ReceiptItem {
    name: string;
    quantity:Quantity;
    unitPrice:number;
    subtotal:number;
    discountedPrice:number

}

export interface Tag {
    quantity: number
    barcode:string
}
