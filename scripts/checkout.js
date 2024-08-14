import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js'

/*new Promise(() => {
  console.log('promise');
});*/

loadProducts(() => { //callback
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});
