async function loadNavbar() {
  try {
    const response = await fetch("./components/navbar.html");
    const data = await response.text();
    document.getElementById("navbar-container").innerHTML = data;

    if (typeof kirjautunutUI === "function") {
      kirjautunutUI();
    }
  } catch (error) {
    console.error("Navbar loading failed:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadNavbar);