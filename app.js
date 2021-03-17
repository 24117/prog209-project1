var express = require('express');
var path = require('path');

//leaving in the bodyParser in case we ever send up form data and need to get data out of form
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

const PASSCODE = "1234";

let servergroceryItemArray = [];

// define a constructor to create groceryItem objects
let GroceryItemObject = function (pName, pQuantity, pCategory, pNote) {
    this.ID = Math.random().toString(16).slice(5)  // tiny chance could get duplicates!
    this.Name = pName;
    this.Quantity = pQuantity;
    this.Category = pCategory;  // household  produce  frozenFood  Beverage dairy  bakery  meat DryCannedFood snack
    this.Note = pNote;
}


servergroceryItemArray.push(new GroceryItemObject("egg", 1, "dairy", "cage-free brown organic egg"));
servergroceryItemArray.push(new GroceryItemObject("apple", 15, "produce", "organic honey crispy"));
servergroceryItemArray.push(new GroceryItemObject("dishwashing detergent", 1, "household", "cascade brand"));
servergroceryItemArray.push(new GroceryItemObject("toilet paper", 1, "household", ""));
servergroceryItemArray.push(new GroceryItemObject("sourdough bread", 3, "bakery", "with black olives"));


// just one "site" with 2 pages, / and about

// use res.render to load up an ejs view file
// index page 


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/groceryList', function(req, res)
{
    res.json(servergroceryItemArray);
});

/* POST to addGroceryItem */
app.post('/addGroceryItem', function(req, res) {
    console.log(req.body);
    servergroceryItemArray.push(req.body);
    // set the res(ponse) object's status propery to a 200 code, which means success
    res.status(200).send(JSON.stringify('success'));
  });

 /* DELETE to deleteGroceryItem */
 app.delete('/deleteGroceryItem/:id', function(req, res) {
    let id = req.params.id;   // this is how you pick out items passed in the URL, there can be more than 1
     for(let i=0; i < servergroceryItemArray.length; i++) {
       if(id == (servergroceryItemArray[i].ID) ) {
       servergroceryItemArray.splice(i,1);
       }
     }
     res.status(200).send(JSON.stringify('deleted successfully'));
});

app.put('/modifyGroceryItem/:id', (req, res) => {
    let id = req.params.id;
    let GroceryItemObject = req.body;
    for (var i = 0; i < servergroceryItemArray.length; i++) {
        if (servergroceryItemArray[i].ID == id) {
            servergroceryItemArray[i] = GroceryItemObject;  // remove 1 element at loc i
            res.send('success');
        }
    }
    res.status(404);  // if not found
});




// error page 
app.get('/error', function(req, res) {
    // should get real data from some real operation, but instead ...
    let message = "some text from someplace";
    let errorObject ={
        status: "this is real bad",
        stack: "somebody called #$% somebody who called somebody <awful>"
    };
    res.render('pages/error', {  // pass the data to the page renderer
        message: message,
        error: errorObject
    });
});



app.listen(3000);  // not setting port number in www.bin, simple to do here
console.log('3000 is the magic port');

module.exports = app;
