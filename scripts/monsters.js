function createMonster(x, y, template) {
    // 关键：再把 BFS 路径存进 e.path 里
    let bfsPath = findPathBFS(grid); // 使用 BFS 寻找路径

    let e = new Monster(x, y, bfsPath); // 创建一个怪物实例
    e.path = bfsPath || []; // 赋值路径信息

    // 把 monster[name] 里的属性赋到 e 上
    Object.assign(e, template); // 复制模板属性到怪物实例

    // 确保所有键都填充到 e 上
    template = typeof template === 'undefined' ? {} : template; // 处理未定义的模板
    var keys = Object.keys(template); // 获取模板的所有键
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        e[key] = template[key]; // 赋值每个键到怪物实例
    }
    e.onBorn(); // 触发出生事件
    return e; // 返回创建的怪物
}

var monster = {}; // 定义怪物对象存储不同类型的怪物

function loadMoster() {
    // 定义强盗怪物 Bandit
    monster.Bandit = {
        color: [0, 255, 0], // 颜色
        name: 'Bandit', // 名称
        image: BanditImg, // 图片
        cash: 2, // 击败后奖励金钱
        health: 50, // 生命值
        speed: 0.7, // 移动速度
        imageIndex: 0, // 记录当前动画帧
        draw() {


            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度


            // //TODO:使用tint会师程序变卡  一般是贴图形成动画
            // // 被攻击特效
            if (this.flashType === 'physical') {
                tint(255, 0, 0); // 物理攻击（红色）
                // this.createGlowEffect([255, 0, 0]); // 物理攻击光晕
            } else if (this.flashType === 'water') {
                tint(0, 191, 255); // 水攻击（蓝色）
                this.createRippleEffect([0, 191, 255]); // 水波纹
            } else if (this.flashType === 'fire') {
                tint(255, 69, 0); // 火攻击（橙红色）
                this.createGlowEffect([255, 69, 0]); // 火焰光晕

            } else if (this.flashType === 'line') {
                tint(255, 215, 0); // 雷电攻击（黄色）
                this.createLightningEffect([255, 215, 0]); // 电弧
            } else if (this.flashType === 'slow') {
                tint(173, 216, 230); // 冰霜（浅蓝色）
                this.createIceEffect([173, 216, 230]); // 冰霜冻结
            } else if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m1Images.length; // 切换动画帧
                }
            }
            image(m1Images[this.imageIndex], 0, 0, ts, ts); // 绘制怪物
            pop();
            this.flashType = null;
            // noTint(); // 正常颜色
        }
    };

    // 定义攻城槌怪物 BatteringRam
    monster.BatteringRam = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'BatteringRam', // 名称
        speed: 0.3, // 速度
        cash: 3, // 击败后奖励金钱
        health: 120, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m_2Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            //TODO:使用tint会师程序变卡  一般是贴图形成动画
            // 被攻击特效
            if (this.flashType === 'physical') {
                tint(255, 0, 0); // 物理攻击（红色）
                // this.createGlowEffect([255, 0, 0]); // 物理攻击光晕
            } else if (this.flashType === 'water') {
                tint(0, 191, 255); // 水攻击（蓝色）
                this.createRippleEffect([0, 191, 255]); // 水波纹
            } else if (this.flashType === 'fire') {
                tint(255, 69, 0); // 火攻击（橙红色）
                this.createGlowEffect([255, 69, 0]); // 火焰光晕

            } else if (this.flashType === 'energy') {
                tint(255, 215, 0); // 雷电攻击（黄色）
                this.createLightningEffect([255, 215, 0]); // 电弧
            } else if (this.flashType === 'slow') {
                tint(173, 216, 230); // 冰霜（浅蓝色）
                this.createIceEffect([173, 216, 230]); // 冰霜冻结
            } else if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m2Images.length; // 切换动画帧
                }
            }
            image(m2Images[this.imageIndex], 0, 0, ts, ts); // 绘制怪物
            pop();
            this.flashType = null;
            // noTint(); // 正常颜色
        }
    };


    monster.Mouse = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'Mouse', // 名称
        speed: 0.5, // 速度
        cash: 3, // 击败后奖励金钱
        health: 150, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m3Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            //TODO:使用tint会师程序变卡  一般是贴图形成动画
            // 被攻击特效
            if (this.flashType === 'physical') {
                tint(255, 0, 0); // 物理攻击（红色）
                // this.createGlowEffect([255, 0, 0]); // 物理攻击光晕
            } else if (this.flashType === 'water') {
                tint(0, 191, 255); // 水攻击（蓝色）
                this.createRippleEffect([0, 191, 255]); // 水波纹
            } else if (this.flashType === 'fire') {
                tint(255, 69, 0); // 火攻击（橙红色）
                this.createGlowEffect([255, 69, 0]); // 火焰光晕

            } else if (this.flashType === 'energy') {
                tint(255, 215, 0); // 雷电攻击（黄色）
                this.createLightningEffect([255, 215, 0]); // 电弧
            } else if (this.flashType === 'slow') {
                tint(173, 216, 230); // 冰霜（浅蓝色）
                this.createIceEffect([173, 216, 230]); // 冰霜冻结
            } else if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m3Images.length; // 切换动画帧
                }
            }
            image(m3Images[this.imageIndex], 0, 0, ts, ts); // 绘制怪物
            pop();

            // noTint(); // 正常颜色
        }
    };

    monster.PirateRaider = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'PirateRaider', // 名称
        speed: 0.5, // 速度
        cash: 3, // 击败后奖励金钱
        health: 70, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m4Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            //TODO:使用tint会师程序变卡  一般是贴图形成动画
            // 被攻击特效
            if (this.flashType === 'physical') {
                // tint(255, 0, 0); // 物理攻击（红色）
                // this.createGlowEffect([255, 0, 0]); // 物理攻击光晕
            } else if (this.flashType === 'water') {
                tint(0, 191, 255); // 水攻击（蓝色）
                this.createRippleEffect([0, 191, 255]); // 水波纹
            } else if (this.flashType === 'fire') {
                // tint(255, 69, 0); // 火攻击（橙红色）
                this.createGlowEffect([255, 69, 0]); // 火焰光晕

            } else if (this.flashType === 'energy') {
                // tint(255, 215, 0); // 雷电攻击（黄色）
                this.createLightningEffect([255, 215, 0]); // 电弧
            } else if (this.flashType === 'slow') {
                // tint(173, 216, 230); // 冰霜（浅蓝色）
                this.createIceEffect([173, 216, 230]); // 冰霜冻结
            } else if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m4Images.length; // 切换动画帧
                }
            }
            image(m4Images[this.imageIndex], 0, 0, ts, ts); // 绘制怪物
            pop();

            // noTint(); // 正常颜色
        },
        onAim(e) {
            // if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);
            // if (!this.canFire()) return;
            // this.resetCooldown();

            let bulletDamage = round(random(1,2));
            // 实例化一个子弹，从塔的位置飞向目标
            if(frameCount%60==0){
                let b = new Bullet2(this.pos.x, this.pos.y, e, bulletDamage);
                projectiles.push(b);
            }






            // // 如果你需要额外的 onHit 后续处理，可以调用它
            // this.onHit(e);

        }
    };

    monster.DroneSwarm = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'DroneSwarm', // 名称
        speed: 0.5, // 速度
        cash: 3, // 击败后奖励金钱
        health: 70, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m5Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: ['regen'], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            //TODO:使用tint会师程序变卡  一般是贴图形成动画
            // 被攻击特效
            if (this.flashType === 'physical') {
                // tint(255, 0, 0); // 物理攻击（红色）
                // this.createGlowEffect([255, 0, 0]); // 物理攻击光晕
            } else if (this.flashType === 'water') {
                tint(0, 191, 255); // 水攻击（蓝色）
                this.createRippleEffect([0, 191, 255]); // 水波纹
            } else if (this.flashType === 'fire') {
                // tint(255, 69, 0); // 火攻击（橙红色）
                this.createGlowEffect([255, 69, 0]); // 火焰光晕

            } else if (this.flashType === 'energy') {
                // tint(255, 215, 0); // 雷电攻击（黄色）
                this.createLightningEffect([255, 215, 0]); // 电弧
            } else if (this.flashType === 'slow') {
                // tint(173, 216, 230); // 冰霜（浅蓝色）
                this.createIceEffect([173, 216, 230]); // 冰霜冻结
            } else if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m5Images.length; // 切换动画帧
                }
            }
            image(m5Images[this.imageIndex], 0, 0, ts, ts); // 绘制怪物
            pop();

            // noTint(); // 正常颜色
        }
    };


    monster.AIMech = {
        color: [255, 0, 0], // 颜色
        radius: 0.6, // 半径
        name: 'AIMech', // 名称
        speed: 0.5, // 速度
        cash: 3, // 击败后奖励金钱
        health: 70, // 生命值
        frameIndex: 0, // 记录当前动画帧索引
        frameCount: 3, // 总帧数
        image: m6Image, // 图片
        imageIndex: 0, // 记录动画索引
        animationSpeed: 25, // 控制动画速度
        facingRight: true, // 是否朝右
        immune: [], // 免疫属性
        draw() {
            push();
            imageMode(CENTER); // 设置图片模式为中心对齐
            translate(this.pos.x, this.pos.y); // 位置移动
            rotate(this.vel.heading()); // 旋转角度

            //TODO:使用tint会师程序变卡  一般是贴图形成动画
            // 被攻击特效
            if (this.flashType === 'physical') {
                // tint(255, 0, 0); // 物理攻击（红色）
                // this.createGlowEffect([255, 0, 0]); // 物理攻击光晕
            } else if (this.flashType === 'water') {
                tint(0, 191, 255); // 水攻击（蓝色）
                this.createRippleEffect([0, 191, 255]); // 水波纹
            } else if (this.flashType === 'fire') {
                // tint(255, 69, 0); // 火攻击（橙红色）
                this.createGlowEffect([255, 69, 0]); // 火焰光晕

            } else if (this.flashType === 'energy') {
                // tint(255, 215, 0); // 雷电攻击（黄色）
                this.createLightningEffect([255, 215, 0]); // 电弧
            } else if (this.flashType === 'slow') {
                // tint(173, 216, 230); // 冰霜（浅蓝色）
                this.createIceEffect([173, 216, 230]); // 冰霜冻结
            } else if (paused == false) { // 如果游戏未暂停
                if (frameCount % 10 == 0) {
                    this.imageIndex = (this.imageIndex + 1) % m6Images.length; // 切换动画帧
                }
            }
            image(m6Images[this.imageIndex], 0, 0, ts, ts); // 绘制怪物

            this.count ++;

            // if(this.count<20){
                if(frameCount%20==0){

                }   if(random(1)<0.5){
                this.isProtect=! this.isProtect;
            }



            // }

            if(this.isProtect){
                fill(0,random(100));
                ellipse(0,0,ts*0.8, ts*0.8);
            }

            pop();

            // noTint(); // 正常颜色
        }
    };


}
