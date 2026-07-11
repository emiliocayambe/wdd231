const navElement = document.querySelector('.navigation');
const menuButton = document.querySelector('#menu');

menuButton.addEventListener('click', () => {
    navElement.classList.toggle('open');
    menuButton.classList.toggle('show');
});
