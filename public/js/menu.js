/* global Phaser */

let menu = new Phaser.Scene('menu');

menu.create = function(){
    
    this.map = this.make.tilemap({
        key: "menu_background",
        tileWidth: 32,
        tileHeight: 32
    });//gives a key for the map and states the tile dimensions
    
    this.tileset = this.map.addTilesetImage('water', "tiles");//calling the tileset
    this.menu_background = this.map.createStaticLayer("menu_background", this.tileset, 0, 0);//putting the tile map on the background

    var music = this.sound.add('menu_music');
    music.play();

    this.easy = this.add.text(512, 328, '< EASY: 1PPQ >',{
        fontSize: '40px',
        fill: '#ffffff'
    }).setOrigin(0.5);
    this.medium = this.add.text(512, 400, '< MEDIUM: 2PPQ >',{
        fontSize: '40px',
        fill: '#ffffff'
    }).setOrigin(0.5);
    this.hard = this.add.text(512, 472, '< HARD: 3PPQ >',{
        fontSize: '40px',
        fill: '#ffffff'
    }).setOrigin(0.5);
    
    
    this.easy.setInteractive();
    this.medium.setInteractive();
    this.hard.setInteractive();

//hover over
    this.easy.on('pointerover',()=>{
        this.easy.setStyle({
            fontSize: '36px',
            fill: '#ff0000'
        });
    });

    this.easy.on('pointerout',()=>{
        this.easy.setStyle({
            fontSize: '40px',
            fill: '#ffffff'
        });
    });

    this.medium.on('pointerover', ()=>{
        this.medium.setStyle({
            fontSize: '36px',
            fill: '#ff0000'
        });
    });
    
    this.medium.on('pointerout', ()=>{
        this.medium.setStyle({
            fontSize: '40px',
            fill: '#ffffff'
        });
    });


    this.hard.on('pointerover', ()=>{
        this.hard.setStyle({
            fontSize: '36px',
            fill: '#ff0000'
        });
    });
    
    this.hard.on('pointerout', ()=>{
        this.hard.setStyle({
            fontSize: '40px',
            fill: '#ffffff'
        });
    });

//button press
    this.easy.on('pointerdown',()=>{
        difficulty = 'easy';
        this.easy.setStyle({
            fontSize: '36px',
            fill: '#ff0000'
        });
        music.stop();
        this.scene.start('pregame');
        this.scene.shutdown();
    });

    this.easy.on('pointerup',()=>{
        this.easy.setStyle({
            fontSize: '40px',
            fill: '#ffffff'
        });
    });

    this.medium.on('pointerdown', ()=>{
        this.medium.setStyle({
            fontSize: '36px',
            fill: '#ff0000'
        });
        difficulty = 'medium';
        music.stop();
        this.scene.start('pregame');
        this.scene.shutdown();
    });

    this.medium.on('pointerup',()=>{
        this.medium.setStyle({
            fontSize: '40px',
            fill: '#ffffff'
        });
    });

    this.hard.on('pointerdown', ()=>{
        this.hard.setStyle({
            fontSize: '36px',
            fill: '#ff0000'
        });
        difficulty = 'hard';
        music.stop();
        this.scene.start('pregame');
        this.scene.shutdown();
    });

    this.hard.on('pointerup',()=>{
        this.hard.setStyle({
            fontSize: '40px',
            fill: '#ffffff'
        });
    });
    
}