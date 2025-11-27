import Phaser from 'phaser';
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  // carga tus assets aquí
}

function create() {
  this.add.text(100, 100, '¡Hola Crepusculones!', { font: '32px Arial', fill: '#00ffff' });
}

function update() {
  // lógica del juego
}
