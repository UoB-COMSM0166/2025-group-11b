class Monster {
    constructor(x, y, thePath) {
        // Display
        this.color = [0, 0, 0];
        this.radius = 0.5;          // radius in tiles
        this.path = thePath;   // 把参数赋给 this.path
        // Misc
        this.alive = true;
        this.effects = [];          // status effects
        this.name = 'monster';
        this.sound = 'pop';         // death sound

        // Position
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);

        this.pathIndex = 0;        // 当前走到第几个节点   

        // Stats
        this.cash = 0;
        this.damage = 1;
        this.health = 1;
        this.immune = [];           // no damage from these damage types
        this.resistant = [];        // reduced damage from these damage types
        this.weak = [];             // increased damage from these damage types
        this.speed = 1;             // 4 is the max
        this.taunt = false;         // force towers to target
        
        // frame defalt set
        this.frameIndex = 0; // 当前帧索引
        this.frameCount = 4; // 总帧数
        this.animationSpeed = 5; // 控制动画切换速度
        this.facingRight = true; // 默认朝右
    }


    draw() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading());

        // 设置图片模式，以中心点对齐
        imageMode(CENTER);
       
      // 如果图片未加载，则使用默认颜色
      stroke(0);
      fill(this.getColor());
      var back = -0.7 * ts / 3;
      var front = back + 0.7 * ts;
      var side = 0.9 * ts / 2;
      quad(back, -side, 0, 0, back, side, front, 0);
        pop();
    }

    // 怪物被攻击时加点效果
    dealDamage(amt, type) {
        var mult;
        if (this.immune.includes(type)) {
            mult = 0; // 免疫：不受伤害
        } else if (this.resistant.includes(type)) {
            mult = 1 - resistance;  // 伤害减少resistance
        } else if (this.weak.includes(type)) {
            mult = 1 + weakness;  // 受到 多weakness 伤害
        } else {
            type ='physical'// 默认物理攻击
            mult = 1; // 正常伤害
        }

        if (this.health > 0) {
            this.health -= amt * mult;  // 计算最终伤害
            this.flash(type, 10);  // 触发对应类型的特效
        }
        if (this.health <= 0) this.onKilled();
    }

    flash(color, duration) {
        let originalColor = this.color; // 记录原始颜色
        let flashCount = 5;  // 闪烁 5 次
    
        let interval = setInterval(() => {
            this.color = this.color === originalColor ? color : originalColor; // 闪烁颜色
        }, duration * 5); // 频率更快
    
        setTimeout(() => {
            clearInterval(interval); // 停止闪烁
            this.color = originalColor; // 恢复原色
        }, duration * flashCount); // 总共闪烁 flashCount 次
    }
  
    createGlowEffect(color) {
        noFill();
        stroke(color[0], color[1], color[2], 100);
        strokeWeight(4);
    
        for (let i = 0; i < 3; i++) {
            let size = ts * (1.2 + i * 0.2);
            ellipse(0, 0, size, size);
        }
    }
    flash(type, duration) {
        this.flashType = type; // 记录攻击类型
        this.flashActive = true; // 启动闪烁
    
        setTimeout(() => {
            this.flashActive = false; // 关闭特效
            this.flashType = null; // 恢复正常颜色
        }, duration * 10);
    }
   
    // Apply new status effect
    // Only one of each is allowed at a time
    // 被塔施加效果，与dealDamage区别

    doEffect(name, duration) {
        if (this.immune.includes(name)) return;
        if (getByName(this.effects, name).length > 0) return;
        var e = createEffect(duration, effects[name]);
        e.onStart(this);
        this.effects.push(e);
    }
    createRippleEffect(color) {
        noFill();
        stroke(color[0], color[1], color[2], 150);
        strokeWeight(2);
    
        for (let i = 0; i < 3; i++) {
            let size = ts * (1.0 + i * 0.2);
            ellipse(0, 0, size, size);
        }
    }
    createLightningEffect(color) {
        stroke(color[0], color[1], color[2]);
        strokeWeight(3);
        let boltX = random(-this.radius * ts, this.radius * ts);
        let boltY = random(-this.radius * ts, this.radius * ts);
        line(0, 0, boltX, boltY);
        line(boltX, boltY, boltX + random(-5, 5), boltY + random(-5, 5));
    }
    createIceEffect(color) {
        stroke(color[0], color[1], color[2], 180);
        strokeWeight(2);
        for (let i = 0; i < 6; i++) {
            let angle = (TWO_PI / 6) * i;
            let x = cos(angle) * this.radius * ts;
            let y = sin(angle) * this.radius * ts;
            line(0, 0, x, y);
        }
    }
    shake(amount) {
        let originalX = this.pos.x;
        let originalY = this.pos.y;
        let shakeCount = 5;  // 抖动次数
    
        let interval = setInterval(() => {
            this.pos.x = originalX + random(-amount, amount);
            this.pos.y = originalY + random(-amount, amount);
        }, 50); // 每 50ms 震动一次
    
        setTimeout(() => {
            clearInterval(interval);
            this.pos.x = originalX;
            this.pos.y = originalY; // 恢复原位置
        }, shakeCount * 50); // 震动 shakeCount 次
    }
    // Draw health bar
    showHealth() {
        var percent = 1 - this.health / this.maxHealth;
        if (percent === 0) return;
        
        push();
        translate(this.pos.x, this.pos.y);

        stroke(255);
        fill(207, 0, 15);
        var edge = 0.7 * ts / 2;
        var width = floor(edge * percent * 2);
        var top = 0.2 * ts;
        var height = 0.15 * ts;
        rect(-edge, top, edge * percent * 2, height);

        pop();
    }

    getColor() {
        var l = this.effects.length;
        if (l > 0) return this.effects[l - 1].color;
        return this.color;
    }

    ifDie() {
        return !this.alive;
    }

    kill() {
        this.alive = false;
    }

    onBorn() {
        this.maxHealth = this.health;
    }

    quit() {
        health -= this.damage;
        this.kill();
    }

    onKilled() {
        if (this.alive) {
            cash += this.cash;
            this.kill();
            if (sounds.hasOwnProperty(this.sound)) {
                sounds[this.sound].play();
            }
        }
    }

    onTick() {}

    // Return speed in pixels per tick
    // Adjusted to not be affected by zoom level
    pxSpeed() {
        return this.speed * ts / 24 * monsterSpeedMultiplier;
    }

    // Change direction based on pathfinding map
    move() {
        // 如果没有预先设定的 BFS 路径，或者路径是空，就不移动
        if (!this.path || this.path.length === 0) return;

        // 如果已经走到或超过 path.length，说明怪物到终点了
        if (this.pathIndex >= this.path.length) {
            // 你可以在这里扣血、kill 怪物等操作
            // this.quit(); // 或 something
            return;
        }

        // 要前往的下一个节点
        let tile = this.path[this.pathIndex];
        // 把网格坐标转为像素坐标
        let targetPos = center(tile.col, tile.row);

        // 计算本帧移动
        let dir = p5.Vector.sub(targetPos, this.pos);
        let dist = dir.mag();
        let step = this.pxSpeed(); // 每帧走的像素距离

        if (dist <= step) {
            // 一帧之内就能到达目标点
            this.pos = targetPos.copy();
            this.pathIndex++; // 前进到下一个点

            // 如果已经是终点，可以额外处理
            if (this.pathIndex >= this.path.length) {
                // 抵达终点 => 扣血 + kill
                this.quit();
            }
        } else {
            // 还在路上 => 继续往目标前进
            dir.normalize();
            dir.mult(step);
            this.pos.add(dir);
        }
    }

    update() {
        // Apply status effects
        for (let i = this.effects.length - 1; i >= 0; i--) {
            let e = this.effects[i];
            e.update(this);

            if (e.isDead()) this.effects.splice(i, 1);
        }
        
        // Movement
        // this.vel.limit(96 / ts);
        this.vel.limit(this.pxSpeed());
        this.pos.add(this.vel);
    }
}
