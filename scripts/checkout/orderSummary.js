import {cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; //default export vs named export (wihout curly bracket vs with curly bracket) (to import from internet is called an ESM (EcmaScript Module) import)
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import {renderPaymentSummary} from './paymentSummary.js';

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

    cartSummaryHTML += `
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
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
            <input class="quantity-input js-quantity-input-${matchingProduct.id} js-quantity-input" data-product-id="${matchingProduct.id}">
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
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  })

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
  
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;
      
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
  
      html += `
      <div class="delivery-option js-delivery-option" 
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `
    });
    return html;
  }
  
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
        renderPaymentSummary();
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
  
  function saveCheckOutUpdate(saveElement) {
    const productId = saveElement.dataset.productId;

    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
    if (newQuantity > 0 && newQuantity < 1000) {
      updateQuantity(productId, newQuantity);
      updateCheckOutQuantity();
      renderPaymentSummary();
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
            renderPaymentSummary();
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
    document.querySelector(`.js-quantity-input-${productId}`).value = '';
  }

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        saveCheckOutUpdate(link);
      })
    });

    document.querySelectorAll('.js-quantity-input')
      .forEach((quantityInput) => {
        quantityInput.addEventListener('keydown', (key) => {
          console.log(key);
          if (key.key === 'Enter') {
            saveCheckOutUpdate(quantityInput);
          }
        });
      });
  
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      })
  });
}

//MVC -> Model-View-Controller -> technique for creating interactive websites

