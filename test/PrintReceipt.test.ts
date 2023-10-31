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
  Name:Sprite,Quantity:5 bottle,Unit:3(yuan),Subtotal:12(yuan)
  Name:Litchi,Quantity:2.5 pound,Unit:15(yuan),Subtotal:37.5(yuan)
  Name:Instant Noodles,Quantity:3 bag,Unit:4.5(yuan),Subtotal:9(yuan)
----------------------
  Total: 58.50(yuan)
  Discounted prices: 7.50(yuan)
  **********************`

    expect(printReceipt(tags)).toEqual(expectText)

  })

})
