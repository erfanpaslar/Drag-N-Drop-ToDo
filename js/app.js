const theContainer = document.getElementById("todoContainer");
const theCols = document.getElementsByClassName("todo-box");
const toDos = document.getElementsByClassName("todoItem");
var id = 0; //should get from local storage
const messageTemplate = `
<div class="todoItemContainer">
<div
	class="todoItem input"
	ondrag="drag(event)"
	draggable="true"
	readonly="true"
	onclick="toggleThings(this)"
	onblur="lostFocused(this)"
	contenteditable
></div>
<span class="removeItem" onclick="removeItem(this)"></span>
<span class="colorPickerWrapper">
	<input
		id="aa"
		type="color"
		onChange="changeColor(this)"
		value="#444444"
	/>
</span>
</div>
`;
var cols = {};
[...theCols].forEach((column) => {
  cols[`${column.id}`] = column;
});

var draggedItem;
var currentColumn;
var dragCounter = 0;

function drag(e) {
  draggedItem = e.target;
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(col) {
  // cols[col].classList.add("dragOver");
  document.getElementById(`box${col}`).classList.add("dragOver");
  currentColumn = col;
  dragCounter++;
  console.log(dragCounter);
}

// disabled for now
function dragLeave(col) {
  dragCounter--;
  console.log(dragCounter);
  if (dragCounter == 0) {
    document.getElementById(`box${col}`).classList.remove("dragOver");
  }
  // cols[col].classList.remove("dragOver");
}

function drop(e) {
  e.preventDefault();
  // dragCounter = 0;
  dragCounter = 0;
  console.log("dropped");

  // [...cols].forEach((column) => {
  //   column.classList.remove("dragOver");
  // });
  for (let i = 0; i <= id; i++) {
    let column = document.getElementById(`box${i}`);
    if (column) {
      column.classList.remove("dragOver");
    }
  }
  document
    .getElementById(`box${currentColumn}`)
    .appendChild(draggedItem.parentNode);
}

//

function addItem(toCol) {
  let column = document.getElementById(`box${toCol}`);
  column.innerHTML += messageTemplate;
  let children = column.childNodes;
  console.log(children[children.length - 2].childNodes[1]);
  children[children.length - 2].childNodes[1].focus();
}
function remove(toCol) {
  document.getElementById("hintText").innerHTML = "";
  document.getElementById(`box${toCol}`).remove();
}

function toggleThings(me) {
  me.toggleAttribute("readOnly");
  me.parentNode.classList.toggle("enabled");
}

function lostFocused(me) {
  if (me.innerHTML) {
    me.parentNode.classList.remove("enabled");
    me.setAttribute("readOnly", true);
  } else {
    removeItem(me);
  }
}

function addCollection() {
  id += 1;
  const collectionTemplate = `<div
	id="box${id}"
	class="todo-box boxShadow"
	ondrop="drop(event)"
	ondragover="allowDrop(event)"
	ondragenter="dragEnter(${id})" 
	ondragleave="dragLeave(${id})" >
	<h2 class="todoTitle" contenteditable></h2>
	<button class="addItem" onclick="addItem(${id})"></button>
	<button class="remove" onclick="remove(${id})"></button>
	</div>
	`;

  // theContainer.innerHTML = collectionTemplate + theContainer.innerHTML;
  theContainer.innerHTML += collectionTemplate;

  let children = theContainer.childNodes;
  children[children.length - 2].childNodes[1].focus();

  console.log(children[children.length - 2].childNodes[1]);
}

function removeItem(me) {
  me.parentNode.remove();
}

function isDark(c) {
  c = c.substring(1); // strip #
  let rgb = parseInt(c, 16); // convert rrggbb to decimal
  let r = (rgb >> 16) & 0xff; // extract red
  let g = (rgb >> 8) & 0xff; // extract green
  let b = (rgb >> 0) & 0xff; // extract blue
  let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  if (luma < 100) {
    return 1;
  }
  return 0;
}

function changeColor(me) {
  me.parentNode.parentNode.childNodes[1].style.background = `${me.value}`;
  let dark = isDark(me.value);
  me.parentNode.parentNode.childNodes[1].style.color = dark ? "#eee" : "#222";
  me.parentNode.parentNode.childNodes[3].style.backgroundColor = dark
    ? "#ccc"
    : "#333";
  me.parentNode.parentNode.childNodes[5].style.backgroundColor = dark
    ? "#eee5"
    : "#2226";
  // console.log(me.parentNode.parentNode.childNodes);
}
function changeColorBox(me) {
  me.parentNode.parentNode.style.background = `${me.value}`;
  let dark = isDark(me.value);

  me.parentNode.parentNode.style.color = dark ? "#eee" : "#222";
  me.parentNode.parentNode.childNodes[1].style.backgroundColor = dark
    ? "#bbb5"
    : "#2226"; //O
  me.parentNode.parentNode.childNodes[5].style.backgroundColor = dark
    ? "#bbb"
    : "#333"; //+
  me.parentNode.parentNode.childNodes[7].style.backgroundColor = dark
    ? "#bbb"
    : "#222"; //trash
  // console.log(me.parentNode.parentNode.childNodes);
}
function changeColorBg(me) {
  document.body.style.background = `${me.value}`;
  let dark = isDark(me.value);
  me.parentNode.parentNode.childNodes[1].style.backgroundColor = dark
    ? "#eee5"
    : "#2226"; //O
  me.parentNode.parentNode.childNodes[3].style.backgroundColor = dark
    ? "#bbb"
    : "#222"; //+
  console.log(me.parentNode.parentNode.childNodes);
}
function wantToDeleteItem(me) {
  me.parentNode.childNodes[1].classList.add("wantToDeleteItem");
}
function doNotWantToDeleteItem(me) {
  me.parentNode.childNodes[1].classList.remove("wantToDeleteItem");
}
function wantToDeleteBox(me) {
  me.parentNode.classList.add("wantToDeleteItem");
}
function doNotWantToDeleteBox(me) {
  me.parentNode.classList.remove("wantToDeleteItem");
}
function wantToAddItem(me) {
  me.parentNode.classList.add("dragOver");
}
function doNotWantToAddItem(me) {
  me.parentNode.classList.remove("dragOver");
}

//removed
function changeTextOnTop(text = "") {
  document.getElementById("hintText").innerHTML = text;
  setTimeout(() => {
    document.getElementById("hintText").innerHTML = "";
  }, 5000);
}
// const aCollection={
// 	id:0,
// 	content=[
// 		"aaa",
// 		"bbb",
// 		"ccc"
// 	],

// }
