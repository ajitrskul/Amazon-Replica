import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts, loadProductsFetch} from '../data/products.js';
import {loadCart} from '../data/cart.js';

//async await allows us to write async code like normal code
async function loadPage() { //async makes a function return a promise
  console.log('load page');
  try { //how to handle errors in async await
    //throw 'error1'; <-- how to manually create an error to go to catch
    await loadProductsFetch(); //can only use await inside an async function (closest function must be async)
    await new Promise((resolve, reject) => { //reject() is a function that lets us throw an error in the future
      //throw 'error2'; <-- manually create an error in a promise
      loadCart(() => {
        //reject('error3'); <== manually create error in the future
        resolve();
      });
    });
  }
  catch (error) { //error contains info about error
    console.log('Unexpected error. Please try again later.');
  }

  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })
]).then((values) => {
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
})
*.

/*
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
*/

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
Promise.all({
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