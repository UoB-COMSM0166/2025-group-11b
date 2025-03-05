// 定义 Bullet 类：用于模拟子弹飞行效果
class Bullet {
    constructor(x, y, target, damage, speed = 10) {
      this.pos = createVector(x, y);
      this.target = target;
      this.damage = damage;
      this.speed = speed;
      // 计算单位方向向量
      this.dir = p5.Vector.sub(target.pos, createVector(x, y)).normalize();
      this.alive = true;
      // 子弹尺寸（基于 ts 缩放）
      this.width = ts * 0.5;
      this.height = ts * 0.2;
    }
    // 新增方法：判断子弹是否存活
    isDead() {
      return !this.alive;
    }
    // 新增一个空的 steer 方法，避免调用时出错
    steer() {
    // Bullet 不需要额外的转向逻辑
    }
    // 判断子弹是否到达目标附近
    reachedTarget() {
        
      return this.pos.dist(this.target.pos) < this.target.radius * ts * 0.8;
    }
    
    update() {
        // 每帧更新目标方向
        this.dir = p5.Vector.sub(this.target.pos, this.pos).normalize();
        this.pos.add(p5.Vector.mult(this.dir, this.speed));
        if (this.reachedTarget()) {
          this.explode();
        }
    }
    
    draw() {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.dir.heading());
      noStroke();
      fill(255, 204, 0); // 子弹主体为亮黄色
      // 绘制一个带圆角的矩形模拟子弹体
      rectMode(CENTER);
      rect(0, 0, this.width, this.height, 3);
      // 在前端绘制一个小三角形作为子弹尖
      fill(255, 255, 100);
      triangle(this.width/2, -this.height/2, this.width/2, this.height/2, this.width/2 + 4, 0);
      pop();
    }
      // **添加 `explode()` 方法**
    explode() {
        if (this.alive) {
            this.target.dealDamage(this.damage, 'physical');
            this.alive = false;

        // 这里可以添加粒子效果，比如火花、烟雾等
        let explosion = new RocketExplosion(this.pos.x, this.pos.y);
        for (let i = 0; i < 10; i++) {
        explosion.addParticle();
        }
        systems.push(explosion);
        }
    }
    // **添加 `kill()` 方法**
    kill() {
        this.alive = false;
    }
  }