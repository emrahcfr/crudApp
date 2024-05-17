//! Select HTML elements
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const submitBtn = document.querySelector(".submitBtn");
const alert = document.querySelector(".alert");
const clearBtn = document.querySelector(".clearBtn");



let editElement;
let editFlag = false; //  indicates whether it is in edit mode or not.
let editID = ""; // the unique identifier of edited item
//! functions area
//* Add to local storage

const setBackToDefault=()=>{
  grocery.value="";
  editFlag=false;
  editID="";

}
const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => list.removeChild(item));

  };
  container.classList.remove("show-container");
  displayAlert("All items removed", "danger")

}

const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`)
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000)
};
const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  displayAlert("Item Removed", "danger");
  setBackToDefault();
  removeFromLocalStorage(id)

}
const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement; //"article" etiketine parentElement sayesinde ulaştık
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerText;

  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";

}
const addItem = (e) => {
  e.preventDefault();//* prevent auto-submit of form
  const value = grocery.value//* getting value which is inside of input
  const id = new Date().getTime().toString();//* we created a unıque id
  if (value !== "" && !editFlag) {
    const element = document.createElement("article");//* created a new "article" tag
    let attr = document.createAttribute("data-id");//*Creates a new data identifier.
    attr.value = id;
    element.setAttributeNode(attr);//* we added the identifier that we created to "article"
    element.classList.add("grocery-item");//* we added a class to "article"
    element.innerHTML = `<p class="title">${value}</p>
      <div class="btn-container">
          <button type="button" class="edit-btn">
              <i class="fa-solid fa-pen-to-square"></i>
          </button>
          </button>
          <button type="button" class="delete-btn">
              <i class="fa-solid fa-trash"></i>
          </button>
      </div>`;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem)
    list.appendChild(element);
    grocery.value = "";
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
    displayAlert("Added Successfully", "success");
    container.classList.add("show-container");
    addToLocalStorage(id, value)

  } else if (value !== "" && editFlag) {
    editElement.innerText = value;
    displayAlert("Item Changed", "success");
    editLocalStorage(editID, value)
    
    submitBtn.textContent = "Add";
    editFlag = false;
    grocery.value = "";

  }
};
const createListItem=(id, value)=>{
  const element = document.createElement("article"); // Yeni bir "article" etiketi oluşturduk
  let attr = document.createAttribute("data-id"); // Yeni bir veri kimliği oluşturur.
  attr.value = id;
  element.setAttributeNode(attr); // Oluşturduğumuz id'yi "article" etiketine ekledik
  element.classList.add("grocery-item"); // Oluşturduğumuz "article" etiketine class ekledik

  element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    
    `;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  // Kapsayıcıya oluşturduğumuz "article" etiketini ekledik
  list.appendChild(element);
  container.classList.add("show-container");
}
const setupItems= ()=>{
  let items = getLocalStorage();
  if(items.length > 0){
    items.forEach((item)=>{
      createListItem(item.id, item.value)
    })
  }
}
const addToLocalStorage = (id, value)=>{  
  const grocery= {id, value};
  let items =getLocalStorage();
  items.push(grocery);
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items))
};
const getLocalStorage=()=>{
  return localStorage.getItem("list") 
  ? JSON.parse(localStorage.getItem("list")) :[];
 };
 const removeFromLocalStorage = (id) => {
  // localStorageda bulunan verileri getir
  let items = getLocalStorage();
  // tıkladığım etiketin idsi ile localStorageda ki id eşit değilse bunu diziden çıkar ve yeni bir elemana aktar
  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
}
const editLocalStorage = (id, value)=>{
  let items = getLocalStorage();
  items = items.map((item) => {
    if(item.id === id){
      item.value = value;
    }
    return item;
  })
  localStorage.setItem("list", JSON.stringify(items))
}
//! Event Listeners
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems)
window.addEventListener("DOMContentLoaded", setupItems);
