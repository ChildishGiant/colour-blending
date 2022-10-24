import "styles.sass";


let colours = [];
let table;
let head;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

window.onload = function () {
  table = document.getElementById("comparison");
  head = table.rows[0];

  document.getElementById("add-colour").onclick = addColour;
  document.getElementById("remove-colour").onclick = removeColour;
  document.getElementById("blend-mode").onchange = blendModeChanged;

  addColour();
  addColour();
  addColour();

}

let addColour = function (colour) {

  // If no colour is passed, generate a random one
  colour = typeof colour == "string" ? colour : getRandomColor();

  let id = "colour-picker-"+colours.length;
  let picker = document.createElement("input");
  picker.type = "color";
  picker.dataset.colour = colours.length;
  picker.value = colour;

  picker.addEventListener("input", colourChanged);

  let clone = picker.cloneNode(true);
  // Not sure why but clones don't clone listners
  clone.addEventListener("input", colourChanged);

  colours.push(picker.value)

  // Add a row
  table.insertRow();

  // Add cells to every row
  // FIXME colours aren't being added properly
  for (index in Array.from(table.rows)) {

    let row = table.rows[index];

    // If not on the last row add a cell
    // Adding new collumn by adding a cell to the end of each row
    if (index != colours.length ) {
      let cell = row.insertCell();

      // If on first row, fill with colour picker
      if (index == 0) {
        cell.appendChild(picker);
        continue
      } else {
        let overlay = document.createElement("colour-overlay");
        // Set the colour
        overlay.setAttribute("colour-1", colour);
        overlay.setAttribute("colour-2", colours[index-1]);
        cell.appendChild(overlay)
      }

    }
    // This is the new row and needs a colour picker and all the other cells filled
    else {
      for (let i = 0; i <= colours.length; i++) {
        let cell = row.insertCell();

        // If on the first column add the colour picker
        if (i == 0) {
          cell.appendChild(clone);
        } else {
          // Otherwise add a colour overlay
          let overlay = document.createElement("colour-overlay");
          overlay.setAttribute("colour-1", colours[i-1]);
          overlay.setAttribute("colour-2", colour);
          cell.appendChild(overlay)
        }
      }
    }

  }

}

let removeColour = function () {


  if (colours.length == 1) { return }

  table.deleteRow(colours.length);

  for (index in Array.from(table.rows)) {
    let row = table.rows[index];
    row.deleteCell(colours.length);
  }

  colours.pop();

}

window.colourChanged = function (event) {

  // ID of the colour picker
  let id = this.dataset.colour;

  // Update the other picker
  let picker = document.querySelectorAll("input[type=color][data-colour=\""+id+"\"]");
  picker.forEach( el => {el.value = this.value});


  // let toUpdate = document.querySelectorAll("colour-overlay");

  for (rowNumber in Array.from(table.rows)) {

    let row = table.rows[rowNumber];

    for (var columnNumber in Array.from(row.cells)) {

      if (columnNumber-1 == id) {
        let overlay = row.cells[columnNumber].querySelector("colour-overlay");

        if (overlay){
          overlay.setAttribute("colour-1", this.value);
        }
      }

      if (rowNumber-1 == id) {
        let overlay = row.cells[columnNumber].querySelector("colour-overlay");

        if (overlay){
          overlay.setAttribute("colour-2", this.value);
        }
      }
    }
  }
}

window.blendModeChanged = function (event) {

  document.querySelectorAll("colour-overlay").forEach( el => {
    el.setAttribute("blend-mode", this.value);
  })
}

class Overlay extends HTMLElement {
  constructor() {
    super();
    // element created

    // Get colours
    let colour1 = this.getAttribute("colour-1");
    let colour2 = this.getAttribute("colour-2");

    const shadow = this.attachShadow({mode: 'open'});

    const style = document.createElement('style');
    style.textContent = `
    .colour-1 {
      width: 2em;
      height: 2em;
    }

    .colour-2 {
      width: 2em;
      height: 2em;
      position: absolute;

    }
    `;

    const colour1elem = document.createElement('div');
    colour1elem.classList.add("colour-1");
    colour1elem.style.backgroundColor = colour1;

    const colour2elem = document.createElement('div');
    colour2elem.classList.add("colour-2");
    colour2elem.style.backgroundColor = colour2;

    shadow.appendChild(colour1elem);
    colour1elem.appendChild(colour2elem);
    shadow.appendChild(style);

  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return ["colour-1", "colour-2", "blend-mode"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    console.log(this.shadowRoot);
    // called when one of attributes listed above is modified
    switch (name) {
      case "colour-1":
        this.shadowRoot.querySelector(".colour-1").style.backgroundColor = newValue;
        break;
      case "colour-2":
        this.shadowRoot.querySelector(".colour-2").style.backgroundColor = newValue;
      case "blend-mode":
        this.shadowRoot.querySelector(".colour-2").style.mixBlendMode = newValue;
    }
  }

  adoptedCallback() {
    // called when the element is moved to a new document
    // (happens in document.adoptNode, very rarely used)
  }

  // there can be other element methods and properties
}
customElements.define("colour-overlay", Overlay);
