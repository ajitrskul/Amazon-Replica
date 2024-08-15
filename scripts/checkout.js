import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js'

//reccomended to use promises instead of callbacks
new Promise((resolve) => {
  //start
  loadProducts(() => {
    //load products
    resolve(); //call resolve to go next function
  });
}).then(() => {
  //after products loaded
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});

/*
loadProducts(() => { //callback
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
Consecutive promises:
new Promise((resolve) => {
  loadProducts(() => { //step 1 
    resolve();
  })
}).then(() => {
  return new Promise ((resolve) => {
    loadCart(() => { //step 2
      resolve();
    });  
  })
}).then(() => {
  return new Promise ((resolve) => {
    loadOrders(() => { //step 3
      resolve();
    })  
  })  
}).then(() => {

});


Can pass values into resolve:
new Promise((resolve) => {
  loadProducts(() => { //step 1 
    resolve(value);
  })
}).then((value) => { //value from above
  return new Promise ((resolve) => {
    loadCart(() => { //step 2
      resolve();
    });  
  })
})


If we have multiple promises that can occur at the same time we can use:
new Promise.all({
  new Promise((resolve) => {
    loadProducts(() => {
      resolve();  
    })
  }),
  new Promise ((resolve) => {
    resolve();
  })
}).then(() => {
  //will happen after first two promises above are both finished
})
*/