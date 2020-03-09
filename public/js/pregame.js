/* global Phaser*/

let pregame = new Phaser.Scene('pregame');

var score;

pregame.init = function(){
    this.start = false;
    this.done = false;
    this.upperRange;
    this.lowerRange;
    this.answerRange;
    this.score = 0;
    this.increment;
    this.qNum = 1;

    this.collectQ1 = true;
    this.collectQ2 = true;
    this.collectQ3 = true;
    this.collectQ4 = true;
    this.collectQ5 = true;
    this.collectQ6 = true;
    this.collectQ7 = true;
    this.collectQ8 = true;
    this.collectQ9 = true;
    this.collectQ10 = true;
    
    this.q1 = [];
    this.q2 = [];
    this.q3 = [];
    this.q4 = [];
    this.q5 = [];
    this.q6 = [];
    this.q7 = [];
    this.q8 = [];
    this.q9 = [];
    this.q10 = [];
    this.qList = [this.q1, this.q2, this.q3, this.q4, this.q5, this.q6, this.q7, this.q8, this.q9, this.q10];
    this.answerPlaces = [];
}

pregame.create = function(){

  this.socket = io.connect('http://172.20.10.4:7000');
    
  this.camera = this.cameras.main;
  
    this.map = this.make.tilemap({
      key: "background",
      tileWidth: 32,
      tileHeight: 32
    });
    this.tileset = this.map.addTilesetImage('water', "tiles");
    this.background = this.map.createStaticLayer("background", this.tileset, 0, 0);
    
    this.camera.setBounds(0, 0, 1024, 12288);
    this.physics.world.setBounds(0, 448, 1024, 12288);

    this.player = this.physics.add.sprite(512, 12088, 'ship');
    this.player.setCollideWorldBounds(true);
    this.camera.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();//allows for the detection of keyboard presses

    this.moving_music = this.sound.add('moving');

    this.prompt = this.add.text(512, 11688, 'Press SPACE To Start!',{
        fontSize: '64px',
    }).setOrigin(0.5);

    if(difficulty == 'easy'){
      this.increment = 1;
    }
    else if(difficulty == 'medium'){
      this.increment = 2;
    }
    else if(difficulty == 'hard'){
      this.increment = 3;
    }
  
    this.displayScore = this.add.text(512, 276, '0/10',{
      fontSize: '128px'
    }).setOrigin(0.5);

  //adding coins

  this.q10Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 1336 - 700,
      stepX: 204
    }
  });

  this.q9Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 2360 - 700,
      stepX: 204
    }
  });

  this.q8Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 3384 - 700,
      stepX: 204
    }
  });

  this.q7Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 4408 - 700,
      stepX: 204
    }
  });

  this.q6Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 5432 - 700,
      stepX: 204
    }
  });

  this.q5Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 6456 - 700,
      stepX: 204
    }
  });

  this.q4Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 7480 - 700,
      stepX: 204
    }
  });

  this.q3Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 8504 - 700,
      stepX: 204
    }
  });

  this.q2Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 9528 - 700,
      stepX: 204
    }
  });

  this.q1Coins = this.physics.add.group({
    key: 'coin',
    repeat: 3,
    setXY: {
      x: 204,
      y: 10552 - 700,
      stepX: 204
    }
  });
  
  this.q1Objects = this.q1Coins.getChildren();
  this.q2Objects = this.q2Coins.getChildren();
  this.q3Objects = this.q3Coins.getChildren();
  this.q4Objects = this.q4Coins.getChildren();
  this.q5Objects = this.q5Coins.getChildren();
  this.q6Objects = this.q6Coins.getChildren();
  this.q7Objects = this.q7Coins.getChildren();
  this.q8Objects = this.q8Coins.getChildren();
  this.q9Objects = this.q9Coins.getChildren();
  this.q10Objects = this.q10Coins.getChildren();

  var y = 1336;
  for(let q = 0; q < 10; q++){
      this.setQuestions(this.qList[q], y);
      y += 1024
  }

  //collecting the coins by checking overlaps of each group
  this.physics.add.overlap(this.player, this.q1Coins, this.collectQ1Coins, null, this);
  this.physics.add.overlap(this.player, this.q2Coins, this.collectQ2Coins, null, this);
  this.physics.add.overlap(this.player, this.q3Coins, this.collectQ3Coins, null, this);
  this.physics.add.overlap(this.player, this.q4Coins, this.collectQ4Coins, null, this);
  this.physics.add.overlap(this.player, this.q5Coins, this.collectQ5Coins, null, this);
  this.physics.add.overlap(this.player, this.q6Coins, this.collectQ6Coins, null, this);
  this.physics.add.overlap(this.player, this.q7Coins, this.collectQ7Coins, null, this);
  this.physics.add.overlap(this.player, this.q8Coins, this.collectQ8Coins, null, this);
  this.physics.add.overlap(this.player, this.q9Coins, this.collectQ9Coins, null, this);
  this.physics.add.overlap(this.player, this.q10Coins, this.collectQ10Coins, null, this);

  this.anim = this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers('boom'),
    frameRate: 12,
    repeat: 0
  });

  this.explodeSFX = this.sound.add('explosionSFX');
  this.correct = this.sound.add('correct');

  this.scoreOnHead = this.add.text(this.player.x, this.player.y - 60, 'Q: 1 Score: 0', {
    fontSize: '16px',
    fill: '#111'
  }).setOrigin(0.5);

}

pregame.update = function(){
  if(this.cursors.space.isDown){
    this.prompt.setText('');
    this.start = true;
    console.log("start == true");
    this.moving_music.play();
  }
  if(this.start){//checks if this.start is true
    this.player.setVelocityY(-300);//sets players upwards movement speed
  }

  if(this.cursors.left.isDown){
    this.player.setVelocityX(-800);//sets left movement speed
  }
  else if(this.cursors.right.isDown){
    this.player.setVelocityX(800);//sets right movement speed
  }
  else{
    this.player.setVelocityX(0);//sets the lateral speed to 0 when no key is being pressed
  }

  this.scoreOnHead.x = this.player.x;
  this.scoreOnHead.y = this.player.y - 60;
  this.scoreOnHead.setText('Q: '+ this.qNum + ' Score: '+this.score);

  if(this.player.y < 10552 - 700 && this.player.y > 9528 - 700){
    this.qNum = 2;
  }
  else if(this.player.y < 9528 - 700 && this.player.y > 8504 - 700){
    this.qNum = 3;
  }
  else if(this.player.y < 8504 - 700 && this.player.y > 7480 - 700){
    this.qNum = 4;
  }
  else if(this.player.y < 7480 - 700 && this.player.y > 6456 - 700){
    this.qNum = 5;
  }
  else if(this.player.y < 6456 - 700 && this.player.y > 5432 - 700){
    this.qNum = 6;
  }
  else if(this.player.y < 5432 - 700 && this.player.y > 4408 - 700){
    this.qNum = 7;
  }
  else if(this.player.y < 4408 - 700 && this.player.y > 3384 - 700){
    this.qNum = 8;
  }
  else if(this.player.y < 3384 - 700 && this.player.y > 2360 - 700){
    this.qNum = 9;
  }
  else if(this.player.y < 2360 - 700 && this.player.y > 1336 - 700){
    this.qNum = 10; 
  }
  else if(this.player.y < 1336 - 700){
    this.done = true;
    score = this.score;
  }
  if(this.player.y == 490){
    this.moving_music.stop();
  }

  this.displayScore.setText(this.score / this.increment + " / 10");

  if(this.done){
    this.finished = this.add.text(512, 400, "PRESS SPACE TO MOVE ON!",{
      fontSize: '32px',
      fill: '#111'
    }).setOrigin(0.5);
    if(this.done && this.cursors.space.isDown){
      this.socket.emit('finished', score, difficulty);
      console.log('score: ' + score);
      window.location = "/attributes";
    }
  }
}

pregame.setQuestions = function(array, yCoord){
    if(difficulty == 'easy'){
        this.lowerRange = 10;
        this.upperRange = 10;
        this.answerRange = 20;
    }
    else if(difficulty == 'medium'){
        this.upperRange = 25;
        this.lowerRange = 25;
        this.answerRange = 50;
    }
    else if(difficulty == 'hard'){
        this.upperRange = 50;
        this.lowerRange = 50;
        this.answerRange = 100;
    }

    //console.log(this.lowerRange + " ," + this.upperRange);

    this.num1 = Math.floor(Math.random()*this.upperRange)+this.lowerRange;
    this.num2 = Math.floor(Math.random()*this.upperRange)+this.lowerRange;
    this.answer = this.num1 + this.num2;
  
    this.one = this.answer;
    this.two = this.answer;
    this.three= this.answer;

    while(this.one == this.answer){
        this.one = Math.floor(Math.random()*this.answerRange)+this.answerRange;
    }
    while(this.two == this.answer){
        this.two = Math.floor(Math.random()*this.answerRange)+this.answerRange;
    }
    while(this.three == this.answer){
        this.three= Math.floor(Math.random()*this.answerRange)+this.answerRange;
    }
  
    array.push(this.answer.toString());
    array.push(this.one.toString());
    array.push(this.two.toString());
    array.push(this.three.toString());

    this.final_array = this.shuffle(array);
    
    this.question = this.add.text(512, yCoord, this.num1.toString()+' + '+this.num2.toString(),{
        fontSize: '128px'
    }).setOrigin(0.5);

    this.optionX = 204;
    this.gap = 204;

    for(let i = 0; i < 4; i++){
        this.add.text(this.optionX, yCoord - 700, this.final_array[i], {
          fontSize: '53px',
          fill: '#111'
        }).setOrigin(0.5);
    
        this.optionX += this.gap;
    }

    this.answerPlaces.unshift(this.final_array.indexOf(this.answer.toString()));
    console.log(this.final_array.indexOf(this.answer.toString()));
};

pregame.shuffle = function(array){
    this.currentIndex = array.length, this.temporaryValue, this.randomIndex;
  
    while (0 !== this.currentIndex) {
  
      this.randomIndex = Math.floor(Math.random() * this.currentIndex);
      this.currentIndex -= 1;
  
      this.temporaryValue = array[this.currentIndex];
      array[this.currentIndex] = array[this.randomIndex];
      array[this.randomIndex] = this.temporaryValue;
    }
    return array;
  };

  //collect coins
  pregame.collectQ1Coins = function(player, coin){
    if(this.collectQ1){
      this.collectQ1 = false;
      coin.disableBody(true, true);
      if(coin == this.q1Objects[this.answerPlaces[0]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q1Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q1Explode.anims.load('explode');
        this.q1Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ2Coins = function(player, coin){
    if(this.collectQ2){
      this.collectQ2 = false;
      coin.disableBody(true, true);
      console.log(this.answerPlaces[1]);
      if(coin == this.q2Objects[this.answerPlaces[1]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q2Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q2Explode.anims.load('explode');
        this.q2Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ3Coins = function(player, coin){
    if(this.collectQ3){
      this.collectQ3 = false;
      coin.disableBody(true, true);
      if(coin == this.q3Objects[this.answerPlaces[2]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q3Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q3Explode.anims.load('explode');
        this.q3Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ4Coins = function(player, coin){
    if(this.collectQ4){
      this.collectQ4 = false;
      coin.disableBody(true, true);
      if(coin == this.q4Objects[this.answerPlaces[3]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q4Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q4Explode.anims.load('explode');
        this.q4Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ5Coins = function(player, coin){
    if(this.collectQ5){
      this.collectQ5 = false;
      coin.disableBody(true, true);
      if(coin == this.q5Objects[this.answerPlaces[4]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q5Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q5Explode.anims.load('explode');
        this.q5Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ6Coins = function(player, coin){
    if(this.collectQ6){
      this.collectQ6 = false;
      coin.disableBody(true, true);
      if(coin == this.q6Objects[this.answerPlaces[5]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q6Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q6Explode.anims.load('explode');
        this.q6Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ7Coins = function(player, coin){
    if(this.collectQ7){
      this.collectQ7 = false;
      coin.disableBody(true, true);
      if(coin == this.q7Objects[this.answerPlaces[6]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q7Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q7Explode.anims.load('explode');
        this.q7Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ8Coins = function(player, coin){
    if(this.collectQ8){
      this.collectQ8 = false;
      coin.disableBody(true, true);
      if(coin == this.q8Objects[this.answerPlaces[7]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q8Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q8Explode.anims.load('explode');
        this.q8Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ9Coins = function(player, coin){
    if(this.collectQ9){
      this.collectQ9 = false;
      coin.disableBody(true, true);
      if(coin == this.q9Objects[this.answerPlaces[8]]){
        this.correct.play();
        this.score += this.increment;
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q9Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q9Explode.anims.load('explode');
        this.q9Explode.anims.play('explode');
      }
    }
  };
  pregame.collectQ10Coins = function(player, coin){
    if(this.collectQ10){
      this.collectQ10 = false;
      coin.disableBody(true, true);
      if(coin == this.q10Objects[this.answerPlaces[9]]){
        this.correct.play();
        this.score += this.increment;
        this.display
        console.log('score: '+this.score);
      }
      else{
        this.explodeSFX.play();
        this.q10Explode = this.add.sprite(coin.x, coin.y, 'boom').setOrigin(0.5);
        this.q10Explode.anims.load('explode');
        this.q10Explode.anims.play('explode');
      }
    }
  };