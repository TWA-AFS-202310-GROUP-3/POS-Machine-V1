import { generateTag, printReceipt } from '../src/PrintReceipt';


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
      { item: 'ITEM000003', quantity: '2.5' },
      { item: 'ITEM000005', quantity: 1 },
      { item: 'ITEM000005', quantity: '2' }
    ]
    ;
    expect(generateTag(tags)).toEqual(expectedResult);
  });
});
