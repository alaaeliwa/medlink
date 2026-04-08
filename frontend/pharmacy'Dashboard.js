let medicineName = document.getElementById('medicineName');
let medicinePrice = document.getElementById('medicinePrice');

let medicineAmount = document.getElementById('medicineAmount');

let btnAdd = document.getElementById('btnAdd');

let btnSearch = document.getElementById('btnSearch');
let totalMedicines = document.getElementById('totalMedicines');
let runOut = document.getElementById('runOut');
let order = document.getElementById('order');
let mood = 'Add';
let tmp;
let medicineNameSearch = document.getElementById('medicineNameSearch');
//get total medicines

//totalMedicines.textContent = dataMedicine.length;

// create medicine 
let dataMedicine;
if (localStorage.medicine != null) {
  dataMedicine = JSON.parse(localStorage.medicine)
}
else {
  dataMedicine = [];
}


btnAdd.onclick = function () {
  let newMedicine = {
    medicineName: medicineName.value.toLowerCase(),
    medicinePrice: medicinePrice.value,
    medicineAmount: medicineAmount.value,
  }
  if (medicineName.value !='' ){
  if(mood =='Add'){
  dataMedicine.push(newMedicine);
  }
  else{
    dataMedicine[tmp]=newMedicine;
    mood = "Add";
    btnAdd.innerHTML = `<i class="fa-solid fa-plus"></i>
          Add Medicine`;
  }

  
clearInputs()
getTotal()
runOutMedicine()
}

  // save localstorage
  localStorage.setItem('medicine', JSON.stringify(dataMedicine))
  
  display()


}
// clear inputs
function clearInputs() {
  medicineName.value = '';
  medicinePrice.value = '';
  medicineAmount.value = '';
}

// get total
function getTotal() {
document.getElementById('totalMedicines').textContent = dataMedicine.length;
}
// runOut
function runOutMedicine() {
let count = 0;
for(let i = 0; i < dataMedicine.length; i++){
  if(dataMedicine[i].medicineAmount <= 5){
    count++;
  }
} 
document.getElementById('runOut').textContent = count;

}

// display data in table

function display() {
  let table = "";

  for (let i = 0; i < dataMedicine.length; i++) {
    table += `

    <tr>
      <td>${i + 1}</td>
      <td>${dataMedicine[i].medicineName}</td>
      <td>${dataMedicine[i].medicinePrice}</td>
      <td>${dataMedicine[i].medicineAmount}</td>
      <td>
        <button onclick="updateData(${i})  "style="background:transparent;border:none;  cursor:pointer;"onmouseover="this.firstElementChild.  style.transform='scale(1.2)'"onmouseout="this.  firstElementChild.style.transform='scale(1)'"><i   class="fa-solid fa-pen-to-square"style="color:rgb(3,  4,68);font-size:18px;transition:0.3s;"></i></button>
      </td>

      <td> 
        <button onclick="deleteData(${i})" style="background:transparent;border:none;cursor:pointer;"><i class="fa-regular fa-trash-can" style="color:hsl(350,100%,62%);font-size:18px;transition:0.3s;"></i></button>
      </td>
    </tr>
    `;
  }

  document.getElementById('tbody').innerHTML = table;

  let btnDelete = document.getElementById('deleteAll');

  if (dataMedicine.length > 0) {
    btnDelete.innerHTML = `<button onclick="deleteAll()" class="delete-all-btn">
    <i class="fa-regular fa-trash-can"></i> Delete All (${dataMedicine.length})
  </button>`;
  } else {
    btnDelete.innerHTML = '';
  }


}



// delete
function deleteData(i) {
  dataMedicine.splice(i, 1)
  localStorage.setItem('medicine', JSON.stringify(dataMedicine))
  display()
}

// delete all
function deleteAll() {
  localStorage.clear()
  dataMedicine.splice(0)
  display()

}

// update
function updateData(i) {
  medicineName.value = dataMedicine[i].medicineName;
  medicinePrice.value = dataMedicine[i].medicinePrice;
  medicineAmount.value = dataMedicine[i].medicineAmount;
  btnAdd.innerHTML = '<i  class="fa-solid fa-pen-to-square"style="color:rgb(3,  4,68);transition:0.3s;"> Update</i>';
  mood = 'update';
  tmp = i;
  scroll({top:200,
    behavior:"smooth",
  })
}

// search
function search(value){
  let table = '';
  for(let i =0;i<dataMedicine.length;i++){
    if (dataMedicine[i].medicineName.includes(value.toLowerCase())){
      table += `

    <tr>
      <td>${i + 1}</td>
      <td>${dataMedicine[i].medicineName}</td>
      <td>${dataMedicine[i].medicinePrice}</td>
      <td>${dataMedicine[i].medicineAmount}</td>
      <td>
        <button onclick="updateData(${i})  "style="background:transparent;border:none;  cursor:pointer;"onmouseover="this.firstElementChild.  style.transform='scale(1.2)'"onmouseout="this.  firstElementChild.style.transform='scale(1)'"><i   class="fa-solid fa-pen-to-square"style="color:rgb(3,  4,68);font-size:18px;transition:0.3s;"></i></button>
      </td>

      <td> 
        <button onclick="deleteData(${i})" style="background:transparent;border:none;cursor:pointer;"><i class="fa-regular fa-trash-can" style="color:hsl(350,100%,62%);font-size:18px;transition:0.3s;"></i></button>
      </td>
    </tr>
    `;

    }

  }
    document.getElementById('tbody').innerHTML = table;

}  
btnSearch.onclick = function(){
  medicineNameSearch.value = '';
  display();
}


display()
getTotal()
runOutMedicine()
