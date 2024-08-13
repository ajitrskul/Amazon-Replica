import {cart, removeFromCart, calculateCartQuantity, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
  <div class="cart-item-container 
  js-cart-item-container-${matchingProduct.id}">
    <div class="delivery-date">
      Delivery date: Tuesday, June 21
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image"
        src="${matchingProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-link" 
          data-product-id="${matchingProduct.id}">
            Update
          </span>
          <input class="quantity-input js-quantity-input">
          <span class="save-quantity-link link-primary js-save-link"
          data-product-id="${matchingProduct.id}">Save</span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
        <div class="quantity-warning js-quantity-warning-${matchingProduct.id}"></div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
})

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;
updateCheckOutQuantity();

function updateCheckOutQuantity() {
  const checkOutQuantity = calculateCartQuantity(); //gets current cart quantity

  document.querySelector('.js-checkout-quantity') //updates checkout header
    .innerHTML = `${checkOutQuantity} items`;
}

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId; //gets productid from delete button data
      removeFromCart(productId); //removes item from cart array
      
      const container = document.querySelector(`.js-cart-item-container-${productId}`); //gets html element we want to delete
      container.remove(); //deletes item from html
      updateCheckOutQuantity();
    });
  });

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId; //gets product id from update button data
        
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      });
    });

    document.querySelectorAll('.js-save-link')
      .forEach((link) => {
        link.addEventListener('click', () => {
          const productId = link.dataset.productId;

          const container = document.querySelector(`.js-cart-item-container-${productId}`);

          const newQuantity = Number(document.querySelector('.js-quantity-input').value);
          if (newQuantity > 0 && newQuantity < 1000) {
            updateQuantity(productId, newQuantity);
            updateCheckOutQuantity();
            document.querySelector(`.js-quantity-label-${productId}`)
              .innerHTML = newQuantity; 
            container.classList.remove('is-editing-quantity');
          }
          else {
            const quantityWarning = document.querySelector(`.js-quantity-warning-${productId}`);
            if (newQuantity === 0) {
              quantityWarning.innerHTML = 'Are you sure you would like to delete this item? <button class="update-cart-confirm-button js-update-cart-yes-button">Yes</button><button class="update-cart-confirm-button js-update-cart-no-button">No</button>';
              document.querySelector('.js-update-cart-yes-button')
                .addEventListener('click', () => {
                  removeFromCart(productId);
                  document.querySelector(`.js-cart-item-container-${productId}`).remove();
                  updateCheckOutQuantity();
                });
              document.querySelector('.js-update-cart-no-button')
                .addEventListener('click', () => {
                  quantityWarning.innerHTML = '';
                });
            }
            else {
              quantityWarning.innerHTML = 'Invalid Quantity';
              setTimeout(() => {
                quantityWarning.innerHTML = '';
              },2000);  
            }  
          }
          document.querySelector('.js-quantity-input').value = '';
        })
      });