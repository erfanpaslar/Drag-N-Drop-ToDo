var main = { boxes: [] };
const defaultBoxBg = "#444444";
const defaultColorPicker = "#444444";
const defaultBoxColor = "#ffffff";
const defaultItemBg = "#eeeeee";

const theContainer = document.getElementById("todoContainer");
const theCols = document.getElementsByClassName("todo-box");
const toDos = document.getElementsByClassName("todoItem");
var id = -1; //should get from local storage
const messageTemplate = `
<div class="todoItemContainer">
	<div
		class="todoItem cPtr nbno boxShadow"
		ondrag="drag(event)"
		draggable="true"
		readonly="true"
		onclick="toggleThings(this)"
		onblur="lostFocused(this)"
		contenteditable
	></div>
	<span
		class="removeItem xImg"
		onmouseout="doNotWantToDeleteItem(this)"
		onmouseover="wantToDeleteItem(this)"
		ondblclick="removeItem(this)"
	></span>
	<span class="colorPickerWrapper cPtr">
		<input
			type="color"
			onChange="changeColor(this)"
			value="${defaultColorPicker}"
		/>
	</span>
</div>
`;
var cols = {};
[...theCols].forEach((column) => {
  cols[`${column.id}`] = column;
});

var draggedItem;
var draggedItemParentParent;
var currentColumn;
var dragCounter = 0;

function drag(e) {
  draggedItem = e.target;
  draggedItemParentParent = draggedItem.parentNode.parentNode;
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(col) {
  document.getElementById(`box${col}`).classList.add("dragOver");
  currentColumn = col;
  dragCounter++;
}

function dragLeave(col) {
  dragCounter--;
  console.log(dragCounter);
  if (dragCounter == 0) {
    document.getElementById(`box${col}`).classList.remove("dragOver");
  }
}

function drop(e) {
  e.preventDefault();
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

  // console.log(currentColumn + " " + draggedItemParentParent.id);
  for (let i = 0; i < main.boxes.length; i++) {
    if (`box${main.boxes[i].id}` == draggedItemParentParent.id) {
      for (var j = 0; j < main.boxes[i].content.length; j++) {
        // main.boxes[i].content.forEach((cont) => {
        if (main.boxes[i].content[j].text == draggedItem.innerText) {
          main.boxes[i].content.splice(j, 1);
          console.log("delete from parent");
        }
      }
      // saveToDo();
    }
    if (main.boxes[i].id == currentColumn) {
      main.boxes[i].content.push({
        text: draggedItem.innerText,
        background: draggedItem.parentNode.childNodes[1].style.background,
      });
      // saveToDo();
    }
  }
  saveToDo();
}

function addItem(toCol) {
  let column = document.getElementById(`box${toCol}`);
  column.innerHTML += messageTemplate;
  let children = column.childNodes;
  console.log(children[children.length - 2].childNodes[1]);
  children[children.length - 2].childNodes[1].focus();

  for (let i = 0; i < main.boxes.length; i++) {
    if (main.boxes[i].id == toCol) {
      main.boxes[i].content.push({ text: "", background: defaultItemBg });
    }
  }
}

function remove(toCol) {
  document.getElementById(`box${toCol}`).remove();
  for (let i = 0; i < main.boxes.length; i++) {
    if (toCol === main.boxes[i].id) {
      main.boxes.splice(i, 1);
      saveToDo();
      break;
    }
  }
}

function toggleThings(me) {
  me.toggleAttribute("readOnly");
  me.parentNode.classList.toggle("enabled");
}

function updateTheContentOf(me) {
  // console.log("updating");
  // console.log(me);
  // me is me.parentNode.parentNode -> the box
  for (let i = 0; i < main.boxes.length; i++) {
    if (`box${main.boxes[i].id}` == me.id) {
      main.boxes[i].content = [];
      const children = me.children;
      console.log(children);
      for (let j = 4; j < children.length; j++) {
        // console.log(j + " " + children[j]);
        main.boxes[i].content.push({
          text: children[j].children[0].innerText,
          background: children[j].childNodes[1].style.background,
        });
      }
      saveToDo();
      break;
    }
  }
  // me.childNodes[1].style.background
}

function lostFocused(me) {
  if (me.innerHTML) {
    me.parentNode.classList.remove("enabled");
    me.setAttribute("readOnly", true);
  } else {
    removeItem(me);
  }
  updateTheContentOf(me.parentNode.parentNode);
  // for (let i = 0; i < main.boxes.length; i++) {
  //   if (`box${main.boxes[i].id}` == me.parentNode.parentNode.id) {
  //     main.boxes[i].content = [];
  //     const children = me.parentNode.parentNode.children;
  //     console.log(children);
  //     for (let j = 4; j < children.length; j++) {
  //       // console.log(j + " " + children[j]);
  //       main.boxes[i].content.push(children[j].children[0].innerText);
  //     }
  //     saveToDo();
  //     break;
  //   }
  // }
}
function lostFocusedTitle(me) {
  for (let i = 0; i < main.boxes.length; i++) {
    if (me.parentNode.id == `box${i}`) {
      main.boxes[i].title = me.innerText;
    }
  }
  saveToDo();
}
function addCollection() {
  id += 1;
  const collectionTemplate = `
	<div
		id="box${id}"
		class="todo-box boxShadow"
		ondrop="drop(event)"
		ondragover="allowDrop(event)"
		ondragenter="dragEnter(${id})"
		ondragleave="dragLeave(${id})"
	>
		<span class="colorPickerBoxWrapper cPtr">
			<input type="color" onChange="changeColorBox(this)" value="${defaultColorPicker}" />
		</span>
		<h2 class="todoTitle nbno" onblur="lostFocusedTitle(this)" contenteditable></h2>
		<button
			class="addItem xImg nbno cPtr"
			onclick="addItem(${id})"
			onmouseout="doNotWantToAddItem(this)"
			onmouseover="wantToAddItem(this)"
		></button>
		<button
			class="remove nbno cPtr"
			ondblclick="remove(${id})"
			onmouseout="doNotWantToDeleteBox(this)"
			onmouseover="wantToDeleteBox(this)"
		></button>
	</div>
	`;

  // theContainer.innerHTML = collectionTemplate + theContainer.innerHTML;
  theContainer.innerHTML += collectionTemplate;

  let children = theContainer.children;
  children[children.length - 1].childNodes[3].focus();

  // console.log(children[children.length - 2].childNodes[3]);

  // add to list when a BOX created
  main.boxes.push({
    id: id,
    background: defaultBoxBg,
    color: defaultBoxColor,
    content: [],
  });
  saveToDo();
}

function removeItem(me) {
  const myPParent = me.parentNode.parentNode;
  me.parentNode.remove();
  updateTheContentOf(myPParent);
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

  updateTheContentOf(me.parentNode.parentNode.parentNode);
  saveToDo();
  // console.log(me.parentNode.parentNode.childNodes);
  // Changing a color of a element
  // main.boxes."for each where id == ?id?".
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
    : "#333"; //trash

  // this is like on update : me.parentNode.parentNode
  console.log(me.parentNode.parentNode.id);
  // main.boxes
  for (let i = 0; i < main.boxes.length; i++) {
    if (me.parentNode.parentNode.id == `box${i}`) {
      main.boxes[i].background = `${me.value}`;
    }
  }
  saveToDo();
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
    : "#333"; //+
  // console.log(me.parentNode.parentNode.childNodes);
  main.background = `${me.value}`;
  saveToDo();
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
// function changeTextOnTop(text = "") {
//   document.getElementById("hintText").innerHTML = text;
//   setTimeout(() => {
//     document.getElementById("hintText").innerHTML = "";
//   }, 5000);
// }

// const aCollection2={
// 	id: 0,
//	title:"title"
// 	background: "#123456",
// 	color:"#eeeeee",
// 	content=[
// 		{text:"aaa", background:"#222222"},
// 		{text:"bbb", background:"#222222"},
// 		{text:"ccc", background:"#222222"},
// 	],
// }
// const main2={
// 	background:"#999999",
// 	color:"#222222",
// 	boxes: [addCollection, bCollection, cCollection]
// }

function saveToDo() {
  localStorage.setItem("YourToDos", JSON.stringify(main));
  // var storedNames = JSON.parse(localStorage.getItem("names"));

  console.log(main);
}
