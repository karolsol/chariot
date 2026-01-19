if (!localStorage.getItem("access_token")) {
  window.location.href = "login.html";
}
document.documentElement.setAttribute('data-bs-theme', sessionStorage.getItem("theme"));