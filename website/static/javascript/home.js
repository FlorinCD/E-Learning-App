
// to make the animations remain on the page after finishing in css file
const element1 = document.getElementById("typer-p1-0");
const element2 = document.getElementById("typer-p2-0");

element1.addEventListener("animationend", () => {
  element1.style["visibility"] = "visible";
  element1.style["overflow"] = "visible";
}, { once: true });

element2.addEventListener("animationend", () => {
  element2.style["visibility"] = "visible";
  element2.style["overflow"] = "visible";
}, { once: true });

