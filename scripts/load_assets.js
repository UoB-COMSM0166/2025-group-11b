// 声明全局变量
let plagueRatImg;
let dragonImg;
let myTowerImg

let bgImg;  // 声明背景图变量

function preload() {
    // 加载塔图片（确保图片路径正确）
    loadImages();
    loadSounds();
    bgImg = loadImage("images/your_background.png");
}
function loadImages() {
	myTowerImg = loadImage("images/leftrole.jpeg");
	plagueRatImg = loadImage("images/plagueRat.png");
    dragonImg = loadImage("images/dragon.png");

}
function setup() {
    var canvas = createCanvas(1440, 768);
    canvas.parent('main-holder');
    paused = true;
}
// Load all sounds
function loadSounds() {
    sounds = {};
    
    // Missile explosion
    sounds.boom = loadSound('sounds/boom.wav');
    sounds.boom.setVolume(0.3);

    // Monster death
    sounds.pop = loadSound('sounds/pop.wav');
    sounds.pop.setVolume(0.4);

    // Railgun
    sounds.railgun = loadSound('sounds/railgun.wav');
    sounds.railgun.setVolume(0.3);

    // Sniper rifle shot
    sounds.sniper = loadSound('sounds/sniper.wav');
    sounds.sniper.setVolume(0.2);

    // Tesla coil
    sounds.spark = loadSound('sounds/spark.wav');
    sounds.spark.setVolume(0.3);

    // Taunt monster death
    sounds.taunt = loadSound('sounds/taunt.wav');
    sounds.taunt.setVolume(0.3);
}
