export interface ItemInfo {
  barcode: string;
  name: string;
  unit: string;
  price: number;
}

export interface ReceiptItem {
  barcode: string;
  quantity: number;
  subtotal?: number;
  discountPrice?: number;
  itemInfo?: ItemInfo;
}

export interface Promotions {
  type: string;
  barcodes: string[];
}