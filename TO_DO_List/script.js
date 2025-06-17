const inputBox = document.getElementById("input-bx");
const List = document.getElementById("list");
function add() {
  if (inputBox.value == "") {
    alert("Please write something");
  } else {
    let li = document.createElement("li");
    li.innerHTML = inputBox.value;
    List.appendChild(li);
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
  }
  inputBox.value = "";
  save();
}

List.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
      save();
    } else if (e.target.tagName === "SPAN") {
      e.target.parentElement.remove();
      save();
    }
  },
  false
);

function save() {
  localStorage.setItem("data", List.innerHTML);
}

function show() {
  List.innerHTML = localStorage.getItem("data");
}
show();