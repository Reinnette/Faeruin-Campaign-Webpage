// JavaScript Document
//Code the js/script-1.js file so the blue buttons below do what they say they will. Do not alter the HTML in the body, and do not alter the CSS document.
let alertText = "";
function DisplayAlert(){
  window.alert(alertText);
} 

function RowClickEvent(param)
{
	window.location.href = "CatalogItem.html?" + param.currentTarget.myParam;
}

let clickRows = document.getElementsByClassName("clickable-row");
for(count = 0; count < clickRows.length; count++)
{
	clickRows[count].addEventListener("click", RowClickEvent);
	clickRows[count].myParam = clickRows[count].id;
}

let itemToGet = "";
let itemPos = 0;
let newText = "";
function ChangeItemText(){
	document.getElementsByTagName(itemToGet)[itemPos].innerHTML = newText;
}

function GiveClassToElement(){
	document.getElementsByTagName(itemToGet)[itemPos].className = newText;
}

function ChangeElementStyle(){
	document.getElementsByTagName(itemToGet)[itemPos].style.background = "blue";
	document.getElementsByTagName(itemToGet)[itemPos].style.fontWeight = "bold";
}

let isVisible = true;
function ChangeImgVisibility(){
	let suns = document.getElementsByTagName("img");
	
	for (let count = 0; count < suns.length; count++)
	{	
		if(isVisible) {
			suns[count].display = "initial";
		}
		else {
			suns[count].display = "none";
		}
	}
}

let parentTag = "";
let childTag = "";
let childText = "";
let parentPos = 0;
function AddElmToParent(){
	let parentElm = document.getElementsByTagName(parentTag)[parentPos];
	let childElm = document.createElement(childTag);
	childElm.innerHTML = childText;
	parentElm.appendChild(childElm);
}

// 1. Click me to show "You clicked button 1" in an alert box 
function Button1DisplayAlert(){
	alertText = "You clicked button 1";
	DisplayAlert();
} 

document.getElementById("button-1").addEventListener("click", Button1DisplayAlert);

// 2. Hover over me to change item C. in the Summer To-Do List to say a different phrase. (It can stay that way permanently) 
function Button2HoverChangeText(){
	itemToGet = "li";
	itemPos = 5;
	newText = "Make an indi game";
	ChangeItemText();
} 

document.getElementById("button-2").addEventListener("mouseenter", Button2HoverChangeText);

// 3. Click me to give the class "yikes" to item D in the Summer To-Do List. It will end up looking very yellow! 
function Button3GiveClass(){
	itemToGet = "li";
	itemPos = 6;
	newText = "yikes";
	GiveClassToElement();
} 

document.getElementById("button-3").addEventListener("click", Button3GiveClass);

// 4. Click me to change any two style properties for the Skiing item in the Summer To-Do List so it looks really special 
function Button4GiveStyle(){
	itemToGet = "li";
	itemPos = 7;
	ChangeElementStyle();
} 

document.getElementsByTagName("button")[3].addEventListener("click", Button4GiveStyle);

// 5. Click me to make the two suns at top of page go away (display:none) 
function Button5ImgDisplayNone() {
	isVisible = false;
	ChangeImgVisibility();
}

document.getElementsByTagName("button")[4].addEventListener("click", Button5ImgDisplayNone);


// 6. Click me to make the two suns reappear 
function Button6ImgDisplayBlock() {
	isVisible = true;
	ChangeImgVisibility();
}

document.getElementsByTagName("button")[5].addEventListener("click", Button6ImgDisplayBlock);

// 7. Click me to add to the Summer To-Do List an HTML list item that says "Earn some money" 
function Button7AddChild() {
	parentTag = "ol";
	childTag = "li";
	childText = "Earn some money";
	parentPos = 1;
	AddElmToParent();
}

document.getElementsByTagName("button")[6].addEventListener("click", Button7AddChild);

// 8. Click me to add to the Summer To-Do List an HTML list item that says "Go Zip Lining" 
function Button8AddChild() {
	parentTag = "ol";
	childTag = "li";
	childText = "Go Zip Lining";
	parentPos = 1;
	AddElmToParent();
}

document.getElementsByTagName("button")[7].addEventListener("click", Button8AddChild);

// 9. Click me to add to the Summer To-Do List an HTML list item that says whatever words the user has typed in the text input field below button #9.
function Button9AddChild() {
	parentTag = "ol";
	childTag = "li";
	childText = document.getElementsByTagName("input")[0].value;
	parentPos = 1;
	AddElmToParent();
}

document.getElementsByTagName("button")[8].addEventListener("click", Button9AddChild);

// Done coding the index page? Move on to code script-2.js...


var coll = document.getElementsByClassName("main-btnList");

coll.addEventListener("hover", function () {
    var content = this.nextElementSibling;
    if (content.style.display == "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
});