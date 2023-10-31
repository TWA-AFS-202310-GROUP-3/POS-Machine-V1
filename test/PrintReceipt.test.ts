import { generateReceiptItems, generateTag, printReceipt } from '../src/PrintReceipt';
import { Tag } from '../src/Receipt.type';


describe('printReceipt', () => {
  it('should print receipt with promotion when print receipt', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2'
    ];

    const expectText = `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`;

    expect(printReceipt(tags)).toEqual(expectText);
  });
  it('should parse raw tag to Tag item', () => {
    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2'
    ];
    const expectedResult = [
      { item: 'ITEM000001', quantity: 1 },
      { item: 'ITEM000001', quantity: 1 },
      { item: 'ITEM000003', quantity: 2.5 },
      { item: 'ITEM000005', quantity: 1 },
      { item: 'ITEM000005', quantity: 2 }
    ]
    ;
    expect(generateTag(tags)).toEqual(expectedResult);
  });
  it('should generate receiptItem by tag', () => {
    const tags: Tag[] = [
      { item: 'ITEM000001', quantity: 1 },
      { item: 'ITEM000001', quantity: 1 },
      { item: 'ITEM000003', quantity: 2.5 },
      { item: 'ITEM000005', quantity: 1 },
      { item: 'ITEM000005', quantity: 2 }
    ];
    const expected = [
      {
        name: 'Sprite',
        barcode: 'ITEM000001',
        quantity: 2,
        unitPrice: 3,
        unit: 'bottle',
        discount: 0,
        subtotal: 6
      },
      {
        name: 'Litchi',
        barcode: 'ITEM000003',
        quantity: 2.5,
        unitPrice: 15,
        unit: 'pound',
        discount: 0,
        subtotal: 37.5
      },
      {
        name: 'Instant Noodles',
        barcode: 'ITEM000005',
        quantity: 3,
        unitPrice: 4.5,
        unit: 'bag',
        discount: 4.5,
        subtotal: 9
      }
    ];
    expect(generateReceiptItems(tags)).toEqual(expected);
  });
});
