import { loadAllItems } from '../src/Dependencies'
import {generateReceiptItems, insertTag, isCodeValid, loadProductsAndPromotionCodes, printReceipt, Product, ReceiptItem, render, Tag} from '../src/PrintReceipt'

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

describe('render', () => {
  it('should print receipt with promotion when print receipt', () => {
    const receiptItems = [
      {
        name: 'Sprite',
        unit: 'bottle',
        quantity: 5,
        price: 3,
        subtotal: 15,
        discountedPrice: 12
      },
      {
        name: 'Litchi',
        unit: 'pound',
        quantity: 2.5,
        price: 15,
        subtotal: 37.5,
        discountedPrice: 37.5
      },
      {
        name: 'Instant Noodles',
        unit: 'bag',
        quantity: 3,
        price: 4.5,
        subtotal: 13.5,
        discountedPrice: 9
      }
    ]

    const expectText = `***<store earning no money>Receipt ***
  Name:Sprite,Quantity:5 bottle,Unit:3(yuan),Subtotal:12(yuan)
  Name:Litchi,Quantity:2.5 pound,Unit:15(yuan),Subtotal:37.5(yuan)
  Name:Instant Noodles,Quantity:3 bag,Unit:4.5(yuan),Subtotal:9(yuan)
----------------------
  Total: 58.50(yuan)
  Discounted prices: 7.50(yuan)
  **********************`

    expect(render(receiptItems)).toEqual(expectText)

  })

})

describe('generateReceiptItems', () => {
  it('should generate ReceiptItems array from Tags[]', () => {
    
    let receiptItems : ReceiptItem[] = []
    const parsedTags : Tag[] = [{ barcode: 'ITEM000001', quantity: 5 },
    { barcode: 'ITEM000003-2.5', quantity: 2.5 },
    { barcode: 'ITEM000005', quantity: 3 }]

    generateReceiptItems(parsedTags, receiptItems)
    
    const expectReceiptItems = [{
      name: 'Sprite',
      unit: 'bottle',
      quantity: 5,
      price: 3,
      subtotal: 15,
      discountedPrice: 12
    },
    {
      name: 'Litchi',
      unit: 'pound',
      quantity: 2.5,
      price: 15,
      subtotal: 37.5,
      discountedPrice: 37.5
    },
    {
      name: 'Instant Noodles',
      unit: 'bag',
      quantity: 3,
      price: 4.5,
      subtotal: 13.5,
      discountedPrice: 9
    }]

    expect(receiptItems).toEqual(expectReceiptItems)

  })

})

describe('loadProductsAndPromotionCodes', () => {
  it('should generate promotionCodes list from Promotion List and products list from getAllItems', () => {
    
    let allproducts : Product[] = []
    let promotionCodes : string[] = []
    loadProductsAndPromotionCodes(allproducts, promotionCodes)
    let expectCodes = [ 'ITEM000000', 'ITEM000001', 'ITEM000005' ]

    expect(allproducts).toEqual(loadAllItems())
    expect(promotionCodes).toEqual(expectCodes)
  })

})

describe('loadProductsAndPromotionCodes', () => {
  it('should generate promotionCodes list from Promotion List and products list from getAllItems', () => {
    
    let allproducts : Product[] = []
    let promotionCodes : string[] = []
    loadProductsAndPromotionCodes(allproducts, promotionCodes)
    let expectCodes = [ 'ITEM000000', 'ITEM000001', 'ITEM000005' ]

    expect(allproducts).toEqual(loadAllItems())
    expect(promotionCodes).toEqual(expectCodes)
  })

})



describe('isCodeValid', () => {
  it('should validate the code input, if the code is valid then return true otherwise false', () => {
    const code = 'ITEM000001'
    const result = isCodeValid(code)

    expect(result).toEqual(true)
  })

})

describe('insertTag', () => {
  it('should add the valid tag into the tag list, if the tag is new create new entry, otherwise increase the quanity', () => {
    let parsedTags : Tag[] = []
    const tag = "ITEM000001"
    const expectTags = [{ barcode: 'ITEM000001', quantity: 1 }]

    insertTag(tag, parsedTags)

    expect(parsedTags).toEqual(expectTags)
  })

})