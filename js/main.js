'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';


const RED_COLOR="#ff0000";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const containerPromo = document.querySelector('.container-promo');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('userName');


//авторизация
function toggleModal() {
  modal.classList.toggle("is-open");
}
function toggleModalAuth() {
    modalAuth.classList.toggle('is-open');
    loginInput.style.borderColor = '';
    //убираем скролл при открытом модельном окне
    if (modalAuth.classList.contains('is-open')) {
        disableScroll();// в файле отдельном функция
    } else {
        enableScroll();
    }
}

function autorized() {

    function logOut() {
        login = null;
        localStorage.removeItem('userName');
        buttonAuth.style.display = '';
        buttonOut.style.display = '';
        userName.style.display = '';
        buttonOut.removeEventListener('click', logOut);
        checkAuth();

    }

    console.log('Autorized');
    userName.textContent = login;
    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'block';
    userName.style.display = 'inline';
    buttonOut.addEventListener("click", logOut);
}

function notAutorized() {
    console.log("NOT autorized");

    function logIn(event) {
        event.preventDefault();
        if (loginInput.value.trim()) {
            login = loginInput.value;
            localStorage.setItem('userName', login);
            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            loginForm.removeEventListener("submit", logIn);
            loginForm.reset();
            checkAuth();
        } else {
            loginInput.style.borderColor = RED_COLOR;
            loginInput.value = '';
        }
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    loginForm.addEventListener("submit", logIn);
    modalAuth.addEventListener('click', function (event) {
        if (event.target.classList.contains('is-open')) {
            toggleModalAuth();
        }
    })
}

function checkAuth() {
    if (login) {
        autorized();
    } else {
        notAutorized()
    }
}



// рендеринг карточек магазинов и товаров

function createCardRestaurant() {
    let card = `
      <a  class=" card card-restaurant">
         <img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
        <div class="card-text">
           <div class="card-heading">
              <h3 class="card-title">Тануки</h3>
                <span class="card-tag tag">60 мин</span>
             </div>
         <div class="card-info">
         <div class="rating">4.</div>
          <div class="price">От 1 200 ₽</div>
         <div class="category">Суши, роллы</div>
        </div>  
        </div>      
       </a>      
       
   `
    ;

    cardsRestaurants.insertAdjacentHTML("beforeend", card);
}


function createCardGood() {
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `

<img src="img/pizza-plus/pizza-girls.jpg" alt="image" class="card-image"/>
<div class="card-text">
    <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Девичник</h3>
    </div>
     <div class="card-info">
     <div class="ingredients">Соус томатный, постное тесто, нежирный сыр, кукуруза, лук, маслины,
                              грибы, помидоры, болгарский перец.
     </div>
     </div>
   <div class="card-buttons">
         <button class="button button-primary button-add-cart">
             <span class="button-cart-svg"></span>
         </button>
         <strong class="card-price-bold">450 ₽</strong>
    </div>
</div>
  `
    );
    cardsMenu.insertAdjacentElement('beforeend',card);
}


function openGoods(event) {
  const target = event.target;
  if(login){
  const restaurant = target.closest('.card-restaurant');

  if (restaurant) {
    cardsMenu.textContent = '';
    restaurants.classList.add('hide');
    containerPromo.classList.add('hide');
    menu.classList.remove('hide');

    createCardGood();
    createCardGood();
    createCardGood();
  }
}else{
  toggleModalAuth();
  }
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);


cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', function () {
    restaurants.classList.remove('hide');
    containerPromo.classList.remove('hide');
    menu.classList.add('hide');
});

checkAuth();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();


new Swiper('.swiper-container',{
    slidePerView:1,
    loop:true,
    autoplay:true,
});
