function createTower(x, y, template) {
    var t = new Tower(x, y);
    t.upgrade(template);
    t.onCreate();
    return t;
}


var tower = {};


// 修改后的塔定义，使用贴图绘制塔的外观，同时发射子弹
tower.gun = {
    // 基本属性
    name: 'Archer Tower',
    title: 'Archer Tower',
    cooldownMax: 60,
    cooldownMin: 60,
    cost: 35,
    damageMax: 10,
    damageMin: 10,
    range: 2.5,
    type: 'physical',
    
    // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
    hasBase: true,
    hasBarrel: false,
    draw: function() {
      push();
      imageMode(CENTER);
      // 根据塔的 radius 和全局 ts 缩放绘制贴图
      image(tower1Img, this.pos.x, this.pos.y, cellWidth,cellHeight);
      pop();
    },
    
    // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
    onAim: function(e) {
      if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
      if (!this.canFire()) return;
      this.resetCooldown();
      
      let bulletDamage = round(random(this.damageMin, this.damageMax));
      // 实例化一个子弹，从塔的位置飞向目标
      let b = new Bullet(this.pos.x, this.pos.y, e, bulletDamage);
      projectiles.push(b);
      
      // 绘制枪口闪光效果（可选），让发射更明显
      push();
      stroke(255, 255, 0);
      strokeWeight(4);
      let barrelEnd = createVector(
        this.pos.x + cos(this.angle) * ts * 0.5,
        this.pos.y + sin(this.angle) * ts * 0.5
      );
      line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
      pop();
      
      // 如果你需要额外的 onHit 后续处理，可以调用它
      this.onHit(e);
    },
    
    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
    target: Tower.prototype.target,
    // 升级选项
    upgrades: [
        {
            // 基本属性
            name: 'Archer PLUS Tower',
            title: 'Archer PLUS Tower',
            cooldownMax: 30,
            cooldownMin: 30,
            cost: 35,
            damageMax: 15,
            damageMin: 15,
            range: 3,
            type: 'physical',

            // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
            hasBase: true,
            hasBarrel: false,
            draw: function() {
                push();
                imageMode(CENTER);
                // 根据塔的 radius 和全局 ts 缩放绘制贴图
                image(t1_2Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                pop();
            },

            // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
            onAim: function(e) {
                if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
                if (!this.canFire()) return;
                this.resetCooldown();

                let bulletDamage = round(random(this.damageMin, this.damageMax));
                // 实例化一个子弹，从塔的位置飞向目标
                let b = new Bullet(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);

                // 绘制枪口闪光效果（可选），让发射更明显
                push();
                stroke(255, 255, 0);
                strokeWeight(4);
                let barrelEnd = createVector(
                    this.pos.x + cos(this.angle) * ts * 0.5,
                    this.pos.y + sin(this.angle) * ts * 0.5
                );
                line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
                pop();

                // 如果你需要额外的 onHit 后续处理，可以调用它
                this.onHit(e);
            },
            // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
            target: Tower.prototype.target,
            upgrades: [
                {
                    // 基本属性
                    name: 'Archer MAX Tower',
                    title: 'Archer MAX Tower',
                    cooldownMax: 15,
                    cooldownMin: 15,
                    cost: 35,
                    damageMax: 20,
                    damageMin: 20,
                    range: 4,
                    type: 'physical',

                    // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
                    hasBase: true,
                    hasBarrel: false,
                    draw: function() {
                        push();
                        imageMode(CENTER);
                        // 根据塔的 radius 和全局 ts 缩放绘制贴图
                        image(t1_3Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                        pop();
                    },

                    // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
                    onAim: function(e) {
                        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
                        if (!this.canFire()) return;
                        this.resetCooldown();

                        let bulletDamage = round(random(this.damageMin, this.damageMax));
                        // 实例化一个子弹，从塔的位置飞向目标
                        let b = new Bullet(this.pos.x, this.pos.y, e, bulletDamage);
                        projectiles.push(b);

                        // 绘制枪口闪光效果（可选），让发射更明显
                        push();
                        stroke(255, 255, 0);
                        strokeWeight(4);
                        let barrelEnd = createVector(
                            this.pos.x + cos(this.angle) * ts * 0.5,
                            this.pos.y + sin(this.angle) * ts * 0.5
                        );
                        line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
                        pop();

                        // 如果你需要额外的 onHit 后续处理，可以调用它
                        this.onHit(e);
                    },
                    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
                    target: Tower.prototype.target,



                }

            ]



        }

    ]

  };

tower.oil = {
    // 基本属性
    name: 'oil Tower',
    title: 'oil Tower',
    cooldownMax: 60,
    cooldownMin: 60,
    cost: 35,
    damageMax: 10,
    damageMin: 10,
    range: 2.5,
    type: 'fire',

    // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
    hasBase: true,
    hasBarrel: false,
    draw: function() {
        push();
        imageMode(CENTER);
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(tower2Img, this.pos.x, this.pos.y, cellWidth,cellHeight);
        pop();
    },

    // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
    onAim: function(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;
        this.resetCooldown();

        let bulletDamage = round(random(this.damageMin, this.damageMax));
        // 实例化一个子弹，从塔的位置飞向目标
        let b = new FireBall(this.pos.x, this.pos.y, e, bulletDamage);
        projectiles.push(b);

        // 绘制枪口闪光效果（可选），让发射更明显
        push();
        stroke(255, 255, 0);
        strokeWeight(4);
        let barrelEnd = createVector(
            this.pos.x + cos(this.angle) * ts * 0.5,
            this.pos.y + sin(this.angle) * ts * 0.5
        );
        line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
        pop();

        // 如果你需要额外的 onHit 后续处理，可以调用它
        this.onHit(e);
    },

    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
    target: Tower.prototype.target,
    upgrades:[
        {
            // 基本属性
            name: 'oil PLUS Tower',
            title: 'oil PLUS Tower',
            cooldownMax: 40,
            cooldownMin: 40,
            cost: 35,
            damageMax: 20,
            damageMin: 20,
            range: 3,
            type: 'fire',

            // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
            hasBase: true,
            hasBarrel: false,
            draw: function() {
                push();
                imageMode(CENTER);
                // 根据塔的 radius 和全局 ts 缩放绘制贴图
                image(t2_2Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                pop();
            },

            // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
            onAim: function(e) {
                if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
                if (!this.canFire()) return;
                this.resetCooldown();

                let bulletDamage = round(random(this.damageMin, this.damageMax));
                // 实例化一个子弹，从塔的位置飞向目标
                let b = new FireBall(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);

                // 绘制枪口闪光效果（可选），让发射更明显
                push();
                stroke(255, 255, 0);
                strokeWeight(4);
                let barrelEnd = createVector(
                    this.pos.x + cos(this.angle) * ts * 0.5,
                    this.pos.y + sin(this.angle) * ts * 0.5
                );
                line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
                pop();

                // 如果你需要额外的 onHit 后续处理，可以调用它
                this.onHit(e);
            },

            // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
            target: Tower.prototype.target,
            upgrades:[
                {
                    // 基本属性
                    name: 'oil MAX Tower',
                    title: 'oil MAX Tower',
                    cooldownMax: 15,
                    cooldownMin: 15,
                    cost: 35,
                    damageMax: 30,
                    damageMin: 30,
                    range: 4,
                    type: 'fire',

                    // 设置使用贴图绘制塔的外观（你之前预加载的贴图）
                    hasBase: true,
                    hasBarrel: false,
                    draw: function() {
                        push();
                        imageMode(CENTER);
                        // 根据塔的 radius 和全局 ts 缩放绘制贴图
                        image(t2_3Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                        pop();
                    },

                    // 自定义攻击效果：创建一个 Bullet 对象模拟子弹飞行
                    onAim: function(e) {
                        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
                        if (!this.canFire()) return;
                        this.resetCooldown();

                        let bulletDamage = round(random(this.damageMin, this.damageMax));
                        // 实例化一个子弹，从塔的位置飞向目标
                        let b = new FireBall(this.pos.x, this.pos.y, e, bulletDamage);
                        projectiles.push(b);

                        // 绘制枪口闪光效果（可选），让发射更明显
                        push();
                        stroke(255, 255, 0);
                        strokeWeight(4);
                        let barrelEnd = createVector(
                            this.pos.x + cos(this.angle) * ts * 0.5,
                            this.pos.y + sin(this.angle) * ts * 0.5
                        );
                        line(this.pos.x, this.pos.y, barrelEnd.x, barrelEnd.y);
                        pop();

                        // 如果你需要额外的 onHit 后续处理，可以调用它
                        this.onHit(e);
                    },

                    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
                    target: Tower.prototype.target,
                }
            ]
        },

    ]

};
  
tower.laser = {
    // Display
    color: [25, 181, 254], // 蓝色激光
    length: 0.55,
    radius: 0.8,
    secondary: [149, 165, 166], // 次要颜色
    width: 0.25,
    weight: 2, // 初始线条粗细
    drawLine: true, // 绘制弹道线
    follow: true, // 跟踪目标

    // Misc
    name: 'Laser AA Tower',
    title: 'Laser AA Tower',
    sound: 'laser', // 攻击音效

    // Stats
    cooldownMax: 1, // 攻击冷却时间
    cost: 75, // 建造价格
    damageMax: 3, // 最大伤害
    range: 2, // 攻击范围
    type: 'energy', // 伤害类型

    // 闪烁效果计数器
    flashCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(t5_1Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
        pop();
    },

    // 攻击逻辑
    onAim: function(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
        if (!this.canFire()) return;

        // 攻击目标
        this.attack(e);

        // 绘制弹道线
        if (this.drawLine) {
            // 计算弹道线粗细和颜色
            let weight = this.calculateWeight();
            let color = this.calculateColor();

            // 绘制弹道线
            stroke(color);
            strokeWeight(weight);
            line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);
            strokeWeight(1); // 恢复默认线条粗细
            //
            // 添加光晕效果
            this.addGlow(e);
        }

        // 更新闪烁计数器
        this.flashCounter++;
    },

    // 计算弹道线粗细
    calculateWeight: function() {
        // 每 20 帧一个完整的闪烁周期
        let cycle = this.flashCounter % 20;

        if (cycle < 10) {
            // 前 10 帧：从初始粗细逐渐变粗
            return this.weight + (cycle / 10) * 4; // 最大粗细为初始粗细 + 4
        } else {
            // 后 10 帧：从最大粗细逐渐变细
            return this.weight + ((20 - cycle) / 10) * 4;
        }
    },

    // 计算弹道线颜色
    calculateColor: function() {
        // 每 20 帧一个完整的颜色变化周期
        let cycle = this.flashCounter % 20;
        let r = 25 + 230 * abs(sin((cycle / 20) * TWO_PI)); // 红色分量
        let g = 181 + 74 * abs(sin((cycle / 20) * TWO_PI)); // 绿色分量
        let b = 254; // 蓝色分量固定
        return [r, g, b];
    },

    // 添加光晕效果
    addGlow: function(e) {
        push();
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明光晕
        ellipse(e.pos.x, e.pos.y, 20, 20); // 光晕大小
        pop();
    },

    // 攻击方法
    attack: function(e) {
        var damage = round(random(this.damageMin, this.damageMax));
        e.dealDamage(damage, this.type);
        if (sounds.hasOwnProperty(this.sound)) {
            sounds[this.sound].play();
        }
        this.onHit(e);
    },

    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
    target: Tower.prototype.target,

    // 升级选项
    upgrades: [
        {
            // Display
            color: [78, 205, 196], // 升级后的颜色
            length: 0.65,
            radius: 0.9,
            secondary: [191, 191, 191], // 升级后的次要颜色
            weight: 3, // 升级后的初始线条粗细
            width: 0.35,

            // Misc
            name: 'Laser AA PLUS Tower ',
            title: 'Laser AA PLUS Tower',

            // Stats
            cooldownMax: 0, // 升级后无冷却
            cost: 200, // 升级价格
            damageMax: 0.1, // 升级后的最大伤害
            damageMin: 0.001, // 升级后的最小伤害
            range: 3, // 升级后的攻击范围
            draw: function() {
                push();
                imageMode(CENTER);
                // 根据塔的 radius 和全局 ts 缩放绘制贴图
                image(t5_2Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                pop();
            },

            // 升级后的攻击逻辑
            attack: function(e) {
                if (this.lastTarget === e) {
                    this.duration++;
                } else {
                    this.lastTarget = e;
                    this.duration = 0;
                }
                var d = random(this.damageMin, this.damageMax);
                var damage = d * sq(this.duration);
                e.dealDamage(damage, this.type);
                this.onHit(e);
            },
            upgrades:[
                {
                    // Display
                    color: [25, 181, 254], // 蓝色激光
                    length: 0.55,
                    radius: 0.8,
                    secondary: [149, 165, 166], // 次要颜色
                    width: 0.25,
                    weight: 2, // 初始线条粗细
                    drawLine: true, // 绘制弹道线
                    follow: true, // 跟踪目标

                    // Misc
                    name: 'Laser AA MAX Tower',
                    title: 'Laser AA MAX Tower',
                    sound: 'laser', // 攻击音效

                    // Stats
                    cooldownMax: 1, // 攻击冷却时间
                    cost: 75, // 建造价格
                    damageMax: 3, // 最大伤害
                    range: 2, // 攻击范围
                    type: 'energy', // 伤害类型

                    // 闪烁效果计数器
                    flashCounter: 0,
                    draw: function() {
                        push();
                        imageMode(CENTER);
                        // 根据塔的 radius 和全局 ts 缩放绘制贴图
                        image(t5_3Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                        pop();
                    },

                    // 攻击逻辑
                    onAim: function(e) {
                        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
                        if (!this.canFire()) return;

                        // 攻击目标
                        this.attack(e);

                        // 绘制弹道线
                        if (this.drawLine) {
                            // 计算弹道线粗细和颜色
                            let weight = this.calculateWeight();
                            let color = this.calculateColor();

                            // 绘制弹道线
                            stroke(color);
                            strokeWeight(weight);
                            line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);
                            strokeWeight(1); // 恢复默认线条粗细
                            //
                            // 添加光晕效果
                            this.addGlow(e);
                        }

                        // 更新闪烁计数器
                        this.flashCounter++;
                    },

                    // 计算弹道线粗细
                    calculateWeight: function() {
                        // 每 20 帧一个完整的闪烁周期
                        let cycle = this.flashCounter % 20;

                        if (cycle < 10) {
                            // 前 10 帧：从初始粗细逐渐变粗
                            return this.weight + (cycle / 10) * 4; // 最大粗细为初始粗细 + 4
                        } else {
                            // 后 10 帧：从最大粗细逐渐变细
                            return this.weight + ((20 - cycle) / 10) * 4;
                        }
                    },

                    // 计算弹道线颜色
                    calculateColor: function() {
                        // 每 20 帧一个完整的颜色变化周期
                        let cycle = this.flashCounter % 20;
                        let r = 25 + 230 * abs(sin((cycle / 20) * TWO_PI)); // 红色分量
                        let g = 181 + 74 * abs(sin((cycle / 20) * TWO_PI)); // 绿色分量
                        let b = 254; // 蓝色分量固定
                        return [r, g, b];
                    },

                    // 添加光晕效果
                    addGlow: function(e) {
                        push();
                        noStroke();
                        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明光晕
                        ellipse(e.pos.x, e.pos.y, 20, 20); // 光晕大小
                        pop();
                    },

                    // 攻击方法
                    attack: function(e) {
                        var damage = round(random(this.damageMin, this.damageMax));
                        e.dealDamage(damage, this.type);
                        if (sounds.hasOwnProperty(this.sound)) {
                            sounds[this.sound].play();
                        }
                        this.onHit(e);
                    },

                    // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
                    target: Tower.prototype.target,
                }
            ]
        }
    ]
};

// tower.laserfire = {
//     // Display
//     color: [254, 81, 25], //
//     length: 0.55,
//     radius: 0.8,
//     secondary: [166, 65, 99], // 次要颜色
//     width: 0.25,
//     weight: 2, // 初始线条粗细
//     drawLine: true, // 绘制弹道线
//     follow: true, // 跟踪目标
//
//     name: 'laserfire',
//     title: 'Laserfire Tower',
//     sound: 'laserfire', // 攻击音效
//
//     // Stats
//     cooldownMax: 1, // 攻击冷却时间
//     cost: 75, // 建造价格
//     damageMax: 3, // 最大伤害
//     range: 2, // 攻击范围
//     type: 'energy', // 伤害类型
//
//     // 闪烁效果计数器
//     flashCounter: 0,
//
//     // 攻击逻辑
//     onAim: function(e) {
//         if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
//         if (!this.canFire()) return;
//
//         // 攻击目标
//         this.attack(e);
//
//         // 绘制弹道线
//         if (this.drawLine) {
//             // 计算弹道线粗细和颜色
//             let weight = this.calculateWeight();
//             let color = this.calculateColor();
//
//             // 绘制弹道线
//             stroke(color);
//             strokeWeight(weight);
//             line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);
//             strokeWeight(1); // 恢复默认线条粗细
//
//             // 添加光晕效果
//             this.addGlow(e);
//         }
//
//         // 更新闪烁计数器
//         this.flashCounter++;
//     },
//
//     // 计算弹道线粗细
//     calculateWeight: function() {
//         // 每 20 帧一个完整的闪烁周期
//         let cycle = this.flashCounter % 20;
//
//         if (cycle < 10) {
//             // 前 10 帧：从初始粗细逐渐变粗
//             return this.weight + (cycle / 10) * 4; // 最大粗细为初始粗细 + 4
//         } else {
//             // 后 10 帧：从最大粗细逐渐变细
//             return this.weight + ((20 - cycle) / 10) * 4;
//         }
//     },
//
//     // 计算弹道线颜色
//     calculateColor: function() {
//         // 每 20 帧一个完整的颜色变化周期
//         let cycle = this.flashCounter % 20;
//         let r = 200 + 55 * abs(sin((cycle / 20) * TWO_PI)); // 红色分量
//         let g = 50 + 104 * abs(sin((cycle / 20) * TWO_PI)); // 绿色分量
//         let b = 2; // 蓝色分量固定
//         return [r, g, b];
//     },
//
//     // 添加光晕效果
//     addGlow: function(e) {
//         push();
//         noStroke();
//         fill(this.color[0], this.color[1], this.color[2], 50); // 半透明光晕
//         ellipse(e.pos.x, e.pos.y, 20, 20); // 光晕大小
//         pop();
//     },
//
//     // 攻击方法
//     attack: function(e) {
//         var damage = round(random(this.damageMin, this.damageMax));
//         e.dealDamage(damage, this.type);
//         if (sounds.hasOwnProperty(this.sound)) {
//             sounds[this.sound].play();
//         }
//         this.onHit(e);
//     },
//
//     // 使用 Tower 基类默认的 target 方法（在可见范围内选择目标）
//     target: Tower.prototype.target,
//
//     // 升级选项
//     upgrades: [
//         {
//             // Display
//             color: [178, 55, 96], // 升级后的颜色
//             length: 0.65,
//             radius: 0.9,
//             secondary: [191, 191, 191], // 升级后的次要颜色
//             weight: 3, // 升级后的初始线条粗细
//             width: 0.35,
//
//             // Misc
//             name: 'beamEmitter',
//             title: 'Beam Emitter',
//
//             // Stats
//             cooldownMax: 0, // 升级后无冷却
//             cost: 200, // 升级价格
//             damageMax: 0.1, // 升级后的最大伤害
//             damageMin: 0.001, // 升级后的最小伤害
//             range: 3, // 升级后的攻击范围
//
//             // 升级后的攻击逻辑
//             attack: function(e) {
//                 if (this.lastTarget === e) {
//                     this.duration++;
//                 } else {
//                     this.lastTarget = e;
//                     this.duration = 0;
//                 }
//                 var d = random(this.damageMin, this.damageMax);
//                 var damage = d * sq(this.duration);
//                 e.dealDamage(damage, this.type);
//                 this.onHit(e);
//             }
//         }
//     ]
// };

tower.slow = {
    // Display
    baseOnTop: false,
    color: [75, 119, 190], // 底色
    drawLine: false,
    length: 1.1,
    radius: 0.9,
    secondary: [189, 195, 199], // 次要颜色
    width: 0.3,
    // Misc
    name: 'slow',
    title: 'Slow Tower',
    // Stats
    cooldownMax: 0,
    cooldownMin: 0,
    cost: 100,
    damageMax: 0,
    damageMin: 0,
    range: 3, // 作用范围
    type: 'slow',

    // 波动效果计数器
    waveCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(t3_1Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
        pop();
    },

    // Methods
    drawBarrel: function() {
        // fill(this.secondary);
        // var back = -this.length * ts / 2;
        // var side = this.width * ts / 2;
        // rect(back, -side, this.length * ts, this.width * ts);
    },

    // 攻击逻辑
    onAim: function(e) {
        this.attack(e);
    },

    // 攻击效果
    onHit: function(e) {
        e.doEffect('slow', 40);
    },

    // 目标选择
    target: function(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        if (!this.canFire()) return;
        this.resetCooldown();

        // 绘制底色和波动效果
        this.drawEffect();

        // 对范围内的所有敌人应用效果
        for (var i = 0; i < entities.length; i++) {
            let monster = entities[i];
            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
            if (d <= this.range * ts) { // 确保敌人在作用范围内
                this.onAim(monster);
            }
        }
    },

    // 绘制底色和波动效果
    drawEffect: function() {
        // 绘制底色
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

        // 绘制波动效果
        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
        noFill();
        stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

        // 更新波动计数器
        this.waveCounter++;
    },

    // 更新逻辑
    update() {
        this.angle += PI / 60;
        if (this.cd > 0) this.cd--;
    },

    // 升级选项
    upgrades: [
        {
            // Display
            baseOnTop: false,
            color: [75, 119, 190], // 底色
            drawLine: false,
            length: 1.1,
            radius: 0.9,
            secondary: [189, 195, 199], // 次要颜色
            width: 0.3,
            // Misc
            name: 'slow',
            title: 'Slow Tower',
            // Stats
            cooldownMax: 0,
            cooldownMin: 0,
            cost: 100,
            damageMax: 0,
            damageMin: 0,
            range: 3, // 作用范围
            type: 'slow',

            // 波动效果计数器
            waveCounter: 0,
            draw: function() {
                push();
                imageMode(CENTER);
                // 根据塔的 radius 和全局 ts 缩放绘制贴图
                image(t3_2Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                pop();
            },

            // Methods
            drawBarrel: function() {
                // fill(this.secondary);
                // var back = -this.length * ts / 2;
                // var side = this.width * ts / 2;
                // rect(back, -side, this.length * ts, this.width * ts);
            },

            // 攻击逻辑
            onAim: function(e) {
                this.attack(e);
            },

            // 攻击效果
            onHit: function(e) {
                e.doEffect('slow', 40);
            },

            // 目标选择
            target: function(entities) {
                entities = this.visible(entities);
                if (entities.length === 0) return;
                if (!this.canFire()) return;
                this.resetCooldown();

                // 绘制底色和波动效果
                this.drawEffect();

                // 对范围内的所有敌人应用效果
                for (var i = 0; i < entities.length; i++) {
                    let monster = entities[i];
                    let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
                    if (d <= this.range * ts) { // 确保敌人在作用范围内
                        this.onAim(monster);
                    }
                }
            },

            // 绘制底色和波动效果
            drawEffect: function() {
                // 绘制底色
                noStroke();
                fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
                ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

                // 绘制波动效果
                let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
                noFill();
                stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
                strokeWeight(2);
                ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

                // 更新波动计数器
                this.waveCounter++;
            },

            // 更新逻辑
            update() {
                this.angle += PI / 60;
                if (this.cd > 0) this.cd--;
            },

            // 升级选项
            upgrades: [
                {
                    // Display
                    baseOnTop: false,
                    color: [75, 119, 190], // 底色
                    drawLine: false,
                    length: 1.1,
                    radius: 0.9,
                    secondary: [189, 195, 199], // 次要颜色
                    width: 0.3,
                    // Misc
                    name: 'slow',
                    title: 'Slow Tower',
                    // Stats
                    cooldownMax: 0,
                    cooldownMin: 0,
                    cost: 100,
                    damageMax: 0,
                    damageMin: 0,
                    range: 3, // 作用范围
                    type: 'slow',

                    // 波动效果计数器
                    waveCounter: 0,
                    draw: function() {
                        push();
                        imageMode(CENTER);
                        // 根据塔的 radius 和全局 ts 缩放绘制贴图
                        image(t3_3Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                        pop();
                    },

                    // Methods
                    drawBarrel: function() {
                        // fill(this.secondary);
                        // var back = -this.length * ts / 2;
                        // var side = this.width * ts / 2;
                        // rect(back, -side, this.length * ts, this.width * ts);
                    },

                    // 攻击逻辑
                    onAim: function(e) {
                        this.attack(e);
                    },

                    // 攻击效果
                    onHit: function(e) {
                        e.doEffect('slow', 40);
                    },

                    // 目标选择
                    target: function(entities) {
                        entities = this.visible(entities);
                        if (entities.length === 0) return;
                        if (!this.canFire()) return;
                        this.resetCooldown();

                        // 绘制底色和波动效果
                        this.drawEffect();

                        // 对范围内的所有敌人应用效果
                        for (var i = 0; i < entities.length; i++) {
                            let monster = entities[i];
                            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
                            if (d <= this.range * ts) { // 确保敌人在作用范围内
                                this.onAim(monster);
                            }
                        }
                    },

                    // 绘制底色和波动效果
                    drawEffect: function() {
                        // 绘制底色
                        noStroke();
                        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
                        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

                        // 绘制波动效果
                        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
                        noFill();
                        stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
                        strokeWeight(2);
                        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

                        // 更新波动计数器
                        this.waveCounter++;
                    },

                    // 更新逻辑
                    update() {
                        this.angle += PI / 60;
                        if (this.cd > 0) this.cd--;
                    },
                }
            ]
        }
    ]
};


tower.bomb = {
    // Display
    baseOnTop: false,
    color: [102, 51, 153],
    drawLine: false,
    length: 0.6,
    width: 0.35,
    secondary: [103, 128, 159],
    // Misc
    name: 'Cannon Tower',
    title: 'Cannon Tower',
    // Stats
    cooldownMax: 60,
    cooldownMin: 40,
    cost: 250,
    damageMax: 60,
    damageMin: 20,
    range: 2,
    type: 'explosion',
    draw: function() {
        push();
        imageMode(CENTER);
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(t4_1Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
        pop();
    },
    // Methods
    drawBarrel: function() {
        // fill(this.secondary);
        // rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
        // fill(191, 85, 236);
        // ellipse(0, 0, this.radius * ts * 2 / 3, this.radius * ts * 2 / 3);
        // 根据塔的 radius 和全局 ts 缩放绘制贴图

        // push();
        // imageMode(CENTER);
        // image(t3_1Image, 0, 0, cellWidth,cellHeight);
        // pop();
    },
    onHit: function(e) {
        var blastRadius = 1;
        var inRadius = getInRange(e.pos.x, e.pos.y, blastRadius, monsters);
        noStroke();
        fill(191, 85, 236, 127);
        ellipse(e.pos.x, e.pos.y, ts * 2.5, ts * 2.5);
        var s = new BombExplosion(e.pos.x, e.pos.y);
            for (var i = 0; i < particleAmt; i++) {
                s.addParticle();
            }
            systems.push(s);
        for (var i = 0; i < inRadius.length; i++) {
            var h = inRadius[i];
            var amt = round(random(this.damageMin, this.damageMax));
            h.dealDamage(amt, this.type);
        }
    },
    upgrades: [
        {
            // Display
            radius: 1.1,
            // Misc
            name: 'Cannon PLUS Tower',
            title: 'Cannon PLUS Tower',
            // Stats
            cooldownMax: 80,
            cooldownMin: 40,
            cost: 250,
            damageMax: 140,
            damageMin: 100,
            draw: function() {
                push();
                imageMode(CENTER);
                // 根据塔的 radius 和全局 ts 缩放绘制贴图
                image(t4_2Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                pop();
            },
            // Methods
            drawBarrel: function() {
                // fill(this.secondary);
                // rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
                // fill(249, 105, 14);
                // ellipse(0, 0, this.radius * ts * 2 / 3, this.radius * ts * 2 / 3);
            },
            onHit: function(e) {
                var blastRadius = 1;
                var inRadius = getInRange(e.pos.x, e.pos.y, blastRadius, monsters);
                noStroke();
                fill(191, 85, 236, 127);
                ellipse(e.pos.x, e.pos.y, ts * 2.5, ts * 2.5);
                var s = new BombExplosion(e.pos.x, e.pos.y);
                    for (var i = 0; i < particleAmt; i++) {
                        s.addParticle();
                    }
                    systems.push(s);
                var segs = 3;
                var a0 = random(0, TWO_PI);
                for (var i = 0; i < segs; i++) {
                    var a = TWO_PI / segs * i + a0;
                    var d = 2 * ts;
                    var x = e.pos.x + cos(a) * d;
                    var y = e.pos.y + sin(a) * d;
                    var inRadius = getInRange(x, y, blastRadius, monsters);
                    var s = new BombExplosion(x, y);
                        for (var j = 0; j < particleAmt / 2; j++) {
                            s.addParticle();
                        }
                        systems.push(s);
                    for (var j = 0; j < inRadius.length; j++) {
                        var h = inRadius[j];
                        var amt = round(random(this.damageMin, this.damageMax));
                        h.dealDamage(amt, this.type);
                    }
                }
            },
            upgrades:[
                {
                    // Display
                    radius: 1.1,
                    // Misc
                    name: 'Cannon MAX Tower',
                    title: 'Cannon MAX Tower',
                    // Stats
                    cooldownMax: 80,
                    cooldownMin: 40,
                    cost: 250,
                    damageMax: 140,
                    damageMin: 100,
                    draw: function() {
                        push();
                        imageMode(CENTER);
                        // 根据塔的 radius 和全局 ts 缩放绘制贴图
                        image(t4_2Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                        pop();
                    },
                    // Methods
                    drawBarrel: function() {
                        // fill(this.secondary);
                        // rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
                        // fill(249, 105, 14);
                        // ellipse(0, 0, this.radius * ts * 2 / 3, this.radius * ts * 2 / 3);
                    },
                    onHit: function(e) {
                        var blastRadius = 1;
                        var inRadius = getInRange(e.pos.x, e.pos.y, blastRadius, monsters);
                        noStroke();
                        fill(191, 85, 236, 127);
                        ellipse(e.pos.x, e.pos.y, ts * 2.5, ts * 2.5);
                        var s = new BombExplosion(e.pos.x, e.pos.y);
                        for (var i = 0; i < particleAmt; i++) {
                            s.addParticle();
                        }
                        systems.push(s);
                        var segs = 3;
                        var a0 = random(0, TWO_PI);
                        for (var i = 0; i < segs; i++) {
                            var a = TWO_PI / segs * i + a0;
                            var d = 2 * ts;
                            var x = e.pos.x + cos(a) * d;
                            var y = e.pos.y + sin(a) * d;
                            var inRadius = getInRange(x, y, blastRadius, monsters);
                            var s = new BombExplosion(x, y);
                            for (var j = 0; j < particleAmt / 2; j++) {
                                s.addParticle();
                            }
                            systems.push(s);
                            for (var j = 0; j < inRadius.length; j++) {
                                var h = inRadius[j];
                                var amt = round(random(this.damageMin, this.damageMax));
                                h.dealDamage(amt, this.type);
                            }
                        }
                    },
                    upgrades:[
                        {
                            // Display
                            baseOnTop: false,
                            color: [102, 51, 153],
                            drawLine: false,
                            length: 0.6,
                            width: 0.35,
                            secondary: [103, 128, 159],
                            // Misc
                            name: 'Cannon MAX Tower',
                            title: 'Cannon MAX Tower',
                            // Stats
                            cooldownMax: 60,
                            cooldownMin: 40,
                            cost: 250,
                            damageMax: 60,
                            damageMin: 20,
                            range: 2,
                            type: 'explosion',
                            draw: function() {
                                push();
                                imageMode(CENTER);
                                // 根据塔的 radius 和全局 ts 缩放绘制贴图
                                image(t4_3Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                                pop();
                            },
                            // Methods
                            drawBarrel: function() {
                                // fill(this.secondary);
                                // rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);
                                // fill(191, 85, 236);
                                // ellipse(0, 0, this.radius * ts * 2 / 3, this.radius * ts * 2 / 3);
                                // 根据塔的 radius 和全局 ts 缩放绘制贴图

                                // push();
                                // imageMode(CENTER);
                                // image(t3_1Image, 0, 0, cellWidth,cellHeight);
                                // pop();
                            },
                            onHit: function(e) {
                                var blastRadius = 1;
                                var inRadius = getInRange(e.pos.x, e.pos.y, blastRadius, monsters);
                                noStroke();
                                fill(191, 85, 236, 127);
                                ellipse(e.pos.x, e.pos.y, ts * 2.5, ts * 2.5);
                                var s = new BombExplosion(e.pos.x, e.pos.y);
                                for (var i = 0; i < particleAmt; i++) {
                                    s.addParticle();
                                }
                                systems.push(s);
                                for (var i = 0; i < inRadius.length; i++) {
                                    var h = inRadius[i];
                                    var amt = round(random(this.damageMin, this.damageMax));
                                    h.dealDamage(amt, this.type);
                                }
                            },

                        }
                    ]
                }
            ]
        }
    ]
};


tower.slow2 = {
    // Display
    baseOnTop: false,
    color: [75, 119, 190], // 底色
    drawLine: false,
    length: 1.1,
    radius: 0.9,
    secondary: [189, 195, 199], // 次要颜色
    width: 0.3,
    // Misc
    name: 'slow2',
    title: 'Slow Tower',
    // Stats
    cooldownMax: 0,
    cooldownMin: 0,
    cost: 100,
    damageMax: 0,
    damageMin: 0,
    range: 3, // 作用范围
    type: 'slow2',

    // 波动效果计数器
    waveCounter: 0,
    draw: function() {
        push();
        imageMode(CENTER);
        // 根据塔的 radius 和全局 ts 缩放绘制贴图
        image(t6_1Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
        pop();
    },

    // Methods
    drawBarrel: function() {
        // fill(this.secondary);
        // var back = -this.length * ts / 2;
        // var side = this.width * ts / 2;
        // rect(back, -side, this.length * ts, this.width * ts);
    },

    // 攻击逻辑
    onAim: function(e) {
        this.attack(e);
    },

    // 攻击效果
    onHit: function(e) {
        e.doEffect('slow2', 40);
    },

    // 目标选择
    target: function(entities) {
        entities = this.visible(entities);
        if (entities.length === 0) return;
        if (!this.canFire()) return;
        this.resetCooldown();

        // 绘制底色和波动效果
        this.drawEffect();

        // 对范围内的所有敌人应用效果
        for (var i = 0; i < entities.length; i++) {
            let monster = entities[i];
            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
            if (d <= this.range * ts) { // 确保敌人在作用范围内
                this.onAim(monster);
            }
        }
    },

    // 绘制底色和波动效果
    drawEffect: function() {
        // 绘制底色
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

        // 绘制波动效果
        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
        noFill();
        stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
        strokeWeight(2);
        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

        // 更新波动计数器
        this.waveCounter++;
    },

    // 更新逻辑
    update() {
        this.angle += PI / 60;
        if (this.cd > 0) this.cd--;
    },

    // 升级选项
    upgrades: [
        {
            // Display
            baseOnTop: false,
            color: [75, 119, 190], // 底色
            drawLine: false,
            length: 1.1,
            radius: 0.9,
            secondary: [189, 195, 199], // 次要颜色
            width: 0.3,
            // Misc
            name: 'slow2',
            title: 'Slow Tower',
            // Stats
            cooldownMax: 0,
            cooldownMin: 0,
            cost: 100,
            damageMax: 0,
            damageMin: 0,
            range: 3, // 作用范围
            type: 'slow2',

            // 波动效果计数器
            waveCounter: 0,
            draw: function() {
                push();
                imageMode(CENTER);
                // 根据塔的 radius 和全局 ts 缩放绘制贴图
                image(t6_2Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                pop();
            },

            // Methods
            drawBarrel: function() {
                // fill(this.secondary);
                // var back = -this.length * ts / 2;
                // var side = this.width * ts / 2;
                // rect(back, -side, this.length * ts, this.width * ts);
            },

            // 攻击逻辑
            onAim: function(e) {
                this.attack(e);
            },

            // 攻击效果
            onHit: function(e) {
                e.doEffect('slow2', 40);
            },

            // 目标选择
            target: function(entities) {
                entities = this.visible(entities);
                if (entities.length === 0) return;
                if (!this.canFire()) return;
                this.resetCooldown();

                // 绘制底色和波动效果
                this.drawEffect();

                // 对范围内的所有敌人应用效果
                for (var i = 0; i < entities.length; i++) {
                    let monster = entities[i];
                    let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
                    if (d <= this.range * ts) { // 确保敌人在作用范围内
                        this.onAim(monster);
                    }
                }
            },

            // 绘制底色和波动效果
            drawEffect: function() {
                // 绘制底色
                noStroke();
                fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
                ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

                // 绘制波动效果
                let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
                noFill();
                stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
                strokeWeight(2);
                ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

                // 更新波动计数器
                this.waveCounter++;
            },

            // 更新逻辑
            update() {
                this.angle += PI / 60;
                if (this.cd > 0) this.cd--;
            },

            // 升级选项
            upgrades: [
                {
                    // Display
                    baseOnTop: false,
                    color: [75, 119, 190], // 底色
                    drawLine: false,
                    length: 1.1,
                    radius: 0.9,
                    secondary: [189, 195, 199], // 次要颜色
                    width: 0.3,
                    // Misc
                    name: 'slow',
                    title: 'Slow Tower',
                    // Stats
                    cooldownMax: 0,
                    cooldownMin: 0,
                    cost: 100,
                    damageMax: 0,
                    damageMin: 0,
                    range: 3, // 作用范围
                    type: 'slow2',

                    // 波动效果计数器
                    waveCounter: 0,
                    draw: function() {
                        push();
                        imageMode(CENTER);
                        // 根据塔的 radius 和全局 ts 缩放绘制贴图
                        image(t6_3Image, this.pos.x, this.pos.y, cellWidth,cellHeight);
                        pop();
                    },

                    // Methods
                    drawBarrel: function() {
                        // fill(this.secondary);
                        // var back = -this.length * ts / 2;
                        // var side = this.width * ts / 2;
                        // rect(back, -side, this.length * ts, this.width * ts);
                    },

                    // 攻击逻辑
                    onAim: function(e) {
                        this.attack(e);
                    },

                    // 攻击效果
                    onHit: function(e) {
                        e.doEffect('slow2', 40);
                    },

                    // 目标选择
                    target: function(entities) {
                        entities = this.visible(entities);
                        if (entities.length === 0) return;
                        if (!this.canFire()) return;
                        this.resetCooldown();

                        // 绘制底色和波动效果
                        this.drawEffect();

                        // 对范围内的所有敌人应用效果
                        for (var i = 0; i < entities.length; i++) {
                            let monster = entities[i];
                            let d = dist(this.pos.x, this.pos.y, monster.pos.x, monster.pos.y);
                            if (d <= this.range * ts) { // 确保敌人在作用范围内
                                this.onAim(monster);
                            }
                        }
                    },

                    // 绘制底色和波动效果
                    drawEffect: function() {
                        // 绘制底色
                        noStroke();
                        fill(this.color[0], this.color[1], this.color[2], 50); // 半透明底色
                        ellipse(this.pos.x, this.pos.y, this.range * 2 * ts, this.range * 2 * ts);

                        // 绘制波动效果
                        let waveRadius = (this.waveCounter % 40) / 40 * this.range * ts; // 波动半径（频率提高 1.5 倍）
                        noFill();
                        stroke(255, 255, 255, 100); // 波动颜色为白色，半透明
                        strokeWeight(2);
                        ellipse(this.pos.x, this.pos.y, waveRadius * 2, waveRadius * 2);

                        // 更新波动计数器
                        this.waveCounter++;
                    },

                    // 更新逻辑
                    update() {
                        this.angle += PI / 60;
                        if (this.cd > 0) this.cd--;
                    },
                }
            ]
        }
    ]
};