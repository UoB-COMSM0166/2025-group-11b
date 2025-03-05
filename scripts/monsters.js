function createMonster(x, y, template) {

    // 关键：再把 BFS 路径存进 e.path 里

    // main.js (或者某个产怪逻辑里)
    let bfsPath = findPathBFS(grid);

    let e = new Monster(x, y, bfsPath);
    e.path = bfsPath || [];
    // 把 monster[name] 里的属性赋到 e 上
    Object.assign(e, template);
    // Fill in all keys
    template = typeof template === 'undefined' ? {} : template;
    var keys = Object.keys(template);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        e[key] = template[key];
    }
    e.onBorn();
    return e;
}


var monster = {};
monster.plagueRat = {
    // Display
    color: [0, 255, 0],
    // Misc
    name: 'plagueRat',
    image : 'images/plagueRat.png',
    // Stats
    cash: 2,
    health: 35 * 25,
    speed: 1,
    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        // 设置图片模式，以中心点对齐
        imageMode(CENTER);
        // 被攻击特效
        if (this.flashType === 'physical') {
            tint(255, 0, 0); // 物理攻击（红色）
            this.createGlowEffect([255, 0, 0]); // 物理攻击光晕
        } else if (this.flashType === 'water') {
            tint(0, 191, 255); // 水攻击（蓝色）
            this.createRippleEffect([0, 191, 255]); // 水波纹
        } else if (this.flashType === 'fire') {
            tint(255, 69, 0); // 火攻击（橙红色）
            this.createGlowEffect([255, 69, 0]); // 火焰光晕
        } else if (this.flashType === 'lightning') {
            tint(255, 215, 0); // 雷电攻击（黄色）
            this.createLightningEffect([255, 215, 0]); // 电弧
        } else if (this.flashType === 'slow') {
            tint(173, 216, 230); // 冰霜（浅蓝色）
            this.createIceEffect([173, 216, 230]); // 冰霜冻结
        } else {
            noTint(); // 正常颜色
        }
        // 绘制贴图，大小为 `ts x ts`
        if (plagueRatImg) {
            image(plagueRatImg, 0, 0, ts, ts);
        } else {
            
            // 如果图片未加载，则使用默认颜色
            stroke(0);
            fill(this.getColor());
            var back = -0.7 * ts / 3;
            var front = back + 0.7 * ts;
            var side = 0.9 * ts / 2;
            quad(back, -side, 0, 0, back, side, front, 0);
        }
        
        pop();
    }
   
};

monster.dockDredger = {
    // Display
    color: [255, 0, 0],
    radius: 0.6,
    // Misc
    name: 'dockDredger',
    speed: 0.3,
    // Stats
    cash: 3,
    health: 75,
    frameIndex :0, // 当前帧索引
    frameCount :3,// 总帧数
  
    animationSpeed :25, // 控制动画切换速度
    facingRight :true,// 默认朝右
    draw() {
        push();
        //translate(this.pos.x, this.pos.y);
        translate(this.pos.x, this.pos.y + 40)
        rotate(this.vel.heading());
        imageMode(CENTER);
        this.frameWidth = dragonImg.width / this.frameCount; // 计算单帧宽度
        frameHeight = dragonImg.height; // 计算单帧高度
        // 🖼 计算动画帧（根据方向选择前2帧还是后2帧）
        let frameX;
        if (this.facingRight) {
            frameX = (this.frameIndex % 2) * this.frameWidth; // 向右：用前2帧
        } else {
            frameX = (2 + (this.frameIndex % 2)) * this.frameWidth; // 向左：用后2帧
        }
        
        
        // 🎞 渲染精灵帧
        image(dragonImg, -ts / 2, -ts / 2, ts, ts, frameX, 0, this.frameWidth, this.frameHeight);

        pop();
    },
    update() {
      // 🎞 逐步切换动画帧
      if (frameCount % this.animationSpeed === 0) {
        this.frameIndex = (this.frameIndex + 1) % 2; // 只在前2帧 或 后2帧中循环
    }
        // 判断朝向
        if (this.vel.x > 0) {
            this.facingRight = true; // 向右
        } else if (this.vel.x < 0) {
            this.facingRight = false; // 向左
        }

        // 怪物移动
        this.vel.limit(this.pxSpeed());
        this.pos.add(this.vel);
    }
};

monster.bristolSmoglingt = {
    // Display
    color: [61, 251, 255],
    // Misc
    name: 'bristolSmoglingt',
    // Stats
    cash: 2,
    health: 75,
    speed: 0.6
    // Methods
};

monster.bristolBard = {
    // Display
    color: [30, 139, 195],
    // Misc
    name: 'bristolBard',
    // Stats
    cash: 2,
    health: 135,
    speed: 2
    // Methods
};

monster.suspensionStalker = {
    // Display
    color: [192, 57, 43],
    radius: 0.7,
    // Misc
    name: 'suspensionStalker',
    // Stats
    cash: 4,
    health: 375,
    immune: ['regen']
};

monster.banksyPhantomm = {
    // Display
    color: [52, 73, 94],
    radius: 0.8,
    // Misc
    name: 'banksyPhantom',
    // Stats
    cash: 4,
    health: 375
};

monster.ironcladPirate = {
    // Display
    color: [249, 105, 14],
    // Misc
    name: 'ironcladPirate',
    // Stats
    cash: 4,
    health: 375,
    resistant: ['explosion'],
    speed: 3
};

monster.gargoyleOfBristolCathedral = {
    // Display
    color: [30, 130, 76],
    radius: 1,
    // Misc
    name: 'gargoyleOfBristolCathedral',
    // Stats
    cash: 4,
    health: 750,
    immune: ['poison', 'slow'],
    resistant: ['energy', 'physical'],
    weak: ['explosion', 'piercing']
};

monster.taunt = {
    // Display
    color: [102, 51, 153],
    radius: 0.8,
    // Misc
    name: 'taunt',
    sound: 'taunt',
    // Stats
    cash: 8,
    health: 1500,
    immune: ['poison', 'slow'],
    resistant: ['energy', 'physical'],
    taunt: true
};

monster.spawner = {
    // Display
    color: [244, 232, 66],
    radius: 0.7,
    // Misc
    name: 'spawner',
    // Stats
    cash: 10,
    health: 1150
};
