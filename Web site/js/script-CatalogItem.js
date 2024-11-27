///TODO Replace with Node.js later to directly access files
let listJewelry = ["Earings_Butterfly", "Earings_Crystal", "Earings_Dangles", "Earings_Loops", "Earings_Moon", "Earings_Starstud", "Earings_Stud"];
let listAssets = ["FaeRifle", "Pedistal"];
let listModels = ["AutomDress", "Butterfly", "BlackDress", "Chibi", "Elven_Archer", "FlowerDress", "Neko_set", "NinleynF", "NinleynF_Battle", "NinleynF_Casual", "NinleynF_Chain", "NinleynF_Shadow", "Stars"];
let prices = [	[],
				[],
				["$42.99", "$37.99", "$32.99", "$25.99", "$42.99", "$37.99", "$32.99", "$37.99", "$42.99", "$32.99", "$35.99", "$37.99", "$32.99"]
				];

let parentElm = '';
let childTag = '';
let childText = '';
let selectedPrice = '';
let isFormOpen = false;

let JewelryText = "Jewelry are small models that can be put onto a necklace, a bracelet or just worn. The size of these models vary but they are about the size of a dime. The weight of these models remain nice and light so as to not weigh down.";
let ModelText = "Models range in size dependent on which one is selected. Though most of them can be perfect for sitting on a desk or even on a small shelf. We love to decorate our walls with these, pairing them up with one another to almost tell a story with each.";
let PCText = "Each type has its own purpose within a PC environment. Each can help to spruce up your gaming style bringing your build to a new level. Designs are versatile to attempt to fit to most setups but as always please see each model to ensure that it will fit with your build.";
let CosplayText = "Cosplay models have an attempt to be a one size fits all. Each being designed from the ground up and made to fit well with a variety of models so you can mix, match and add to it in hopes that each can fit within multiple cosplays that like us is a dream to see put together.";

let displayString = '';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const entries = urlParams.entries();

//We only want to show items if there is a valid request
if(urlParams.size == 0)
{
	window.location.href = "Catalog.html";
}

//We have a param, check which it is and load those items
for (const entry of entries) {
	
	console.log(entry[0]);
	
  if(entry[0] == "Jewelry")
  {
	  GenerateJewelryTiles();
  }
  else if(entry[0] == "Models")
  {
	  GenerateModelTiles();
  }
  else if(entry[0] == "PC")
  {
	  
  }
  else if(entry[0] == "Cosplay")
  {
	  GenerateAssetTiles();
  }
}



function AddElmToParent()
{
	let childElm = document.createElement(childTag);
	
	if(childText != "")
		childElm.innerHTML = childText;
	
	parentElm.appendChild(childElm);
}

function GenerateModelTiles()
{
	let currentRow = "";
	
	parentElm = document.getElementsByClassName("activity-button-set")[0];
	childTag = "h3";
	childText = JewelryText;
	AddElmToParent();
	
	childTag = "br";
	childText = "";
	AddElmToParent();
	
	childTag = "h1";
	childText = "Model Prints";
	AddElmToParent();
	
	childTag = "table";
	childText = "";
	AddElmToParent();
	
	for(let count = 0; count < listModels.length; count++)
	{
		let holdRowParent;
		
		if(count == 0 || count % 4)
		{
			console.log("adding new row");
			parentElm = document.getElementsByTagName("table")[0];
			childTag = "tr";
			childText = "";
			AddElmToParent();
			
			parentElm = document.getElementsByTagName("tr")[Math.floor(count / 5)];
		}
		
		console.log("adding new cell");
		
		childTag = "td";
		childText = listModels[count];
		AddElmToParent();
		
		holdRowParent = parentElm;
		parentElm = document.getElementsByTagName("td")[count];
		
		childTag = "br";
		childText = "";
		AddElmToParent();
		
		childTag = "img";
		childText = "";
		AddElmToParent();
		let img = document.getElementsByTagName("img")[count];
		img.src = "img/Models/" + listModels[count] + ".png";
		img.style.height = "200px";
		
		childTag = "p";
		childText = "Price: " + prices[2][count];
		AddElmToParent();
		
		parentElm = holdRowParent;
	}
}

function GenerateAssetTiles()
{
	let currentRow = "";
	
	parentElm = document.getElementsByClassName("activity-button-set")[0];
	childTag = "h3";
	childText = JewelryText;
	AddElmToParent();
	
	childTag = "br";
	childText = "";
	AddElmToParent();
	
	childTag = "h1";
	childText = "Model Prints";
	AddElmToParent();
	
	childTag = "table";
	childText = "";
	AddElmToParent();
	
	for(let count = 0; count < listAssets.length; count++)
	{
		let holdRowParent;
		
		if(count == 0 || count % 4)
		{
			console.log("adding new row");
			parentElm = document.getElementsByTagName("table")[0];
			childTag = "tr";
			childText = "";
			AddElmToParent();
			
			parentElm = document.getElementsByTagName("tr")[Math.floor(count / 5)];
		}
		
		console.log("adding new cell");
		
		childTag = "td";
		childText = listAssets[count];
		AddElmToParent();
		
		holdRowParent = parentElm;
		parentElm = document.getElementsByTagName("td")[count];
		
		childTag = "br";
		childText = "";
		AddElmToParent();
		
		childTag = "img";
		childText = "";
		AddElmToParent();
		let img = document.getElementsByTagName("img")[count];
		img.src = "img/Assets/" + listAssets[count] + ".png";
		img.style.height = "250px";
		
		childTag = "p";
		childText = "Price: " + prices[1][count];
		AddElmToParent();
		
		parentElm = holdRowParent;
	}
}

function GenerateJewelryTiles()
{
	let currentRow = "";
	
	parentElm = document.getElementsByClassName("activity-button-set")[0];
	childTag = "h3";
	childText = JewelryText;
	AddElmToParent();
	
	childTag = "br";
	childText = "";
	AddElmToParent();
	
	childTag = "h1";
	childText = "Model Prints";
	AddElmToParent();
	
	childTag = "table";
	childText = "";
	AddElmToParent();
	
	for(let count = 0; count < listJewelry.length; count++)
	{
		let holdRowParent;
		
		if(count == 0 || count % 4)
		{
			console.log("adding new row");
			parentElm = document.getElementsByTagName("table")[0];
			childTag = "tr";
			childText = "";
			AddElmToParent();
			
			parentElm = document.getElementsByTagName("tr")[Math.floor(count / 5)];
		}
		
		console.log("adding new cell");
		
		childTag = "td";
		childText = listJewelry[count];
		AddElmToParent();
		
		holdRowParent = parentElm;
		parentElm = document.getElementsByTagName("td")[count];
		
		childTag = "br";
		childText = "";
		AddElmToParent();
		
		childTag = "img";
		childText = "";
		AddElmToParent();
		let img = document.getElementsByTagName("img")[count];
		img.src = "img/Jewelry/" + listJewelry[count] + ".png";
		img.style.width = "170px";
		
		childTag = "p";
		childText = "Price: " + prices[0][count];
		AddElmToParent();
		
		parentElm = holdRowParent;
	}
}
closeForm();
let clickCells = document.getElementsByTagName("td");

function OpenForm(parm)
{
	if(isFormOpen)
		return;
	
	selectedPrice = parm.currentTarget.myParam.children[2].innerHTML;
	
	document.getElementsByName("cost")[0].innerHTML = selectedPrice;
	
	parm.currentTarget.myParam.style.backgroundColor = "#a097d1";
	
	openForm();
}

for(count = 0; count < clickCells.length; count++)
{
	clickCells[count].addEventListener("click", OpenForm);
	clickCells[count].myParam = clickCells[count];
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
  
  isFormOpen = true;
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  
  isFormOpen = false;
  
  //Reset Background color when form closes
  let cells = document.getElementsByTagName("td");
  for(let cell of cells)
  {
	  cell.style.backgroundColor = "";
  }
}
