const wrapper = document.querySelector('.loginWrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

const form_box_login = document.querySelector('.loginWrapper .form-box-login');
const form_box_register = document.querySelector('.loginWrapper .form-box-register');

registerLink.addEventListener('click', () => {
    form_box_login.style.display = 'none';
    form_box_register.style.display = "block";
});

loginLink.addEventListener('click', () => {
    form_box_login.style.display = 'block';
    form_box_register.style.display = "none";
});