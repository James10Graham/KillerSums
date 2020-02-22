/* global Phaser load menu easy medium hard main mainLoader */

let config = {
    type: Phaser.AUTO,
    width: 1024, //canvas dimentions
    height: 800,
    physics: {
          default: 'arcade',
    },
    scene: [load, menu , pregame] //these are the scenes that will be part of the pregame
    
  };
  
  let game = new Phaser.Game(config); //this initialises a new game constant