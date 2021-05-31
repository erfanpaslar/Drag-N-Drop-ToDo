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
>...</div>
<span class="removeItem" onclick="removeItem(this)"></span>
<span class="colorPickerWrapper">
            <input
              id="aa"
              type="color"
              onChange="changeColor(this)"
              value="#2233ff"
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
}
function dragLeave(col) {
  document.getElementById(`box${col}`).classList.remove("dragOver");
  // cols[col].classList.remove("dragOver");
  // document.getElementById(`box${col}`).classList.add("dragOver");
}

function drop(e) {
  e.preventDefault();

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
}
function remove(toCol) {
  document.getElementById(`box${toCol}`).parentNode.remove();
}

function toggleThings(me) {
  me.toggleAttribute("readOnly");
  me.parentNode.classList.toggle("enabled");
}

function lostFocused(me) {
  me.parentNode.classList.remove("enabled");
  me.setAttribute("readOnly", true);
}

function addCollection() {
  console.log("add");
  id += 1;
  const collectionTemplate = `<div
	id="box${id}"
	class="todo-box"
	ondrop="drop(event)"
	ondragover="allowDrop(event)"
	ondragenter="dragEnter(${id})"
	ondragleave="dragLeave(${id})" >
	<h2 class="todoTitle" >Title</h2>
	<button class="addItem" onclick="addItem(${id})"></button>
	<button class="remove" onclick="remove(${id})"></button>
	</div>
	`;

  theContainer.innerHTML = collectionTemplate + theContainer.innerHTML;
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
  me.parentNode.parentNode.childNodes[1].style.color = isDark(me.value)
    ? "#eee"
    : "#222";
}

// const aCollection={
// 	id:0,
// 	content=[
// 		"aaa",
// 		"bbb",
// 		"ccc"
// 	],

// }
