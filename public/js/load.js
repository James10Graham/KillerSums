/* global Phaser */

let load = new Phaser.Scene('load');

load.preload = function(){
    this.load.image('ship', '/assets/ship.png');
    this.load.tilemapTiledJSON('background', '/assets/water.json');
    this.load.tilemapTiledJSON('menu_background', '/assets/menu.json');
    this.load.image('tiles', '/assets/water.png');
    this.load.image('coin', '/assets/coin.png');
    this.load.spritesheet('boom', '/assets/explode.png', {
        frameWidth: 128,
        frameHeight: 128
    });

    this.loadingBar = this.add.graphics({
        fillStyle: {
            color: 0xffffff
        }
    });//setting a graphic that is a white rectangle to act as a loading bar
    
    this.add.text(512, 200,'LOADING...',{
        fontSize: '128px',
        fill: '#000000'
    }).setOrigin(0.5); //this is black test that will appear when the white rectangle goes behind the text

    // for(let i = 0; i < 100; i++){
    //     this.load.image('ship', 'assets/ship.png');
    // }
    // this is a lag simulator so the loader has a better effect!

    this.load.on('progress', (percent)=>{
        this.loadingBar.fillRect(0, 0, 1024 * percent, 800);
        console.log(percent*100);
    });//this is a progress listener that takes the percentage loaded as a perameter, which can be used to fill the rectangle

    this.load.on('complete', ()=>{
        this.scene.start('menu');
        this.scene.shutdown();
    });//when everything is loaded this scene will end and the menu scene will load

//audio
    this.load.audio('moving', '/assets/moving.mp3');
    this.load.audio('menu_music', 'assets/menu_music.mp3');
    this.load.audio('explosionSFX', '/assets/explosion.mp3');
    this.load.audio('correct', '/assets/correct.mp3');
}

