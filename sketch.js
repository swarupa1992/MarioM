//Mario game

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var life = 3;
var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var bricksGroup, brickImage;

var obstacle,obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score = 0;
var gameOverImg,restartImg;
 var jumpSound , checkPointSound, dieSound;

var bg;

function preload(){
  
  mario_running = loadAnimation("mario01.png","mario02.png","mario00.png");
  mario_collided = loadAnimation("mario03.png");
  
  groundImage = loadImage("ground2.png");
  
  bg = loadImage("bg.png");
  
  brickImage = loadImage("brick.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
         
  
  restartImg = loadImage("restart.png")  
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  
  //createCanvas(600, 350);
  createCanvas(windowWidth, windowHeight);
  
  mario = createSprite(60,height-100,20,50);//295
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 2;
  
   
  //ground = createSprite(300,330,400,20);680-560 center 
  ground = createSprite(width/2,height-40,width,100);
  ground.addImage("ground",groundImage);
  //ground.x = width /2;
  ground.scale = 1.6;
  
  invisibleGround = createSprite(width/2,height-80,width,45);
  
  //invisibleGround = createSprite(100,300,400,15);
  invisibleGround.visible = false;
  
  
  bricksGroup = createGroup();
  obstaclesGroup = createGroup();
    
  
  //gameOver = createSprite(300,100);
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  //restart = createSprite(300,140);
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  
  obstacle4.scale = 3.0;
   
  mario.setCollider("rectangle",0,0,mario.width-4,mario.height-4);
  //mario.debug = true;
  
  //score = 0;
  
}

function draw() {
  
  background(bg);
  text(mouseX + " " + mouseY , 100,50);
  textSize(20);
  fill(0);
  
  //displaying score
  text("Score: "+ score, width-200,30);
  text("Life: "+ life, width-200,50);
  
  
 
  if(gameState === PLAY){
    
    gameOver.visible = false;
    restart.visible = false;
     
     mario.changeAnimation("running", mario_running);
    
     
  if(score>0 && score%10 === 0){
    
       checkPointSound.play()   
    }
    
       
   ground.velocityX = -(4 + score /20);
  
  if (ground.x < 400){
      ground.x = ground.width/2;
    }
      
    
    mario.collide(invisibleGround); 
  //jump when the space key is pressed
    //225 = height-150
    if(touches.length > 0 || keyDown("space") && mario.y >= height-350) {
      
        mario.velocityY = -12;
        jumpSound.play();
         touches = [];
    }
    
    //add gravity
    mario.velocityY = mario.velocityY + 0.8
  
  //spawn obstacles on the ground
    spawnObstacles();
       
  
    //spawn the clouds
    spawnBricks();
    
  for(var i = 0; i< bricksGroup.length;i++){
    if(bricksGroup.get(i).isTouching(mario)){
      
      bricksGroup.get(i).remove();
      score = score + 1;
      
    }
 
  }
    
for(var i = 0; i< obstaclesGroup.length;i++){
  
    if(obstaclesGroup.get(i).isTouching(mario)){
      
      obstaclesGroup.get(i).remove();
      life = life - 1;
     
    }
 
  }
  
  
    
    if(life === 0 ){ 
      
      gameState = END;
      
    }
    
  }//play
  
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
     
    
     
     //change the mario animation
      mario.changeAnimation("collided", mario_collided);
       
      
     
      ground.velocityX = 0;
      mario.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     bricksGroup.setVelocityXEach(0);  
     
     if(touches.length>0 || mousePressedOver(restart)) {      
      reset();
      touches = [];
    }
   }
    
  
  
 
  drawSprites();

}


function reset(){
  
       gameState = PLAY;
  
       gameOver.visible = false;
       restart.visible = false;
  
       score = 0;
  
       obstaclesGroup.destroyEach();
       bricksGroup.destroyEach(); 
     
       score = 0;
       life = 3;
      
  
}


function spawnObstacles(){
  
 if (frameCount % 60 === 0){
   
   obstacle = createSprite(width+10,height-75,10,40);//165
   obstacle.velocityX = -( 10+ score/10);
   
    obstacle.y = Math.round(random(250,350));
    //obstacle.velocityX = -6;
   
    //generate random obstacles
    var rand = Math.round(random(1,4));
   
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      
      //default: break;
    }
   
    //assign scale and lifetime to the obstacle 
   
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
   
    obstacle.depth = mario.depth;
    mario.depth = mario.depth + 1;
  
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnBricks() {
  
  // to spawn the bricks
  //width+20,height-300
  
 if (frameCount % 40 === 0) {
   
    var brick = createSprite(width+20,height-300,40,10);
    brick.y = Math.round(random(230,380));
    brick.addImage(brickImage);
    brick.scale = 1.0;
    //brick.velocityX = -( 7 + score/5);
    brick.velocityX = -8;
     //assign lifetime to the variable
   
    brick.lifetime = 200;
    
    //adjust the depth
    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each cloud to the 
    bricksGroup.add(brick);
  }
}  

