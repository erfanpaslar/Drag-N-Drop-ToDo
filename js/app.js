var main = { boxes: [] };
const defaultBoxBg = "#bdbdbd";
const defaultBoxColor = "#3a3a3a";
const defaultItemBg = "#d4d4d4";

const defaultXColorD = "#cccccc";
const defaultXColorL = "#333333";

const defaultOColorD = "#cccccc55";
const defaultOColorL = "#22222255";

const defaultTextColorD = "#eeeeee";
const defaultTextColorL = "#181818";

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
			value="${defaultItemBg}"
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

function rgb2hex(rgb) {
  if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

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
  if (dragCounter == 0) {
    document.getElementById(`box${col}`).classList.remove("dragOver");
  }
}

function drop(e) {
  e.preventDefault();
  dragCounter = 0;

  for (let i = 0; i <= id; i++) {
    let column = document.getElementById(`box${i}`);
    if (column) {
      column.classList.remove("dragOver");
    }
  }
  document
    .getElementById(`box${currentColumn}`)
    .appendChild(draggedItem.parentNode);

  for (let i = 0; i < main.boxes.length; i++) {
    if (`box${main.boxes[i].id}` == draggedItemParentParent.id) {
      for (var j = 0; j < main.boxes[i].content.length; j++) {
        // main.boxes[i].content.forEach((cont) => {
        if (main.boxes[i].content[j].text == draggedItem.innerText) {
          main.boxes[i].content.splice(j, 1);
        }
      }
    }
    if (main.boxes[i].id == currentColumn) {
      main.boxes[i].content.push({
        text: draggedItem.innerText,
        background: draggedItem.parentNode.childNodes[1].style.background
          ? rgb2hex(`${draggedItem.parentNode.childNodes[1].style.background}`)
          : defaultItemBg,
      });
    }
  }
  saveToDo();
}

function addItem(toCol) {
  let column = document.getElementById(`box${toCol}`);
  column.innerHTML += messageTemplate;
  let children = column.childNodes;
  children[children.length - 2].childNodes[1].focus();

  for (let item of main.boxes) {
    if (item.id == toCol) {
      item.content.push({ text: "", background: defaultItemBg });
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
  // me is me.parentNode.parentNode -> the box
  for (let i = 0; i < main.boxes.length; i++) {
    if (`box${main.boxes[i].id}` == me.id) {
      main.boxes[i].content = [];
      const children = me.children;
      for (let j = 4; j < children.length; j++) {
        main.boxes[i].content.push({
          text: children[j].children[0].innerText,
          background: children[j].childNodes[1].style.background
            ? rgb2hex(`${children[j].childNodes[1].style.background}`)
            : defaultItemBg,
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
}

function lostFocusedTitle(me) {
  for (let box of main.boxes) {
    if (me.parentNode.id == `box${box.id}`) {
      box.title = me.innerText;
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
			<input type="color" onChange="changeColorBox(this)" value="${defaultBoxBg}" />
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

  theContainer.innerHTML += collectionTemplate;

  let children = theContainer.children;
  children[children.length - 1].childNodes[3].focus();

  // add to list when a BOX created
  main.boxes.push({
    id: id,
    background: defaultBoxBg,
    color: defaultBoxColor,
    content: [],
  });
  main.lastId = id;
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

  me.parentNode.parentNode.childNodes[1].style.color = dark
    ? `${defaultTextColorD}`
    : `${defaultTextColorL}`;
  me.parentNode.parentNode.childNodes[3].style.backgroundColor = dark
    ? `${defaultXColorD}`
    : `${defaultXColorL}`;
  me.parentNode.parentNode.childNodes[5].style.backgroundColor = dark
    ? `${defaultOColorD}`
    : `${defaultOColorL}`;

  updateTheContentOf(me.parentNode.parentNode.parentNode);
  saveToDo();
  // Changing a color of a element
  // main.boxes."for each where id == ?id?".
}

function changeColorBox(me) {
  me.parentNode.parentNode.style.background = `${me.value}`;
  let dark = isDark(me.value);

  me.parentNode.parentNode.children[1].style.color = dark
    ? `${defaultTextColorD}`
    : `${defaultTextColorL}`;

  me.parentNode.parentNode.childNodes[1].style.background = dark
    ? `${defaultOColorD}`
    : `${defaultOColorL}`; //O
  me.parentNode.parentNode.childNodes[5].style.background = dark
    ? `${defaultXColorD}`
    : `${defaultXColorL}`; //+
  me.parentNode.parentNode.childNodes[7].style.background = dark
    ? `${defaultXColorD}`
    : `${defaultXColorL}`; // trash
  // this is like on update : me.parentNode.parentNode
  // main.boxes
  for (let i = 0; i < main.boxes.length; i++) {
    if (me.parentNode.parentNode.id == `box${main.boxes[i].id}`) {
      main.boxes[i].background = `${me.value}`;
    }
  }
  saveToDo();
}

function changeColorBg(me) {
  document.body.style.background = `${me.value}`;
  let dark = isDark(me.value);
  me.parentNode.parentNode.childNodes[1].style.background = dark
    ? `${defaultOColorD}`
    : `${defaultOColorL}`; //O
  me.parentNode.parentNode.childNodes[3].style.background = dark
    ? `${defaultXColorD}`
    : `${defaultXColorL}`; //+
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

function saveToDo() {
  localStorage.setItem("YourToDos", JSON.stringify(main));
}

function loadToDo(collectionName = "YourToDos") {
  let loadedMain = JSON.parse(localStorage.getItem("YourToDos"));
  main = loadedMain != null ? loadedMain : main;
  if (loadedMain) {
    theContainer.innerHTML = "";
    id = loadedMain != null ? loadedMain.lastId : -1;
    document.body.style.background = loadedMain.background;

    let dark = loadedMain.background ? isDark(loadedMain.background) : 0;
    document.body.childNodes[1].childNodes[1].style.background = dark
      ? `${defaultOColorD}`
      : `${defaultOColorL}`; //O for page background
    document.body.childNodes[1].childNodes[3].style.background = dark
      ? `${defaultXColorD}`
      : `${defaultXColorL}`; // + fro adding new box

    for (let box of loadedMain.boxes) {
      let theBoxAndItems = "";
      if (box.id || box.id === 0) {
        theBoxAndItems += `
				<div
					id="box${box.id}"
					class="todo-box boxShadow"
					ondrop="drop(event)"
					ondragover="allowDrop(event)"
					ondragenter="dragEnter(${box.id})"
					ondragleave="dragLeave(${box.id})"
					style="background:${box.background};"
				>
					<span class="colorPickerBoxWrapper cPtr" style="background:
					${isDark(box.background) ? defaultOColorD : defaultOColorL};">
						<input type="color" onChange="changeColorBox(this)" value="${box.background}" />
					</span>
					<h2 class="todoTitle nbno" onblur="lostFocusedTitle(this)" contenteditable
					style="color:
					${isDark(box.background) ? defaultTextColorD : defaultTextColorL}
					"
					>${box.title}</h2>

					<button
						class="addItem xImg nbno cPtr"
						onclick="addItem(${box.id})"
						onmouseout="doNotWantToAddItem(this)"
						onmouseover="wantToAddItem(this)"
						style="background:
					${isDark(box.background) ? defaultXColorD : defaultXColorL}
					"
					></button>
					<button
						class="remove nbno cPtr"
						ondblclick="remove(${box.id})"
						onmouseout="doNotWantToDeleteBox(this)"
						onmouseover="wantToDeleteBox(this)"
						style="background:
					${isDark(box.background) ? defaultXColorD : defaultXColorL}
					"
					></button>
					
					`;

        for (let content of box.content) {
          theBoxAndItems += `
				<div class="todoItemContainer">
					<div
						class="todoItem cPtr nbno boxShadow"
						ondrag="drag(event)"
						draggable="true"
						readonly="true"
						onclick="toggleThings(this)"
						onblur="lostFocused(this)"
						contenteditable
						style="
						background:${content.background};
						color:
						${isDark(content.background) ? defaultTextColorD : defaultTextColorL}
						"
						>${content.text}</div>
					<span
						class="removeItem xImg"
						onmouseout="doNotWantToDeleteItem(this)"
						onmouseover="wantToDeleteItem(this)"
						ondblclick="removeItem(this)"
						style="
						background:
						${isDark(content.background) ? defaultXColorD : defaultXColorL}"
					></span>
					<span class="colorPickerWrapper cPtr"
					style="background:
						${isDark(content.background) ? defaultOColorD : defaultOColorL};">
						<input
							type="color"
							onChange="changeColor(this)"
							value="${content.background}"
							/>
						</span>
					</div>`;
        }
        theBoxAndItems += "</div>";

        theContainer.innerHTML += theBoxAndItems;
      } else {
        //pass
      }
    }
  }
}

loadToDo("YourToDos");
