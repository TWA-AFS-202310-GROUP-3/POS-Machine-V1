import {printReceipt} from '../src/PrintReceipt'

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
      'ITEM000005-2',
    ]

    const expectText = `***<store earning no money>Receipt ***
Name: Sprite, Quantity: 5 bottles, Unit: 3.00(yuan), Subtotal: 15.00(yuan)
Name: Litchi, Quantity: 2.5 bottles, Unit: 15.00(yuan), Subtotal: 37.50(yuan)
Name: Instant Noodles, Quantity: 3 bottles, Unit: 4.50(yuan), Subtotal: 13.50(yuan)
----------------------
Total: 66.00(yuan)
Discounted prices: 7.50(yuan)
**********************`

    expect(printReceipt(tags)).toEqual(expectText)
  })
})
