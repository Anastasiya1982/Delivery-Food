'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';

//Slider

const swiper= new Swiper('.swiper-container', {
        slidePerView: 1,
        loop: true,
        autoplay: true,
        cubeEffect: {
            shadow: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    }
);

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
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory=document.querySelector('.category');
const inputSearch=document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPriceTag=document.querySelector('.modal-pricetag')
const buttonClearCart=document.querySelector('.clear-cart');
const inputAddress=document.querySelector('.input-address');



let login = localStorage.getItem('userName');
const cart = JSON.parse(localStorage.getItem(`gloDelivery_${login}`)) || [];

function saveCart() {
localStorage.setItem(`gloDelivery_${login}`, JSON.stringify(cart));
}

function downloadCart() {
    if (localStorage.getItem(`gloDelivery_${login}`)) {
        const data = JSON.parse(localStorage.getItem(`gloDelivery_${login}`));
        cart.push(...data);
    }
}
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

function returnMain() {
containerPromo.classList.remove('hide');
swiper.init();
restaurants.classList.remove('hide');
menu.classList.add('hide');
}

function autorized() {
    function logOut() {
        login = null;
        cart.length=0;
        localStorage.removeItem('userName');
        buttonAuth.style.display = '';
        buttonOut.style.display = '';
        userName.style.display = '';
        cartButton.style.display='';

        buttonOut.removeEventListener('click', logOut);
        checkAuth();
        returnMain();
    }

    console.log('Autorized');
    userName.textContent = login;
    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'flex';
    userName.style.display = 'inline';
    cartButton.style.display='flex';
    buttonOut.addEventListener("click", logOut);
}
// проверка на валидность формы
function validName(str) {
    const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return regName.test(str);
}


// вылогиниваемся
function notAutorized() {
    function logIn(event) {
        event.preventDefault();

        if (validName(loginInput.value)) {
            login = loginInput.value;
            localStorage.setItem('userName', login);
            toggleModalAuth();
            downloadCart();
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

function createCardRestaurant({ image, kitchen, name,price,products,stars, time_of_delivery:timeOfDelivery}) {

    const cardRestaurant= document.createElement('a');
    cardRestaurant.className='card card-restaurant';
    cardRestaurant.products = products;
    cardRestaurant.info={kitchen, name,price,stars};

    const  card = `
         <img src="${image}" alt=${name} class="card-image"/>
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
        `
    ;
    cardRestaurant.insertAdjacentHTML("beforeend", card );
    cardsRestaurants.insertAdjacentElement("beforeend", cardRestaurant);
}


function createCardGood({ id,name,description, price,image }) {

    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
            <div class="card-heading">
               <h3 class="card-title card-title-reg">${name}</h3>
            </div>
          <div class="card-info">
            <div class="ingredients">${description}</div>
         </div>
        <div class="card-buttons">
                <button class="button button-primary button-add-cart" id="${id}"> В корзину
                <span class="button-cart-svg"></span>
         </button>
         <strong class="card-price card-price-bold">${price} P</strong>
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
    swiper.destroy(false);
    menu.classList.remove('hide');
    const { name, kitchen,price,stars}= restaurant.info;
      restaurantTitle.textContent=name;
      restaurantRating.textContent=stars
      restaurantPrice.textContent=`От ${price} рублей `;
      restaurantCategory.textContent=kitchen;

      getData(`./db/${restaurant.products}`).then((data)=>{
          data.forEach(createCardGood);
      });
  }
}else{
  toggleModalAuth();
  }
}

// добавление товаров в корзину 

function addToCart(event) {
 const target = event.target;
 const buttonAddToCart=target.closest('.button-add-cart');

 if(buttonAddToCart){
     const card=target.closest('.card');
     const title=card.querySelector('.card-title-reg').textContent;
     const cost = card.querySelector('.card-price').textContent;
     const id = buttonAddToCart.id;
     const food=cart.find(function (item) {
           return item.id=== id;
     })

    if(food){
        food.count += 1;
    }else{
        cart.push({
            id,
            title,
            cost,
            count:1,
        });
    }

     saveCart();
 }
}
 function renderCart() {
   modalBody.textContent='';
   cart.forEach(function ({ id,title,cost,count}) {
      const itemCart=` 
           <div class="food-row">
              <span class="food-name">${title}</span>
              <strong class="food-price">${cost}</strong>
              <div class="food-counter">
                   <button class="counter-button counter-minus" data-id=${id}>-</button>
                    <span class="counter">${count}</span>
                   <button class="counter-button counter-plus" data-id=${id}>+</button>
               </div>
            </div>
      `;
      modalBody.insertAdjacentHTML('afterbegin',itemCart)// вставляем чтоб последний добавленный элемент был вначале списка
   });

   const totalPrice=cart.reduce(function (result,item) {
       // складываем цены переводя строки в цифры
            return result + (parseFloat(item.cost)*item.count);
   },0);

   modalPriceTag.textContent=totalPrice + ' P';
    saveCart();
 };

function changeCount(event) {
    const target = event.target;

    if (target.classList.contains('counter-button')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        if (target.classList.contains('counter-minus')) {
            food.count--;
            if(food.count===0){
                cart.splice(cart.indexOf(food),1)
            }
        }
        if (target.classList.contains('counter-plus')) {
            food.count++;
        }
        renderCart();

    }
 }

  // инициализация
function init() {
    getData('./db/partners.json').then((data) => {
        data.forEach(createCardRestaurant);
    });

   // buttonAuth.addEventListener('click',clearForm);
    cartButton.addEventListener("click",function (){
        renderCart();
        toggleModal();
    } );
    modalBody.addEventListener('click',changeCount);
    cardsMenu.addEventListener("click",addToCart);
    close.addEventListener("click", toggleModal);
    buttonClearCart.addEventListener('click',function () {
       cart.length=0;
       renderCart();
       toggleModal();
    });

    cardsRestaurants.addEventListener('click', openGoods);
    logo.addEventListener('click', function () {
        restaurants.classList.remove('hide');
        containerPromo.classList.remove('hide');
        swiper.init();
        menu.classList.add('hide');
    });

    checkAuth();

    inputSearch.addEventListener("keypress", function (event) {

        if (event.charCode === 13) {
            //считываем значение с инпута
            const value=event.target.value.trim();
            //проверяем на пустую строку, если  пустая, то не будет выводиться
            if(!value){
                event.target.style.backgroundColor=RED_COLOR;
                event.target.value='ВВЕДИТЕ НАИМЕНОВАНИЕ';
                //через время очищаем красный фон
                setTimeout(function () {
                    event.target.style.backgroundColor='';
                    event.target.value='';
                },1500)
                return;
            }

           //запрос за данными
            getData('./db/partners.json')
                .then(function (data) {
                    return data.map((partner) => {
                        return partner.products;
                    });
                })
                .then(function (linkProduct) {
                    cardsMenu.textContent = '';

                    linkProduct.forEach(function (link) {
                        getData(`./db/${link}`)
                            .then(function (data) {
                             //сравниваем есть ли значение инпута в названиях карточек , привеодя все значения к нижнему регистру
                                const resultSearch=data.filter(item=>{
                                    const name=item.name.toLowerCase();
                                    return name.includes(value.toLowerCase());
                                })

                                restaurants.classList.add('hide');
                                containerPromo.classList.add('hide');
                                swiper.destroy(false);
                                menu.classList.remove('hide');
                                restaurantTitle.textContent= 'Результат поиска';
                                restaurantRating.textContent=""
                                restaurantPrice.textContent='';
                                restaurantCategory.textContent='Разное';
                          // выводим карточки
                               resultSearch.forEach(createCardGood);
                            })
                    })
                })
        }
    });

//Динамический поиск  на поиск адреса
//     inputAddress.addEventListener("keyup", function (event) {
//
//         //считываем значение с инпута
//         const value = event.target.value.trim();
//
//         if (!value) {
//             event.target.style.backgroundColor = RED_COLOR;
//             event.target.value = 'ВВЕДИТЕ НАИМЕНОВАНИЕ';
//             //через время очищаем красный фон
//             setTimeout(function () {
//                 event.target.style.backgroundColor = '';
//                 event.target.value = '';
//             }, 1500)
//             return;
//         }
//         if(value.length<3) return;
//
//         //запрос за данными
//         getData('./db/partners.json')
//             .then(function (data) {
//                 return data.map((partner) => {
//                     return partner.products;
//                 });
//             })
//             .then(function (linkProduct) {
//                 cardsMenu.textContent = '';
//
//                 linkProduct.forEach(function (link) {
//                     getData(`./db/${link}`)
//                         .then(function (data) {
//                             //сравниваем есть ли значение инпута в названиях карточек , привеодя все значения к нижнему регистру
//                             const resultSearch = data.filter(item => {
//                                 const name = item.name.toLowerCase();
//                                 return name.includes(value.toLowerCase());
//                             })
//
//                             restaurants.classList.add('hide');
//                             containerPromo.classList.add('hide');
//                             swiper.destroy(false);
//                             menu.classList.remove('hide');
//                             restaurantTitle.textContent = 'Результат поиска';
//                             restaurantRating.textContent = ""
//                             restaurantPrice.textContent = '';
//                             restaurantCategory.textContent = 'Разное';
//                             // выводим карточки
//                             resultSearch.forEach(createCardGood);
//                         })
//                 })
//             })
//     })
}






init();
