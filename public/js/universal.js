document.getElementById("logoutButton").onclick = () => {
  localStorage.removeItem("access_token");
  window.location.href = "login.html";
};

if(sessionStorage.getItem("theme") === 'dark') {
  document.getElementById('themeSwitch').classList.add("fa-moon");
} else {
  document.getElementById('themeSwitch').classList.add("fa-sun");
}

document.getElementById('themeSwitch').onclick = ()=> {
  const theme = document.documentElement.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-bs-theme', theme);
  sessionStorage.setItem("theme", theme);
  document.getElementById('themeSwitch').classList.toggle("fa-moon");
  document.getElementById('themeSwitch').classList.toggle("fa-sun");
}