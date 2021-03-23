const PASSCODE = "1234";

let groceryItemArray = [];

// define a constructor to create groceryItem objects
let GroceryItemObject = function (pName, pQuantity, pCategory, pNote) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.Name = pName;
    this.Quantity = pQuantity;
    this.Category = pCategory;  // household  produce  frozenFood  Beverage dairy  bakery  meat DryCannedFood snack
    this.Note = pNote;
}


groceryItemArray.push(new GroceryItemObject("egg", 1, "dairy", "cage-free brown organic egg"));
groceryItemArray.push(new GroceryItemObject("apple", 15, "produce", "organic honey crispy"));
groceryItemArray.push(new GroceryItemObject("dishwashing detergent", 1, "household", "cascade brand"));
groceryItemArray.push(new GroceryItemObject("toilet paper", 1, "household", ""));
groceryItemArray.push(new GroceryItemObject("sourdough bread", 3, "bakery", "with black olives"));




let selectedQuantity = "1";
let selectedCategory = "household";


document.addEventListener("DOMContentLoaded", function () {

    // login
    let userInputedPasscode = "";
    while(userInputedPasscode.trim() != PASSCODE) {
        userInputedPasscode = prompt("Please enter your passcode");
    } 

    var slideIndex =1;


    carousel();


    function carousel(){
        var i;
        var x = document.getElementsByClassName("Home_Slides");
        for(i = 0; i < x.length; i++)
        {
            x[i].style.display = "none";

        }
        slideIndex++;
        if(slideIndex > x.length) {slideIndex =1}
        x[slideIndex -1].style.display = "block";
        setTimeout(carousel, 3000);
    }


    createList();

// add button events ************************************************************************
    
    document.getElementById("buttonAdd").addEventListener("click", function () {
       // groceryItemArray.push(
           let newGroceryItem = new GroceryItemObject(document.getElementById("name").value, 
            selectedQuantity, selectedCategory, document.getElementById("note").value);
            addNewGroceryItem(newGroceryItem);

       // document.location.href = "index.html#ListAll";
    });
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("name").value = "";
        document.getElementById("quantity").selectedIndex = "0";
        document.getElementById("category").selectedIndex = "0";
        document.getElementById("note").value = "";
    });

    $(document).bind("change", "#quantity", function (event, ui) {
        selectedQuantity = $('#quantity').val();
    });

    $(document).bind("change", "#category", function (event, ui) {
        selectedCategory = $('#category').val();
    });

    document.getElementById("buttonSave").addEventListener("click", function () {
        saveGroceryItem(document.getElementById("IDparmHere").innerHTML);
        createList();  // recreate li list after removing one
        document.location.href = "index.html#ListAll";  // go back to movie list 
    });

    document.getElementById("buttonDelete").addEventListener("click", function () {
        deleteGroceryItem(document.getElementById("IDparmHere").innerHTML);
        createList();  // recreate li list after removing one
        document.location.href = "index.html#ListAll";  // go back to movie list 
    });

// 2 sort button event methods
    document.getElementById("buttonSortCategory").addEventListener("click", function () {
        groceryItemArray.sort(dynamicSort("Category"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    document.getElementById("buttonSortName").addEventListener("click", function () {
        groceryItemArray.sort(dynamicSort("Name"));
        createList();
        document.location.href = "index.html#ListAll";
    });

// end of add button events ************************************************************************

  
  
// page before show code *************************************************************************
    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
        FillArrayFromServer();
       // createList();
    });

    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#ViewDetail", function (event) {   // have to use jQuery 
        if (document.getElementById("IDparmHere").innerHTML =="change1") {
            alert('sorry, temporary error, please try again');
            document.location.href = "index.html#ListAll";
        }
        else {
        let localID = document.getElementById("IDparmHere").innerHTML;
        // console.log("localID: " + localID);
        let arrayPointer = GetArrayPointer(localID);
        // console.log("arrayPointer: " + arrayPointer);
        // console.log("groceryItemArray[arrayPointer]: " + groceryItemArray[arrayPointer]);
        // console.log("oneName: " + document.getElementById("oneName"));
        document.getElementById("oneName").value = groceryItemArray[arrayPointer].Name;
        document.getElementById("oneQuantity").value = groceryItemArray[arrayPointer].Quantity;
        document.getElementById("oneCategory").value = groceryItemArray[arrayPointer].Category;
        document.getElementById("oneNote").value = groceryItemArray[arrayPointer].Note;
       // FillArrayFromServer();
        }
    });
 
// end of page before show code *************************************************************************
});  
// end of wait until document has loaded event  *************************************************************************

function createList() {
    // clear prior data
    var divGroceryList = document.getElementById("divGroceryList");
    while (divGroceryList.firstChild) {    // remove any old data so don't get duplicates
    divGroceryList.removeChild(divGroceryList.firstChild);
    };

    var ul = document.createElement('ul');

    groceryItemArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        li.classList.add('oneGroceryItem'); 
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        li.setAttribute("data-parm", element.ID);
        li.innerHTML = element.Name;
        ul.appendChild(li);
    });
    divGroceryList.appendChild(ul)

    // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liArray = document.getElementsByClassName("oneGroceryItem");
    Array.from(liArray).forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
        console.log("id: " + parm);
        // get our hidden <p> and write THIS ID value there
        document.getElementById("IDparmHere").innerHTML = parm;
        // now jump to our page that will use that one item
        document.location.href = "index.html#ViewDetail";
        });
    });

};


// function deleteGroceryItem(which) {
//     console.log(which);
//     let arrayPointer = GetArrayPointer(which);
//     groceryItemArray.splice(arrayPointer, 1);  // remove 1 element at index 
// }





function saveGroceryItem(which) {
    // console.log(which);
    // let arrayPointer = GetArrayPointer(which);
    // groceryItemArray[arrayPointer].Name = document.getElementById("oneName").value;
    // groceryItemArray[arrayPointer].Quantity = document.getElementById("oneQuantity").value ;
    // groceryItemArray[arrayPointer].Category = document.getElementById("oneCategory").value;
    // groceryItemArray[arrayPointer].Note = document.getElementById("oneNote").value;

    let newGroceryItem =   new GroceryItemObject(document.getElementById("oneName").value, document.getElementById("oneQuantity").value,
             document.getElementById("oneCategory").value, 
          document.getElementById("oneNote").value) ;
           
          modifyGroceryItem(newGroceryItem);
          document.location.href = "index.html#ListAll";
}

// cycles thru the array to find the array element with a matching ID
function GetArrayPointer(localID) {
    for (let i = 0; i < groceryItemArray.length; i++) {
        if (localID === groceryItemArray[i].ID) {
            return i;
        }
    }
}


/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}

function FillArrayFromServer(){
    // using fetch call to communicate with node server to get all data
    fetch('/groceryList')
    .then(function (theResonsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function
        return theResonsePromise.json();
    })
    .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
    console.log(serverData);
    groceryItemArray.length = 0;  // clear array
    groceryItemArray = serverData;   // use our server json data which matches our objects in the array perfectly
    createList();  // placing this here will make it wait for data from server to be complete before re-doing the list
    })
    .catch(function (err) {
     console.log(err);
    });
};

// using fetch to push an object up to server
function addNewGroceryItem(newGroceryItem){
    // the required post body data is our movie object passed into this function
        
        // create request object
        const request = new Request('/addGroceryItem', {
            method: 'POST',
            body: JSON.stringify(newGroceryItem),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        
      // use that request object we just created for our fetch() call
      fetch(request)
      // wait for frist server promise response of "200" success 
      // (can name these returned promise objects anything you like)
         .then(function (theResonsePromise) {    // the .json sets up 2nd promise
          return theResonsePromise.json()  })
       // now wait for the 2nd promise, which is when data has finished being returned to client
          .then(function (theResonsePromiseJson) { 
            console.log(theResonsePromiseJson.toString()), 
            document.location.href = "#ListAll" 
            })
      // the client console log will write out the message I added to the Repsonse on the server
      .catch(function (err) {
          console.log(err);
      });
    
        
    }; // end of addNewGroceryItem

    function modifyGroceryItem(newGroceryItem){
        // movie constructor function gave this a new ID, set it back to what it was
        newGroceryItem.ID= document.getElementById("IDparmHere").innerHTML;
        // create fetch request object
     
        // a put requires both a URL passed value and an object in the body
        // that way you could tell the server, find the object with this ID  passed in the URL
        // and replace it with an object that is in the body that MIGHT have an updated and different ID.
        const request = new Request('/modifyGroceryItem/' + newGroceryItem.ID, {
            method: 'PUT',
            body: JSON.stringify(newGroceryItem),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
            
        // use that request object we just created for our fetch() call
        fetch(request)
        // wait for frist server promise response of "200" success 
            .then(function (theResponsePromise) {    // the .json sets up 2nd promise
                return theResponsePromise.json()  })
            // now wait for the 2nd promise, which is when data has finished being returned to client
            .then(function (theResonsePromiseJson) { 
                console.log(theResonsePromiseJson.toString()), 
                document.location.href = "#ListAll" 
            })
            // the client console log will write out the message I added to the Repsonse on the server
            .catch(function (err) {
                console.log(err);
        });
    }; // end of modifyGroceryItem

    function deleteGroceryItem(which) {
        fetch('/deleteGroceryItem/' + which,{
            method:'DELETE'
        })
        .then(function (theResonsePromise) {    
            alert("Item successfully deleted in cloud")
        })
        .catch(function (err) {
            alert("Item NOT deleted in cloud " + err);
        });
    };
    




    
    
