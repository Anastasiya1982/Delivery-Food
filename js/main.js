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

//запрос на сервер

const getData = async function (url) {
    const response = await fetch(url);

    if(!response.ok){
        throw  new Error(`Ошибка по адресу ${url},   статус ошибки ${response.status}!`)
    }

   return  await response.json();
};

console.log(getData('./db/partners.json'));

//авторизация
const  toggleModal=function() {
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
function validName(str){
    const regName=/^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return regName.test(str);
}



function notAutorized() {
    function logIn(event) {
        event.preventDefault();
        if (validName(loginInput.value)) {
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

function createCardRestaurant(restaurant) {

    //деструктурируем объект
    const { image,
        kitchen,
        name,
        price,
        products,
        stars,
        time_of_delivery:timeOfDelivery
    } = restaurant;

    let card = `
      <a  class=" card card-restaurant" data-products="${products}">
         <img src="${image}" alt="image" class="card-image"/>
        <div class="card-text">
           <div class="card-heading">
              <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery}</span>
             </div>
         <div class="card-info">
         <div class="rating">${stars}</div>
          <div class="price">${price} P</div>
         <div class="category">${kitchen}</div>
        </div>  
        </div>      
       </a>      
       
   `
    ;

    cardsRestaurants.insertAdjacentHTML("beforeend", card);
}


function createCardGood(goods) {
    const { id,name,description, price,image } = goods;

    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `

<img src="${image}" alt="image" class="card-image"/>
<div class="card-text">
    <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
    </div>
     <div class="card-info">
     <div class="ingredients">${description}
     </div>
     </div>
   <div class="card-buttons">
         <button class="button button-primary button-add-cart">
             <span class="button-cart-svg"></span>
         </button>
         <strong class="card-price-bold">${price} P</strong>
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
      getData(`./db/${restaurant.dataset.products}`).then((data)=>{
          data.forEach(createCardGood);
      });


  }
}else{
  toggleModalAuth();
  }
}

function init(){
    getData('./db/partners.json').then((data)=>{
        data.forEach(createCardRestaurant);
    });
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



//Slider
new Swiper('.swiper-container',{
    slidePerView:1,
    loop:true,
    autoplay:true,
    cubeEffect:{
        shadow:false,
    },

    pagination: {
        el: '.swiper-pagination',
        clickable:true,
    },
});
init();
