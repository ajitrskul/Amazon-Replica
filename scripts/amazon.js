import {cart, addToCart, calculateCartQuantity} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
//import * as cartModule from '../test.js'  | will import everything from file inside a cartModule object

loadProducts(renderProductsGrid);

export function renderProductsGrid() {
  let productsHTML = '';

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}">
          Add to Cart
        </button>
      </div>`;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHTML;
  updateCartQuantity();

  function updateCartQuantity() {
    const cartQuantity = calculateCartQuantity();

    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
  }

  function addToCartMsg(prevAddItemTimer,productId) {
    let addedMessage = document.querySelector(`.js-added-to-cart-${productId}`); //creates added to cart msg
    addedMessage.classList.add('item-added');

    if (prevAddItemTimer) {
      clearTimeout(prevAddItemTimer); //when adding to cart same item twice
    }
    prevAddItemTimer = setTimeout(() => {
      addedMessage.classList.remove('item-added');
    },2000);
    return prevAddItemTimer;
  }

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      let prevAddItemTimer;

      button.addEventListener('click', () => {
        const {productId} = button.dataset; //gets productid from button data
        const quantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value); //gets quantity of items from selector
      
        addToCart(productId, quantity); //adds product to cart array
        updateCartQuantity(); //updates cart display html
        prevAddItemTimer = addToCartMsg(prevAddItemTimer,productId); //displays add to cart msg
      })
    });
}

