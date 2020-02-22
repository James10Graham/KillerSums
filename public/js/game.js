

var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1024,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload(){
  this.load.tilemapTiledJSON('background', '/assets/multiplayer_background.json');
  this.load.image('tiles', '/assets/water.png');
  this.load.image('player', '/assets/ships/blackShip/blackShipFull.png');
  this.load.image('bullet', '/assets/cannonBall.png');
  this.load.image('chest', '/assets/chest.png');
}

function create(){
  this.nextFire = 0;
  this.chestCount = 15;
  this.score = 0;
  this.invinsable = false;
  this.died = false;

  var self = this;

  this.socket = io.connect('http://localhost:8000');
  this.socket.emit('connected');

  //groups
  this.otherPlayers = this.physics.add.group();
  this.bullets = this.physics.add.group();
  this.otherBullets = this.physics.add.group();
  this.chests = this.physics.add.group();

  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
    self.socket.emit('serverChests');
  });

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
  });

  this.socket.on('remove', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        console.log('id = socketid')
        otherPlayer.destroy();
        delete self.otherPlayers.id;
      }
    });

  });

  this.socket.on('fire', function(bullets){
    Object.keys(bullets).forEach(function(id){
      if(bullets[id].bulletId === self.socket.id){
        self.bullet = self.physics.add.image(bullets[id].x, bullets[id].y, 'bullet').setOrigin(0.5).setDepth(1);
        self.bullet.setRotation(bullets[id].rotation);
        self.bullets.add(self.bullet);
        self.socket.emit('emitBullets', self.bullet, self.bullet.rotation);
      }
    });
  });

  this.socket.on('otherBullets', function(otherBullet, bulletInfo, rotation, speed){
    console.log(rotation);
    self.otherBullet = self.physics.add.image(otherBullet.x, otherBullet.y, 'bullet').setOrigin(0.5).setDepth(1);
    self.otherBullet.setRotation(rotation);
    self.bulletR = rotation;
    self.otherBulletSpeed = speed;
    self.otherBullets.add(self.otherBullet);
  });

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if(playerInfo.playerId === otherPlayer.playerId){
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });

  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if(playerInfo.playerId === otherPlayer.playerId){
        otherPlayer.setRotation(playerInfo.rotation);
        otherPlayer.setPosition(playerInfo.x, playerInfo.y);
      }
    });
  });

  this.socket.on('addChests', (chestMethod)=>{
    console.log('add chest listener');
    for(var i = 0; i < chestMethod.length; i++){
      console.log(chestMethod[i]);
      self.chest = self.physics.add.image(chestMethod[i].x, chestMethod[i].y, 'chest').setOrigin(0.5).setDepth(1);
      if(chestMethod[i].size <= 1){
        self.chest.setScale(0.5);
        self.chest.width *= 0.5;
        self.chest.height *= 0.5;
      }
      else if(chestMethod[i].size <= 2 && chestMethod[i].size > 1){
        self.chest.setScale(0.75);
        self.chest.width *= 0.75;
        self.chest.height *= 0.75;
      }
      else{
        self.chest.setScale(1);
      }
      this.chests.add(this.chest);
      this.chestCount ++;
    }
  });
  
  this.cursors = this.input.keyboard.createCursorKeys();

  this.camera = this.cameras.main;
  this.camera.setBounds(0, 0, 3072, 2400);
  this.physics.world.setBounds(0, 0, 3072, 2400);

  this.map = this.make.tilemap({
    key: "background",
    tileWidth: 32,
    tileHeight: 32
  });
  this.tileset = this.map.addTilesetImage('water', "tiles");
  this.background = this.map.createStaticLayer("background", this.tileset, 0, 0);

  this.healthBar = this.add.graphics({
    fillStyle:{
      color: 0x88ff70
    },
  });

  this.healthText = this.add.text({
    fontSize: '10px',
  }).setOrigin(0.5);
}

function update(){
  if(this.chestCount < 15){
    this.chestX = Math.floor(Math.random()*3052)+10;
    this.chestY = Math.floor(Math.random()*2380)+10;
    this.chestSize = Math.random()*3;

    this.chest = this.physics.add.image(this.chestX, this.chestY, 'chest').setOrigin(0.5).setDepth(1);

    if(this.chestSize <= 1){
      this.chest.setScale(0.5);
      this.chest.width *= 0.5;
      this.chest.height *= 0.5;
    }
    else if(this.chestSize <= 2 && this.chestSize > 1){
      this.chest.setScale(0.75);
      this.chest.width *= 0.75;
      this.chest.height *= 0.75;
    }
    else{
      this.chest.setScale(1);
    }
    this.chests.add(this.chest);
    this.chestCount ++;
  };

  if(this.ship){
    this.healthBar.clear();
    this.healthPercent = Math.floor((this.currentHealth/this.maxHealth)*100);
    if(this.healthPercent <= 100 && this.healthPercent > 50){
      this.healthBar.fillStyle(0x88ff70);
    }
    else if(this.healthPercent <= 50 && this.healthPercent>25){
      this.healthBar.fillStyle(0xffb970);
    }
    else if(this.healthPercent <= 25 && this.healthPercent>0){
      this.healthBar.fillStyle(0xf9746d)
    }
    else if(this.healthPercent <= 0){
      this.health = 0;
      if(this.died == false){
        this.died = true;
        console.log('died');
        this.socket.emit('died', this.score);
        window.location = '/game/over';
      }
    }
    this.healthBar.fillRect(this.ship.x-50, this.ship.y-80, this.healthPercent, 8);

    this.healthText.x = this.ship.x;
    this.healthText.y = this.ship.y - 100;
    this.healthText.setText(this.currentHealth+'/'+this.maxHealth);

    this.scoreText.x = this.ship.x;
    this.scoreText.y = this.ship.y - 120;
    this.scoreText.setText("Score: "+this.score);

    //movement
    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-150);
    }
    else if(this.cursors.right.isDown) {
      this.ship.setAngularVelocity(150);
    }
    else{
      this.ship.setAngularVelocity(0);
    }

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(this.ship.rotation + 1.570796327, -this.speed, this.ship.body.velocity);
    } else {
      this.ship.setVelocity(0);
    }

    if(this.cursors.space.isDown){
      if(this.time.now > this.nextFire){
        this.socket.emit('keypress');
        this.nextFire = this.time.now + this.fireRate;
      }
    }

    var playerX = this.ship.x;
    var playerY = this.ship.y;
    var playerR = this.ship.rotation;

    if (this.ship.oldPosition && (playerX !== this.ship.oldPosition.x || playerY !== this.ship.oldPosition.y || playerR !== this.ship.oldPosition.rotation)) {
      this.socket.emit('playerMovement', {
        x: this.ship.x,
        y: this.ship.y,
        rotation: this.ship.rotation,
      });
    }

    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation,
    };
  }
  if(this.bullet){
    this.physics.velocityFromRotation(this.bullet.rotation + 1.570796327 , -this.bulletSpeed, this.bullet.body.velocity);
  };
  if(this.otherBullet){
    this.physics.velocityFromRotation(this.bulletR + 1.570796327 , -this.otherBulletSpeed, this.otherBullet.body.velocity);
  };
}

function addPlayer(self, playerInfo){
  self.ship = self.physics.add.image(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5).setDepth(2);
  self.ship.setCollideWorldBounds(true);
  self.camera.startFollow(self.ship);
  //assigning the variable for the changable attributes
  self.speed = playerInfo.speed;
  console.log("player speed:",self.speed);

  self.maxHealth = playerInfo.health;
  self.currentHealth = self.maxHealth;
  console.log("max health:",self.maxHealth);
  console.log("current health:",self.currentHealth)


  self.bulletSpeed = playerInfo.bulletSpeed;
  console.log("bullet speed:",self.bulletSpeed);

  self.fireRate = playerInfo.fireRate;
  console.log("fire rate:",self.fireRate);

  self.regenPerKill = playerInfo.regenPerKill;
  console.log('regen per kill:',self.regenPerKill);

  self.bulletDamage = playerInfo.damage;

  self.physics.add.collider(self.ship, self.otherBullets, (player, otherBullet)=>{
    if(self.invinsable == false){
      console.log('collide', self.currentHealth);
      self.currentHealth -= self.bulletDamage
      otherBullet.disableBody(true, true);
    }
  }, null, this);

  self.physics.add.overlap(self.otherPlayers, self.bullets, (otherPlayer, bullet)=>{
    bullet.disableBody(true, true);
    if(self.currentHealth <= self.maxHealth-self.regenPerKill){
      self.currentHealth += self.regenPerKill;
    }
    else{
      self.currentHealth = self.maxHealth;
    }
  }, null, this);
  self.physics.add.overlap(self.otherPlayers, self.otherBullets, (player, otherBullet)=>{
    otherBullet.disableBody(true, true);
  }, null, this);

  self.physics.add.overlap(self.otherPlayers, self.otherBullets, (player, otherBullet)=>{
    otherBullet.disableBody(true, true);
  }, null, this);

  self.physics.add.overlap(self.ship, self.chests, (player, chest)=>{
    self.invinsable = true;
    chest.disableBody(true, true);
    this.chestCount --;
    if(chest.width == 50){
      console.log('small');
      self.easyNum1 = Math.floor(Math.random()*25)+1;
      self.easyNum2 = Math.floor(Math.random()*25)+1;
      self.easyAnswer = self.easyNum1 + self.easyNum2;

      self.easyOutput = prompt(self.easyNum1+'+'+self.easyNum2+'=');

      if(self.easyOutput == self.easyAnswer){
        self.score += 10;
        if(self.currentHealth <= self.maxHealth-10){
          self.currentHealth += 10;
        }
        else{
          self.currentHealth = self.maxHealth;
        }
        self.invinsable = false;
      }
      else{
        self.currentHealth -= 10;
        self.invinsable = false;
      }
      console.log('score: '+self.score);
      console.log('current health: '+self.currentHealth);

    }
    else if(chest.width == 75){
      console.log('medium');
      self.mediumNum1 = Math.floor(Math.random()*25)+25;
      self.mediumNum2 = Math.floor(Math.random()*25)+25;
      self.mediumAnswer = self.mediumNum1 + self.mediumNum2;

      self.mediumOutput = prompt(self.mediumNum1+'+'+self.mediumNum2+'=');

      if(self.mediumOutput == self.mediumAnswer){
        self.score += 30;
        if(self.currentHealth <= self.maxHealth-20){
          self.currentHealth += 20;
        }
        else{
          self.currentHealth = self.maxHealth;
        }
        self.invinsable = false;
      }
      else{
        self.currentHealth -= 20;
        self.invinsable = false;
      }
      console.log('score: '+self.score);
      console.log('current health: '+self.currentHealth);
    }
    else if(chest.width == 100){
      console.log('large');
      self.hardNum1 = Math.floor(Math.random()*50)+50;
      self.hardNum2 = Math.floor(Math.random()*50)+50;
      self.hardAnswer = self.hardNum1 + self.hardNum2;

      self.hardOutput = prompt(self.hardNum1+'+'+self.hardNum2+'=');

      if(self.hardOutput == self.hardAnswer){
        self.score += 50;
        if(self.currentHealth <= self.maxHealth-30){
          self.currentHealth += 30;
        }
        else{
          self.currentHealth = self.maxHealth;
        }
        self.invinsable = false;
      }
      else{
        self.currentHealth -= 30;
        self.invinsable = false;
      }
      console.log('score: '+self.score);
      console.log('current health: '+self.currentHealth);
    }
    self.ship.setVelocity(0);
    self.ship.setAngularVelocity(0);
    console.log(self.ship.body.velocity, self.ship.body.angularVelocity);
  }, null, this);
  self.scoreText = self.add.text(self.ship.x, self.ship.y - 120, "Score: "+self.score,{
    fontSize: '20px'
  }).setOrigin(0.5);
};

function addOtherPlayers(self, playerInfo){
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'player').setOrigin(0.5, 0.5).setDepth(2);
  otherPlayer.setTint(0xff8e92);
  otherPlayer.playerId = playerInfo.playerId;
  self.otherPlayers.add(otherPlayer);
};