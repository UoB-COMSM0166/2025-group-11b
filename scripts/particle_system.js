// 粒子系统类，定义了一个粒子系统
class ParticleSystem {
    constructor(x, y) {
        // 初始化原点位置，并创建一个空的粒子数组
        this.origin = createVector(x, y);
        this.particles = [];
    }

    // 向粒子系统中添加一个新粒子
    addParticle() {
        this.particles.push(new Particle(this.origin, 1))
    }

    // 检查粒子系统是否已经没有粒子
    isDead() {
        return this.particles.length === 0;
    }

    // 执行粒子系统，更新每个粒子的状态
    run() {
        // 从后向前遍历粒子数组
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.run(); // 运行粒子的动作

            // 如果粒子已经死掉，则从数组中删除它
            if (p.isDead()) this.particles.splice(i, 1);
        }
    }
}

// 火箭爆炸类，继承自粒子系统
class RocketExplosion extends ParticleSystem {
    constructor(x, y) {
        super(x, y); // 调用父类构造函数
    }

    // 覆盖父类的 addParticle 方法，添加火焰粒子
    addParticle() {
        this.particles.push(new Fire(this.origin, 5));
    }
}

// 炸弹爆炸类，继承自粒子系统
class BombExplosion extends ParticleSystem {
    constructor(x, y) {
        super(x, y); // 调用父类构造函数
    }

    // 覆盖父类的 addParticle 方法，添加炸弹粒子
    addParticle() {
        this.particles.push(new Bomb(this.origin, 2));
    }
}

// 弹片爆炸类，继承自粒子系统
class ShrapnelExplosion extends ParticleSystem {
    constructor(x, y) {
        super(x, y); // 调用父类构造函数
    }

    // 覆盖父类的 addParticle 方法，添加弹片粒子
    addParticle() {
        this.particles.push(new Shrapnel(this.origin, 5));
    }
}
