export function loadAllItems() {
	return [
		{
			barcode: 'ITEM000000',
			name: 'Coca-Cola',
			unit: 'bottle',
			price: 3.00
		},
		{
			barcode: 'ITEM000001',
			name: 'Sprite',
			unit: 'bottle',
			price: 3.00
		},
		{
			barcode: 'ITEM000002',
			name: 'Apple',
			unit: 'pound',
			price: 5.50
		},
		{
			barcode: 'ITEM000003',
			name: 'Litchi',
			unit: 'pound',
			price: 15.00
		},
		{
			barcode: 'ITEM000004',
			name: 'Battery',
			unit: 'a',
			price: 2.00
		},
		{
			barcode: 'ITEM000005',
			name: 'Instant Noodles',
			unit: 'bag',
			price: 4.50
		}
	];
}

export function loadPromotions() {
	return [
		{
			type: 'BUY_TWO_GET_ONE_FREE',
			barcodes: [
				'ITEM000000',
				'ITEM000001',
				'ITEM000005'
			]
		}
	];
}

export function getItemByBarCode(barcode: string) {
  const items = loadAllItems();
  return items.find(item => item.barcode ===barcode);
}

export function checkPromotionsExist(barcode: string) {
  const promotions = loadPromotions();
  return promotions.findIndex(promotion => promotion.barcodes.find(code => code === barcode))>-1;
}
