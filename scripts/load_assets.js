// 声明全局变量
let BanditImg;
let dragonImg;
let myTowerImg

let bgImg;  // 声明背景图变量

let moneyImg;//钱图像
let moneyBarImg;//钱图像
let healthBarImg;
let monsterBarImg;


let tower1Img;
let tower2Img;

let m1Images = [];
let m_2Image;

let m2Images = [];
let m3Image;
let m3Images = [];


let m4Image;
let m4Images = [];

let m5Image;
let m5Images = [];


let m6Image;
let m6Images = [];
let t1Image;//箭
let fireBallImage;//火球


let t1_2Image;
let t1_3Image;

let t2_2Image;
let t2_3Image

let t3_1Image;
let t3_2Image;
let t3_3Image;
let t4_1Image;
let t4_2Image;
let t4_3Image;
let t5_1Image;
let t5_2Image;
let t5_3Image;

let t6_1Image;
let t6_2Image;
let t6_3Image;

let imgAttackAim;
let imgAttackArrow;
let imgAttackStone;
let imgAttackBullet;
let imgAttackCannonExplosion;
let imgAttackLightning;
let imgAttackStun;
let imgUpgradeShine;

let bgmStart;
let bgmLevel1;
let bgmLevel2;
let bgmLevel3;

function preload() {
    // 加载塔图片（确保图片路径正确）

    loadImages();
    loadSounds();
    preloadUIAssets();
}

function loadImages() {
    t3_1Image = loadImage("images/t3_1.png");
    t3_2Image = loadImage("images/t3_2.png");
    t3_3Image = loadImage("images/t3_3.png");
    t4_1Image = loadImage("images/t4_1.png");
    t4_2Image = loadImage("images/t4_2.png");
    t4_3Image = loadImage("images/t4_3.png");
    t5_1Image = loadImage("images/t5_1.png");
    t5_2Image = loadImage("images/t5_2.png");
    t5_3Image = loadImage("images/t5_3.png");
    t6_1Image = loadImage("images/t6_1.png");
    t6_2Image = loadImage("images/t6_2.png");
    t6_3Image = loadImage("images/t6_3.png");

    t1_2Image = loadImage("images/t1_2.png");
    t1_3Image = loadImage("images/t1_3.png");

    t2_2Image = loadImage("images/t2_2.png");
    t2_3Image = loadImage("images/t2_3.png");

    myTowerImg = loadImage("images/leftrole.jpeg");
    BanditImg = loadImage("images/m1.png");
    m_2Image = loadImage("images/g1.png");
    dragonImg = loadImage("images/dragon.png");
    moneyImg = loadImage("images/money.png");
    moneyBarImg = loadImage("images/moneyBar.png");
    healthBarImg = loadImage("images/healthBar.png");
    monsterBarImg = loadImage("images/monsterBar.png");
    tower1Img = loadImage("images/tower1.png");
    tower2Img = loadImage("images/tower2.png");

    m1Images.push(loadImage("images/m1.png"));
    m1Images.push(loadImage("images/m2.png"));
    m1Images.push(loadImage("images/m3.png"));
    m1Images.push(loadImage("images/m4.png"));
    m1Images.push((loadImage("images/m5.png")));

    t1Image = loadImage("images/t1.png");
    fireBallImage = loadImage("images/t2.png");

    //dragon
    for (let i = 0; i < 4; i++) {
        m2Images.push((loadImage("images/g" + (i + 1) + ".png")));
    }
    m3Image = loadImage("images/m3_1.png");
    for (let i = 0; i < 5; i++) {
        m3Images.push((loadImage("images/m3_" + (i + 1) + ".png")));
    }

    m4Image = loadImage("images/m4_1.png");
    for (let i = 0; i < 6; i++) {
        m4Images.push((loadImage("images/m4_" + (i + 1) + ".png")));
    }

    m5Image = loadImage("images/m5_1.png");
    for (let i = 0; i < 6; i++) {
        m5Images.push((loadImage("images/m5_" + (i + 1) + ".png")));
    }


    m6Image = loadImage("images/m6_1.png");
    for (let i = 0; i < 5; i++) {
        m6Images.push((loadImage("images/m6_" + (i + 1) + ".png")));
    }

    imgAttackAim =  loadImage("images/tower/icon_aim.png");
    imgAttackArrow =  loadImage("images/tower/arrow.png");
    imgAttackStone =  loadImage("images/tower/stone.png");
    imgAttackBullet =  loadImage("images/tower/bullet.png");
    imgAttackCannonExplosion =  loadImage("images/tower/sprites_explosion.png");
    imgAttackLightning =  loadImage("images/tower/sprites_lightning.png");
    imgAttackStun =  loadImage("images/tower/sprites_stun.png");
    imgUpgradeShine =  loadImage("images/tower/sprites_upgrade_shine.png");
}

function setup() {
    var canvas = createCanvas(cols * ts, rows * ts);
    background(255);
    canvas.parent('main-holder');
    // 通过 position() 方法将 canvas 居中

    // Add a class attribute to the canvas.
    canvas.class('pinkborder');


    // Select the canvas by its class.
    canvas = select('.pinkborder');


    // Style its border.
    canvas.style('display', 'block');  // 确保 canvas 被当作块级元素



    canvas.position(50, (windowHeight-height)/2);


    paused = true;
    healthBarImg.resize(healthBarImg.width * 0.7, healthBarImg.height * 0.7)
    monsterBarImg.resize(monsterBarImg.width * 0.6, monsterBarImg.height * 0.6)

    playStartBGM();
    onGameSetup();
    loadMoster();
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

    bgmStart = loadSound("sounds/Main-Titles.mp3");
    bgmLevel1 = loadSound('sounds/Treasure-Hunt.mp3');
    bgmLevel2 = loadSound('sounds/Fire-Nation.mp3');
    bgmLevel3 = loadSound('sounds/To-the-Ends-of-the-Galaxy-Instrumental.mp3');
    bgmStart.setVolume(0.3);
    bgmLevel1.setVolume(0.3);
    bgmLevel2.setVolume(0.3);
    bgmLevel3.setVolume(0.3);
    
}
