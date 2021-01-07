//Create the variables here. 
var dog, dogImage, happyDog;
var database, foods, foodStock;
var feedTime, lastFed;
var foodObj;
var bedroom, garden, washroom; 
var gameState = "hungry";
var currentTime;

function preload(){
  //Load the images here. 
  dogImage = loadImage("dogImg.png");
  happyDog = loadImage("dogImg2.png");
  bedroomImage = loadImage("images/Bedroom.png");
  gardenImage = loadImage("images/Garden.png");
  washroomImage = loadImage("images/Washroom.png");
  livingRoomImage = loadImage("images/LivingRoom.png")
}

function setup(){
  database = firebase.database();
  createCanvas(400, 500);

  currentTime = hour();
  
  foodObj = new Food();

  dog = createSprite(230,400,150,150);
  dog.addImage(dogImage);
  dog.scale = 0.15;

  feed = createButton("Feed Drago!");
  feed.position(410,155);  
  feed.mousePressed(feedDog);

  addFood = createButton("Add More Food");
  addFood.position(510,155);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
}

function draw(){
  background(46,139,87);

  feedTime = database.ref('feedTime')
  feedTime.on("value", function(data){
  lastFed = data.val();
  })

  fill(255);
  textSize(20);

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
  }

  else{
    feed.show();
    addFood.show();
    dog.addImage(dogImage)
  }

  if(currentTime === lastFed - 1){
    update("Bathing");
     dog.remove();
    foodObj.bathroom();
  }

 else if(currentTime==(lastFed - 2)){
   update("Playing");
   foodObj.garden();
 }

 else if(currentTime==(lastFed - 3)){
  update("Sleeping");
  foodObj.bedRoom();
}

else if(currentTime==(lastFed - 4)){
  update("Lounging");
  foodObj.living();
}

 else{
  update("Hungry")
  foodObj.display();
 }

  if(lastFed >= 12){
    text("Last Fed: " + lastFed%12 + " P.M.", 65, 40);
  }

  else if(lastFed === 0){
    text("Last Fed: 12 A.M.", 65, 40);
  }

  else{
    text("Last Fed:" + lastFed + " A.M", 65, 40);
  }

  foodObj.display();
  drawSprites();
}

function readStock(data){
  foods = data.val();
  foodObj.updateFoodStock(foods);
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}

function addFoods(){
  foods+=1;
  foodObj.updateFoodStock(foodObj.getFoodStock() + 1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    Food:foods
  })
}

//update the gameState
function update(state){
  database.ref('/').update(
    {
      gameState:state
    }
  )
}