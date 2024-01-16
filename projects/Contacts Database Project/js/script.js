	//let all DOM elements be ready before any javascript	
window.onload=function init(){



	//my variables
  const addButton=document.querySelector("#addButton");
	const viewButton=document.querySelector("#viewButton");
	const hideButton=document.querySelector("#hideButton");
  const clearButton=document.querySelector("#clearButton");
  const saveButton=document.querySelector("#saveButton");
  const loadButton=document.querySelector("#loadButton");
  const contactTable=document.querySelector("#contactTable");
  const searchTable=document.querySelector("#searchTable");
  const form = document.querySelector("#contactForm");
  const searchBox=document.querySelector("#searchBox");
  let allContacts=[];



  



  class Contact{

		constructor(firstName,lastName,phoneNumber){
			this.firstName=firstName;
			this.lastName=lastName;
			this.phoneNumber=phoneNumber;
  		}

		static addContact(){
      // Retrieve the values of input fields
      const firstName = document.querySelector("#firstName").value;
      const lastName = document.querySelector("#lastName").value;
      const phoneNumber = document.querySelector("#phoneNumber").value;
      //create new contact and add to array
      if((firstName)&&(lastName)&&(phoneNumber)){
  			const newContact= new Contact (firstName,lastName,phoneNumber);
        allContacts.push(newContact);
        console.log (`${JSON.stringify(newContact)} added`);
        //empty the input fields
        document.querySelector("#firstName").value='';
        document.querySelector("#lastName").value='';
        document.querySelector("#phoneNumber").value='';
        //if list is in view mode, let the updated array reflect
        if(contactTable.childElementCount!==0){Contact.viewContact();};
      };
    }
  
    static viewContact(){
      //remove old list
      Contact.hideContact();
      //add the header row
      const headerRow=contactTable.insertRow();
      headerRow.innerHTML='<th title="click to sort" class="firstName">First Name</th><th title="click to sort" class="lastName">Last Name</th><th title="click to sort" class="phoneNumber">Phone Number</th><td></td>';
      //Put event listeners for sorting when the above created table headers are clicked
      const tableHeads=headerRow.querySelectorAll('th');
      tableHeads.forEach(function(th){
        th.addEventListener('click',function(evt){
          const elementClasses=evt.target.classList;
          if (elementClasses.contains("firstName")) {
            Contact.sortByProperty('firstName');
          }
          if (elementClasses.contains("lastName")) {
            Contact.sortByProperty('lastName');
          }
          if (elementClasses.contains("phoneNumber")) {
            Contact.sortByProperty('phoneNumber');
          }
        });
      });
      //create body of table from our updated array
      for (let i = 0; i < allContacts.length; i++) {
      const row=contactTable.insertRow();
      //put delete icon at the end of every row
      row.innerHTML=`<td id="firstNameCell${i}">${allContacts[i].firstName}</td><td id="lastNameCell${i}">${allContacts[i].lastName}</td><td id="phoneNumberCell${i}">${allContacts[i].phoneNumber}</td><td id="binCell${i}" width="40" style="text-align:center" ><img id="bin${i}" height="20" src="assets/binImage.png" alt="Delete"/></td>`;
      //put event listeners for highlighting and clicking the delete cell
      document.querySelector(`#binCell${i}`).addEventListener('mouseover',() => Contact.highlight(i));
      document.querySelector(`#binCell${i}`).addEventListener('mouseout',() => Contact.unHighlight(i));
      document.querySelector(`#binCell${i}`).addEventListener('click',() => Contact.deleteContact(i));
      };
    }

    static hideContact(){
      //remove list
      contactTable.innerHTML='';
    }

    static clearContact(){
      console.log(`${allContacts.length} contact(s) cleared`);
      //empty our array and remove list
      allContacts=[];
      Contact.viewContact();
    }

    static saveContact(){
      //local storage works with strings only
      localStorage.contacts = JSON.stringify(allContacts);
      console.log(`${allContacts.length} contact(s) saved`);
    }

    static loadContact(){
     if(localStorage.contacts !== undefined){
      //parse the json response since it is stringified
      allContacts=JSON.parse(localStorage.contacts);
      console.log(`${allContacts.length} contact(s) loaded`);
      //let user see what has loaded immediately
      Contact.viewContact();
     } 
    }

    static deleteContact(index){
      console.log(`${JSON.stringify(allContacts[index])} deleted`);
      allContacts.splice(index,1);
      Contact.viewContact();
    }

    static highlight(index){
      document.querySelector(`#firstNameCell${index}`).style.backgroundColor='grey';
      document.querySelector(`#lastNameCell${index}`).style.backgroundColor='grey';
      document.querySelector(`#phoneNumberCell${index}`).style.backgroundColor='grey';
      document.querySelector(`#binCell${index}`).style.backgroundColor='grey';
      document.querySelector(`#bin${index}`).style.height='40px';
    }
  
    static unHighlight(index){
      document.querySelector(`#firstNameCell${index}`).style.backgroundColor='purple';
      document.querySelector(`#lastNameCell${index}`).style.backgroundColor='purple';
      document.querySelector(`#phoneNumberCell${index}`).style.backgroundColor='purple';
      document.querySelector(`#binCell${index}`).style.backgroundColor='purple';
      document.querySelector(`#bin${index}`).style.height='20px';
    }

    static sortByProperty(property) {
      allContacts.sort(function(a, b) {
        // Convert values to lowercase (if they are strings, leave them alone if they are numbers) cuz 'sort' considers A-Z to come before a-z in alphabetical order
        const valueA = typeof a[property] === 'string' ? a[property].toLowerCase() : a[property];
        const valueB = typeof b[property] === 'string' ? b[property].toLowerCase() : b[property];
        // Compare the values
        if (valueA < valueB) {
          return -1;
        } else if (valueA > valueB) {
          return 1;
        } else {
          return 0;
        }
      });
      //let the updated array reflect
      Contact.viewContact();
      console.log(`sorted by ${property}`);
    }

    static searchContact(prefix){
      searchTable.innerHTML='';
      if (searchBox.value!==''){
        for (let i = 0; i < allContacts.length; i++) {
          if ((allContacts[i].firstName.startsWith(prefix))||(allContacts[i].lastName.startsWith(prefix))||(allContacts[i].phoneNumber.startsWith(prefix))){
            const row=searchTable.insertRow();
            row.id=`row${i}`;
            row.innerHTML=`<td>${allContacts[i].firstName}</td><td>${allContacts[i].lastName}</td><td>${allContacts[i].phoneNumber}</td>`;
            document.querySelector(`#row${i}`).addEventListener('mouseover',()=>Contact.highlightSearch(i));
            document.querySelector(`#row${i}`).addEventListener('mouseout',()=>Contact.unHighlightSearch(i));
            document.querySelector(`#row${i}`).addEventListener('click',(evt)=>{Contact.showFound(i);evt.stopPropagation();});
            //I stopped propagation of the click event otherwise the click will propagate to parent elements and trigger the window click listener just created by showFound
            //Alternatively, I can instead use setTimeout() to wrap the creation of that window click listener in showFound to delay it so that propagation is finished before it is created. Even a delay of zero milliseconds will work
            //YES! the window click listener can be triggered by the same click that created it. setTimeout defers its creation to the next iteration in the JavaScript event loop, allowing any pending synchronous tasks like propagation or an updating UI to complete
          }
        } 
      }
    }

    static clearSearch(){
      searchTable.innerHTML='';
    }

    static highlightSearch(index){
      document.querySelector(`#row${index}`).style.backgroundColor='rgba(128, 128, 128, 0.5)';
    }

    static unHighlightSearch(index){
      document.querySelector(`#row${index}`).style.backgroundColor='rgba(128, 0, 128, 0.5)';
    }

    static showFound(index) {
      searchBox.value = '';
      Contact.clearSearch();
      Contact.highlight(index);
      function unHighlightHandler() {
        Contact.unHighlight(index);
        window.removeEventListener('click', unHighlightHandler);
      }
      window.addEventListener('click', unHighlightHandler);
    }


	}



  //event listeners
  addButton.addEventListener('click', Contact.addContact);
  viewButton.addEventListener('click',Contact.viewContact);
  hideButton.addEventListener('click',Contact.hideContact);
  clearButton.addEventListener('click',Contact.clearContact);
  saveButton.addEventListener('click',Contact.saveContact);
  loadButton.addEventListener('click',Contact.loadContact);
  searchBox.addEventListener('input',function(evt){Contact.searchContact(evt.target.value)});
  form.addEventListener("submit", function(event){event.preventDefault();}  ); //prevent default page reload
  window.addEventListener('click',(evt)=>{if(evt.target.id!=='searchBox')Contact.clearSearch()}); //note:I've prevented clicks on search table from propagating meaning they will not even be seen by any window click listener. Anyway, clicks on the search table will call showFound that calls clearSearch.
  
 

  //load saved contacts once page loads
  Contact.loadContact(); 

}
 






