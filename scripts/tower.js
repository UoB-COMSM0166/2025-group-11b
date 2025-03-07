class Tower {  // 创建塔的类
    constructor(col, row) {  // 构造函数，初始化塔的位置和属性
        // Display  // 渲染相关
        this.baseOnTop = true;      // 是否在炮管上方绘制塔基
        this.color = [0, 0, 0];     // 主色
        this.drawLine = true;       // 是否绘制攻击目标的连线
        this.follow = true;         // 是否跟随目标，即使不攻击
        this.hasBarrel = true;      // 是否有炮管
        this.hasBase = true;        // 是否有塔基
        this.length = 0.7;          // 炮管长度（以瓦片为单位）
        this.radius = 1;            // 塔基半径（以瓦片为单位）
        this.secondary = [0, 0, 0]; // 辅助色
        this.weight = 2;            // 激光描边宽度
        this.width = 0.3;           // 炮管宽度（以瓦片为单位）
        this.health =10;

        // Misc  // 杂项
        this.alive = true;          // 塔是否存活
        this.name = 'tower';        // 塔的名称
        this.sound = null;          // 发射时播放的声音
        this.title = 'Tower';       // 塔的标题

        // Position  // 塔的位置
        this.angle = 0;             // 塔的角度
        this.gridPos = createVector(col, row);  // 格子位置
        this.pos = createVector(col*ts + ts/2, row*ts + ts/2);  // 屏幕位置

        // Stats  // 塔的属性
        this.cooldownMax = 0;       // 最大冷却时间
        this.cooldownMin = 0;       // 最小冷却时间
        this.cost = 0;              // 塔的购买成本
        this.damageMax = 20;        // 最大伤害
        this.damageMin = 1;         // 最小伤害
        this.range = 3;             // 攻击范围（瓦片单位）
        this.totalCost = 0;         // 总成本
        this.type = 'physical';     // 伤害类型
        this.upgrades = [];         // 升级列表
    }

    // Adjust angle to point towards pixel position  // 调整角度指向目标
    aim(x, y) {
        this.angle = atan2(y - this.pos.y, x - this.pos.x);  // 计算角度
    }

    // Deal damage to monster  // 对怪物造成伤害
    attack(e) {

        var damage = round(random(this.damageMin, this.damageMax));  // 随机伤害
        e.dealDamage(damage, this.type);  // 伤害怪物
        if (sounds.hasOwnProperty(this.sound)) {  // 如果有声音，播放声音
            sounds[this.sound].play();
        }
        this.onHit(e);  // 对目标进行后续操作
    }

    // Check if cooldown is completed  // 检查冷却时间是否完成
    canFire() {
        return this.cd === 0;  // 如果冷却时间为0，表示可以攻击
    }

    draw() {  // 绘制塔
        // Draw turret base  // 绘制塔基
        if (this.hasBase && !this.baseOnTop) this.drawBase();
        // Draw barrel  // 绘制炮管
        if (this.hasBarrel) {
            push();
            translate(this.pos.x, this.pos.y);
            rotate(this.angle);  // 旋转炮管
            this.drawBarrel();  // 绘制炮管
            pop();
        }
        // Draw turret base  // 再次绘制塔基
        if (this.hasBase && this.baseOnTop) this.drawBase();
    }

    // Draw barrel of tower (moveable part)  // 绘制塔的炮管（可移动部分）
    drawBarrel() {
        fill(this.secondary);  // 设置填充颜色
        rect(0, -this.width * ts / 2, this.length * ts, this.width * ts);  // 绘制矩形炮管
    }

    // Draw base of tower (stationary part)  // 绘制塔基（固定部分）
    drawBase() {
        fill(this.color);  // 设置填充颜色
        ellipse(this.pos.x, this.pos.y, this.radius * ts, this.radius * ts);  // 绘制椭圆形塔基
    }

    // Returns damage range  // 返回伤害范围
    getDamage() {
        return rangeText(this.damageMin, this.damageMax);  // 返回伤害文本
    }

    // Returns average cooldown in seconds  // 返回平均冷却时间（秒）
    getCooldown() {
        return (this.cooldownMin + this.cooldownMax) / 120;  // 计算冷却时间
    }

    kill() {  // 将塔标记为死亡
        this.alive = false;
    }

    isDead() {  // 检查塔是否死亡
        return !this.alive;
    }

    // Functionality once entity has been targeted  // 目标被选中后的操作
    onAim(e) {
        if (this.canFire() || this.follow) this.aim(e.pos.x, e.pos.y);  // 目标锁定
        if (!this.canFire()) return;  // 如果不能攻击，返回
        this.resetCooldown();  // 重置冷却时间
        this.attack(e);  // 攻击目标
        // Draw line to target  // 绘制攻击目标的连线
        if (!this.drawLine) return;
        stroke(this.color);  // 设置线条颜色
        strokeWeight(this.weight);  // 设置线条宽度
        line(this.pos.x, this.pos.y, e.pos.x, e.pos.y);  // 绘制连线
        strokeWeight(1);  // 重置线条宽度
    }

    onCreate() {  // 创建时的初始化
        this.cd = 0;  // 设置冷却时间为0
    }

    onHit(e) {}  // 目标被击中时的操作

    // 塔被攻击时加点效果
    dealDamage(amt, type) { // 处理伤害



        if (this.health > 0) { // 如果生命值大于 0
            this.health -= amt ; // 计算最终伤害


        }
        if (this.health <= 0) this.kill(); // 如果生命值小于等于 0，调用死亡逻辑


    }

    resetCooldown() {  // 重置冷却时间
        var cooldown = round(random(this.cooldownMin, this.cooldownMax));  // 随机生成冷却时间
        this.cd = cooldown;  // 设置冷却时间
    }

    // Sell price  // 塔的出售价格
    sellPrice() {
        return floor(this.totalCost * sellConst);  // 返回出售价格
    }

    // Target correct monster  // 锁定正确的怪物
    target(entities) {
        entities = this.visible(entities);  // 获取可见的怪物
        if (entities.length === 0) return;  // 如果没有可见怪物，返回
        var t = getTaunting(entities);  // 获取挑衅的怪物
        if (t.length > 0) entities = t;  // 如果有挑衅的怪物，选择它们
        var e = getFirst(entities);  // 获取第一个怪物
        if (typeof e === 'undefined') return;  // 如果没有目标，返回
        this.onAim(e);  // 锁定目标并攻击
    }

    update() {  // 更新塔的状态
        if (this.cd > 0) this.cd--;  // 如果冷却时间大于0，减少冷却时间
    }

    // Use template to set attributes  // 使用模板设置塔的属性
    upgrade(template) {
        template = typeof template === 'undefined' ? {} : template;  // 如果没有传入模板，使用空对象
        var keys = Object.keys(template);  // 获取模板的所有键
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];  // 遍历模板键
            this[key] = template[key];  // 设置属性
        }
        if (template.cost) this.totalCost += template.cost;  // 如果有成本，增加总成本
    }

    // Returns array of visible entities out of passed array  // 返回可见实体的数组
    visible(entities) {
        return getInRange(this.pos.x, this.pos.y, this.range, entities);  // 获取在范围内的实体
    }
}
