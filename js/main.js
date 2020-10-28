const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}
//авторизация
const buttonAuth=document.querySelector('.button-auth');
const modalAuth=document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm=document.querySelector('#logInForm');
const loginInput=document.querySelector('#login');
let login=localStorage.getItem('userName');
const userName=document.querySelector('.user-name');
const buttonOut=document.querySelector('.button-out');

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  //убираем скролл при открытом модельном окне
  if(modalAuth.classList.contains('is-open')){
    disableScroll();// в файле отдельном функция
  }else{
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
      loginInput.style.borderColor = '#ff0000';
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener("submit", logIn);
  modalAuth.addEventListener('click',function (event){
   if(event.target.classList.contains('is-open')){
      toggleModalAuth();
    }
  } )
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized()
  }
}

checkAuth();

