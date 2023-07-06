const button = document.querySelector(".container-button");
const menu = document.querySelector(".dropdown-content");

button.addEventListener("click", () => {
    button.classList.toggle("change");
    menu.classList.toggle("close");
})
