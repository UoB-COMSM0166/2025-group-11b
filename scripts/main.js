let mapData = maps.customMap;  // 获取自定义地图数据
// let cellWidth = 1440 / mapData.cols;  // 每个网格的宽度
// let cellHeight = 768 / mapData.rows;  // 每个网格的高度

let cellWidth = 110;  // 每个网格的宽度
let cellHeight = 110;  // 每个网格的高度

let debugMap = false;  // 是否显示调试地图

// 开场白开始游戏
var isStartGame = false;  // 游戏是否开始

var monsters = [];  // 存放怪物的数组
var projectiles = [];  // 存放投射物的数组
var systems = [];  // 存放系统的数组
var towers = [];  // 存放塔的数组
var newMonsters = [];  // 存放新怪物的数组
var newProjectiles = [];  // 存放新投射物的数组
var newTowers = [];  // 存放新塔的数组

var cols;  // 地图的列数
var rows;  // 地图的行数
var tileZoom = 2;  // 瓦片的缩放倍率
var ts = 110;  // 单元格大小

var zoomDefault = ts;  // 默认的瓦片大小

var particleAmt = 32;  // 每次爆炸绘制的粒子数量

var custom;  // 自定义地图的JSON数据
var display;  // 图形显示瓦片
var displayDir;  // 显示瓦片的方向
// (0 = 无方向, 1 = 左, 2 = 上, 3 = 右, 4 = 下)
var dists = buildArray(12, 8, null);  // 创建一个12列8行的数组，默认值为null
// 到出口的距离
var grid;  // 瓦片类型
// (0 = 空, 1 = 墙, 2 = 路径, 3 = 塔,
// 4 = 仅怪物行走路径)
var metadata;  // 瓦片元数据
var paths;  // 到出口的路径方向
var visitMap;  // 是否可以到达出口
var walkMap;  // 可行走地图

var exit;  // 出口
var spawnpoints = [];  // 怪物的生成点
var tempSpawns = [];  // 临时生成点

var cash;  // 当前的金钱
var health;  // 当前的生命值
var maxHealth;  // 最大生命值
var wave;  // 当前波次

var spawnCool;  // 怪物生成的冷却时间

var bg;  // 背景色

var selected;  // 当前选中的对象
var towerType;  // 当前塔的类型

var sounds;  // 所有音效的字典

var paused;  // 游戏是否暂停
var randomWaves = true;  // 是否使用随机波次
var scd;  // 下一次生成怪物的倒计时
var skipToNext = false;  // 是否跳过当前波次直接开始下一波
var toCooldown;  // 用于重置生成冷却时间的标志
var toPathfind;  // 用于更新怪物寻路的标志
var toPlace;  // 用于放置塔的标志
var toWait;  // 用于等待下一波的标志
var wcd;  // 下一波的倒计时

var minDist = 15;  // 生成点和出口的最小距离
var resistance = 0.5;  // 伤害抵抗百分比
var sellConst = 0.8;  // 塔出售价格与购买价格的比例
var waveCool = 120;  // 波次之间的冷却时间（单位：ticks）
var weakness = 0.5;  // 弱点造成的伤害增加百分比

var totalWaves = 2;  // 固定总波数为2波
var gameEnded = false;  // 游戏是否结束的标志

var monsterSpeedMultiplier = 1;  // 怪物的速度倍率，默认1倍速度

// 创建Tooltip对象
let tooltip;  // 创建一个提示工具对象


// Misc functions

// Spawn a group of monsters, alternating if multiple types
function addGroup(group) {
    var count = group.pop();
    for (var i = 0; i < count; i++) {
        for (var j = 0; j < group.length; j++) {
            newMonsters.push(group[j]);
        }
    }
}

// Prepare a wave
function addWave(pattern) {
    spawnCool = pattern.shift();
    for (var i = 0; i < pattern.length; i++) {
        addGroup(pattern[i]);
    }
}

// 购买并放置防御塔（当玩家资金充足时）
function buy(t) {                          // 定义购买函数，接收防御塔配置对象t作为参数
    if (cash >= t.cost) {                  // 校验玩家当前资金是否足够购买该防御塔
        cash -= t.cost;                    // 扣除购买消耗的金额
        toPlace = false;                   // 关闭防御塔放置状态指示器
        selected = t;                      // 将当前选中对象设为该防御塔
        if (grid[t.gridPos.x][t.gridPos.y] === 0)  // 检查目标网格单元是否为空置状态
            toPathfind = true;              // 触发路径重新计算标志（地形变更需更新敌人路径）
        updateInfo(t);                     // 更新界面显示的防御塔信息
        newTowers.push(t);                 // 将新防御塔加入管理队列
    }
}

function canPlace(col, row) {
    if (!toPlace) return false;
    // 检查 grid 是否存在以及索引是否在有效范围内
    if (!grid || !grid[col] || typeof grid[col][row] === 'undefined') {
        return false;
    }
    return grid[col][row] === 3;
}

// Check if spawn cooldown is done and monsters are available to spawn
function canSpawn() {
    return newMonsters.length > 0 && scd === 0;
}

// Clear tower information
function clearInfo() {
    document.getElementById('info-div').style.display = 'none';
}


// Check if all conditions for showing a range are true
function doRange() {
    return mouseInMap() && toPlace && typeof towerType !== 'undefined';
}

// Check if tile is empty
function empty(col, row) {
    // Check if not walkable
    if (!walkable(col, row)) return false;

    // Check if spawnpoint
    for (var i = 0; i < spawnpoints.length; i++) {
        var s = spawnpoints[i];
        if (s.x === col && s.y === row) return false;
    }

    // Check if exit
    if (typeof exit !== 'undefined') {
        if (exit.x === col && exit.y === row) return false;
    }

    return true;
}


// Find tower at specific tile, otherwise return null
function getTower(col, row) {
    for (var i = 0; i < towers.length; i++) {
        var t = towers[i];
        if (t.gridPos.x === col && t.gridPos.y === row) return t;
    }
    return null;
}

// Return map of visitability
function getVisitMap(walkMap) {
    var frontier = [];
    var target = vts(exit);
    frontier.push(target);
    var visited = {};
    visited[target] = true;

    // Fill visited for every tile
    while (frontier.length !== 0) {
        var current = frontier.shift();
        var t = stv(current);
        var adj = neighbors(walkMap, t.x, t.y, true);

        for (var i = 0; i < adj.length; i++) {
            var next = adj[i];
            if (!(next in visited)) {
                frontier.push(next);
                visited[next] = true;
            }
        }
    }

    return visited;
}

// Return walkability map
function getWalkMap() {
    var walkMap = [];
    for (var x = 0; x < cols; x++) {
        walkMap[x] = [];
        for (var y = 0; y < rows; y++) {
            walkMap[x][y] = walkable(x, y);
        }
    }
    return walkMap;
}

// Load a map from a map string
function importMap(str) {
    try {
        custom = JSON.parse(LZString.decompressFromBase64(str));
        document.getElementById('custom').selected = true;
        resetGame();
    } catch (err) {
    }
}

// Check if wave is at least min and less than max
function isWave(min, max) {
    if (typeof max === 'undefined') return wave >= min;
    return wave >= min && wave < max;
}

// Load map from template
// Always have an exit and spawnpoints if you do not have a premade grid
function loadMap() {
    // 优先使用隐藏的 #map（初始选关时由 start 按钮设置），否则退回到 #initial-map
    var mapElement = document.getElementById('map') || document.getElementById('initial-map');

// 获取地图名称
    var name = mapElement.value;

// 初始化玩家生命值
    health = 40;

// 初始化玩家金钱
    cash = 10000;

// 获取地图数据
    var m = maps[name];

// 复制地图显示层数据
    display = copyArray(m.display);

// 复制地图方向数据
    displayDir = copyArray(m.displayDir);

// 复制地图网格数据
    grid = copyArray(m.grid);

// 复制地图元数据
    metadata = copyArray(m.metadata);

// 设置出口位置
    exit = createVector(m.exit[0], m.exit[1]);

// 初始化出生点数组
    spawnpoints = [];

// 复制出生点数据
    for (var i = 0; i < m.spawnpoints.length; i++) {
        var s = m.spawnpoints[i];
        spawnpoints.push(createVector(s[0], s[1]));
    }

// 设置地图背景颜色
    bg = m.bg;

// 设置地图列数
    cols = m.cols;

// 设置地图行数
    rows = m.rows;

// 调整画布适应窗口
//     resizeFit();

// 初始化临时出生点数组
    tempSpawns = [];

}


// Increment wave counter and prepare wave
function nextWave() {
    isStartGame = false;
// 根据游戏模式添加敌人波次（随机生成或使用自定义配置）
    addWave(randomWaves ? randomWave() : customWave());
// 条件运算符决定波次生成策略：当randomWaves为true时调用随机生成函数，否则调用自定义配置函数
    wave++;
}

// Check if no more monsters
function noMoreMonster() {
    return monsters.length === 0 && newMonsters.length === 0;
}

function outsideMap(e) {
    return outsideRect(e.pos.x, e.pos.y, 0, 0, width, height);
}

// Toggle pause state
function pause() {
    paused = !paused;
}


// Generate a random wave
// 数组格式：[怪兽出现间隔，[怪物类型，怪物数量],[怪物类型，怪物数量]...]
// 这里原本逻辑有问题，目前只支持push单个数组，如果连续push多个数组，后面的怪物数组不会生效
function randomWave() {
    var waves = [];


    if (mapData == maps["customMap"]) {
        if (isWave(0, 1)) {
            waves.push([100, ['Bandit', 'BatteringRam', 1]]);
        }
        if (isWave(1, 2)) {
            waves.push([80, ['BatteringRam', 4]]);
        }
        if (isWave(2, 3)) {
            waves.push([80, ['Bandit', 4]]);
        }
        if (isWave(3, 6)) {
            waves.push([100, ['Bandit', 'BatteringRam', 8]]);
        }

    }
    if (mapData == maps["map2"]) {

        if (isWave(0, 1)) {
            waves.push([100, ['PirateRaider', 2]]);
        }
        if (isWave(1, 2)) {
            waves.push([100, ['Mouse', 'PirateRaider', 10]]);
            // waves.push([80, ['BatteringRam', 4]]);
        }


    }

    if (mapData == maps["map3"]) {

        if (isWave(0, 1)) {
            waves.push([100, ['AIMech', 5]]);
        }
        if (isWave(1, 2)) {
            waves.push([100, ['DroneSwarm', 'AIMech', 10]]);
            // waves.push([80, ['BatteringRam', 4]]);
        }


    }


    // if (isWave(0, 3)) {
    //     waves.push([120, ['BatteringRam',100]]);
    // }
    // if (isWave(3, 4)) {
    //     waves.push([100, ['BatteringRam', 100]]);
    // }
    // if (isWave(2, 7)) {
    //     waves.push([30, ['weak', 25], ['strong', 25]]);
    //     waves.push([20, ['strong', 25]]);
    // }
    // if (isWave(3, 7)) {
    //     waves.push([40, ['fast', 25]]);
    // }
    // if (isWave(4, 14)) {
    //     waves.push([20, ['fast', 50]]);
    // }
    // if (isWave(5, 6)) {
    //     waves.push([20, ['strong', 50], ['fast', 25]]);
    // }
    // if (isWave(8, 12)) {
    //     waves.push([20, ['medic', 'strong', 'strong', 25]]);
    // }
    // if (isWave(10, 13)) {
    //     waves.push([20, ['medic', 'strong', 'strong', 50]]);
    //     waves.push([30, ['medic', 'strong', 'strong', 50], ['fast', 50]]);
    //     waves.push([5, ['fast', 50]]);
    // }
    // if (isWave(12, 16)) {
    //     waves.push([20, ['medic', 'strong', 'strong', 50], ['strongFast', 50]]);
    //     waves.push([10, ['strong', 50], ['strongFast', 50]]);
    //     waves.push([10, ['medic', 'strongFast', 50]]);
    //     waves.push([10, ['strong', 25], ['stronger', 25], ['strongFast', 50]]);
    //     waves.push([10, ['strong', 25], ['medic', 25], ['strongFast', 50]]);
    //     waves.push([20, ['medic', 'stronger', 'stronger', 50]]);
    //     waves.push([10, ['medic', 'stronger', 'strong', 50]]);
    //     waves.push([10, ['medic', 'strong', 50], ['medic', 'strongFast', 50]]);
    //     waves.push([5, ['strongFast', 100]]);
    //     waves.push([20, ['stronger', 50]]);
    // }
    // if (isWave(13, 20)) {
    //     waves.push([40, ['tank', 'stronger', 'stronger', 'stronger', 10]]);
    //     waves.push([10, ['medic', 'stronger', 'stronger', 50]]);
    //     waves.push([40, ['tank', 25]]);
    //     waves.push([20, ['tank', 'stronger', 'stronger', 50]]);
    //     waves.push([20, ['tank', 'medic', 50], ['strongFast', 25]]);
    // }
    // if (isWave(14, 20)) {
    //     waves.push([20, ['tank', 'stronger', 'stronger', 50]]);
    //     waves.push([20, ['tank', 'medic', 'medic', 50]]);
    //     waves.push([20, ['tank', 'medic', 50], ['strongFast', 25]]);
    //     waves.push([10, ['tank', 50], ['strongFast', 25]]);
    //     waves.push([10, ['faster', 50]]);
    //     waves.push([20, ['tank', 50], ['faster', 25]]);
    // }
    // if (isWave(17, 25)) {
    //     waves.push([20, ['taunt', 'stronger', 'stronger', 'stronger', 25]]);
    //     waves.push([20, ['spawner', 'stronger', 'stronger', 'stronger', 25]]);
    //     waves.push([20, ['taunt', 'tank', 'tank', 'tank', 25]]);
    //     waves.push([40, ['taunt', 'tank', 'tank', 'tank', 25]]);
    // }
    // if (isWave(19)) {
    //     waves.push([20, ['spawner', 1], ['tank', 20], ['stronger', 25]]);
    //     waves.push([20, ['spawner', 1], ['faster', 25]]);
    // }
    // if (isWave(23)) {
    //     waves.push([20, ['taunt', 'medic', 'tank', 25]]);
    //     waves.push([20, ['spawner', 2], ['taunt', 'medic', 'tank', 25]]);
    //     waves.push([10, ['spawner', 1], ['faster', 100]]);
    //     waves.push([5, ['faster', 100]]);
    //     waves.push([
    //         20, ['tank', 100], ['faster', 50],
    //         ['taunt', 'tank', 'tank', 'tank', 50]
    //     ]);
    //     waves.push([
    //         10, ['taunt', 'stronger', 'tank', 'stronger', 50],
    //         ['faster', 50]
    //     ]);
    // }
    // if (isWave(25)) {
    //     waves.push([5, ['taunt', 'medic', 'tank', 50], ['faster', 50]]);
    //     waves.push([5, ['taunt', 'faster', 'faster', 'faster', 50]]);
    //     waves.push([
    //         10, ['taunt', 'tank', 'tank', 'tank', 50],
    //         ['faster', 50]
    //     ]);
    // }
    // if (isWave(30)) {
    //     waves.push([5, ['taunt', 'faster', 'faster', 'faster', 50]]);
    //     waves.push([5, ['taunt', 'tank', 'tank', 'tank', 50]]);
    //     waves.push([5, ['taunt', 'medic', 'tank', 'tank', 50]]);
    //     waves.push([1, ['faster', 200]]);
    // }
    // if (isWave(35)) {
    //     waves.push([0, ['taunt', 'faster', 200]]);
    // }

    return random(waves);
}


function resetGame() {
    loadMap();
    // 清空所有实体
    monsters = [];
    projectiles = [];
    systems = [];
    towers = [];
    newMonsters = [];
    newProjectiles = [];
    newTowers = [];

    // 这里可以获取一次全局路径
    window._globalPath = findPathBFS(grid);
    console.log('全局路径 = ', window._globalPath);
    // 重置状态
    health = 40;
    maxHealth = health;
    wave = 0;          // 重置波数
    gameEnded = false; // 重置游戏结束标记
    // 重置各项标志
    paused = true;
    scd = 0;
    toCooldown = false;
    toPathfind = false;
    toPlace = false;
    // 启动第一波（此时 nextWave() 会使 wave 变为 1）
    nextWave();

    tooltip = new Tooltip("Here comes the " + wave + " wave of enemies!", cols * ts / 2, rows * ts / 2);
}

// Changes tile size to fit everything onscreen
//自适应屏幕
function resizeFit() {
    var div = document.getElementById('main-holder');
    var ts1 = floor(div.offsetWidth / cols);
    var ts2 = floor(div.offsetHeight / rows);
    ts = Math.min(ts1, ts2);
    resizeCanvas(cols * ts, rows * ts, true);

    cellWidth = width / mapData.cols;  // 每个网格的宽度
    cellHeight = height / mapData.rows;  // 每个网格的高度


}


// Resizes cols, rows, and canvas based on tile size
function resizeMax() {
    var div = document.getElementById('main-holder');
    cols = 12
    rows = 8;
    resizeCanvas(cols * 110, rows * 110, true);


    var div = document.getElementById('main-holder');
    cols = floor(div.offsetWidth / ts);
    rows = floor(div.offsetHeight / ts);
    resizeCanvas(cols * ts, rows * ts, true);
}

// Sell a tower
function sell(t) {
    selected = null;
    if (grid[t.gridPos.x][t.gridPos.y] === 0) toPathfind = true;
    clearInfo();
    cash += t.sellPrice();
    t.kill();
}

// Set a tower to place
function setPlace(t) {
    towerType = t;
    toPlace = true;
    updateInfo(createTower(0, 0, tower[towerType]));
}

// Visualize range of tower
function showRange(t, cx, cy) {
    stroke(255);
    fill(t.color[0], t.color[1], t.color[2], 63);
    var r = (t.range + 0.5) * ts * 2;
    ellipse(cx, cy, r, r);
}

// Display tower information
function updateInfo(t) {
    var name = document.getElementById('name');
    name.innerHTML = '<span style="color:rgb(' + t.color + ')">' + t.title +
        '</span>';
    document.getElementById('cost').innerHTML = 'Cost: $' + t.totalCost;
    document.getElementById('sellPrice').innerHTML = 'Sell price: $' +
        t.sellPrice();
    document.getElementById('upPrice').innerHTML = 'Upgrade price: ' +
        (t.upgrades.length > 0 ? '$' + t.upgrades[0].cost : 'N/A');
    document.getElementById('damage').innerHTML = 'Damage: ' + t.getDamage();
    document.getElementById('type').innerHTML = 'Type: ' +
        t.type.toUpperCase();
    document.getElementById('range').innerHTML = 'Range: ' + t.range;
    document.getElementById('cooldown').innerHTML = 'Avg. Cooldown: ' +
        t.getCooldown().toFixed(2) + 's';
    var buttons = document.getElementById('info-buttons');
    buttons.style.display = toPlace ? 'none' : 'flex';
    document.getElementById('info-div').style.display = 'block';
}

// Update pause button
function updatePause() {
    document.getElementById('pause').innerHTML = paused ? 'Start' : 'Pause';
}

// Update game status display with wave, health, and cash
function updateStatus() {
    // 如果当前波数超过总波数，则显示总波数（例如在最后一波中显示“2/2”）
    var displayWave = wave > totalWaves ? totalWaves : wave;
    document.getElementById('wave').innerHTML = '波数: ' + displayWave + '/' + totalWaves;
    document.getElementById('health').innerHTML = 'Health: ' + health + '/' + maxHealth;
    document.getElementById('cash').innerHTML = '$' + cash;
}

// Upgrade tower
function upgrade(t) {      // 定义升级函数，接收升级配置对象t作为参数
    if (cash >= t.cost) {    // 校验当前资金是否满足升级所需费用
        cash -= t.cost;      // 扣除升级消耗的资金
        selected.upgrade(t); // 执行目标对象的升级逻辑
        selected.upgrades = t.upgrades ? t.upgrades : [];  // 更新可用升级项列表（存在则继承，否则重置为空）
        updateInfo(selected); // 刷新界面显示最新信息
    }
}

// Return whether tile is walkable
function walkable(col, row) {
    // Check if wall or tower-only tile
    if (grid[col][row] === 1 || grid[col][row] === 3) return false;
    // Check if tower
    if (getTower(col, row)) return false;
    return true;
}


// Main p5 functions
function draw() {
    if (!grid) {
        background(0);
        return;
    }
    background(0);
    // 绘制背景图（覆盖整个画布）
    // image(bgImg, 0, 0, width, height);

    for (let col = 0; col < mapData.cols; col++) {
        for (let row = 0; row < mapData.rows; row++) {
            let value = mapData.grid[col][row];
            let alpha = 200;
            // 根据值设置不同颜色
            let colors = {
                0: color(255, 0, 0, alpha),   // 红色：起点
                1: color(200, 200, 0, alpha), // 黄色：路径
                3: color(0, 255, 0, alpha),   // 绿色：可放塔
                2: color(100, alpha),         // 灰色：不可放塔
                4: color(0, 0, 255, alpha)    // 蓝色：终点
            };

            fill(colors[value] || color(255));
            stroke(0);
            rect(col * ts, row * ts, ts, ts);

        }
    }


    // Update game status
    updatePause();
    // updateStatus();

    // Update spawn and wave cooldown
    if (!paused) {
        if (scd > 0) scd--;
        if (wcd > 0 && toWait) wcd--;
    }
    //绘制出入口
    // Draw spawnpoints
    // for (var i = 0; i < spawnpoints.length; i++) {
    //     stroke(255);
    //     fill(0, 230, 64);
    //     var s = spawnpoints[i];
    //     rect(s.x * ts, s.y * ts, ts, ts);
    // }

    // Draw exit
    // stroke(255);
    // fill(207, 0, 15);
    // rect(exit.x * ts, exit.y * ts, ts, ts);
    //
    // // 绘制出生点
    // for (var i = 0; i < spawnpoints.length; i++) {
    //     stroke(255); // 设置描边颜色为白色
    //     fill(0, 230, 64); // 设置填充颜色为绿色
    //     var s = spawnpoints[i]; // 获取当前出生点
    //     rect(s.x * ts, s.y * ts, ts, ts); // 绘制出生点矩形
    // }

// 绘制出口
//     stroke(255); // 设置描边颜色为白色
    // fill(207, 0, 15); // 设置填充颜色为红色
    // rect(exit.x * ts, exit.y * ts, ts, ts); // 绘制出口矩形

// 绘制临时出生点
//     for (var i = 0; i < tempSpawns.length; i++) {
//         stroke(255); // 设置描边颜色为白色
//         fill(155, 32, 141); // 设置填充颜色为紫色
    // var s = tempSpawns[i][0]; // 获取当前临时出生点
    // rect(s.x * ts, s.y * ts, ts, ts); // 绘制临时出生点矩形
    // }

// 生成怪物
    if (canSpawn() && !paused) { // 如果可以生成怪物且游戏未暂停
        var name = newMonsters.shift(); // 取出新怪物的名称

        // 在所有出生点生成相同的怪物
        for (var i = 0; i < spawnpoints.length; i++) {
            var s = spawnpoints[i]; // 获取当前出生点
            var c = center(s.x, s.y); // 计算出生点的中心坐标
            monsters.push(createMonster(c.x, c.y, monster[name])); // 创建并添加怪物
        }

        // 处理临时出生点
        for (var i = 0; i < tempSpawns.length; i++) {
            var s = tempSpawns[i]; // 获取当前临时出生点
            if (s[1] === 0) continue; // 如果计数为 0，则跳过
            s[1]--; // 递减计数
            var c = center(s[0].x, s[0].y); // 计算临时出生点的中心坐标
            monsters.push(createMonster(c.x, c.y, monster[name])); // 创建并添加怪物
        }

        // 触发冷却状态，防止立即再次生成怪物
        toCooldown = true;
    }


    // 更新并绘制怪物
    for (let i = monsters.length - 1; i >= 0; i--) {
        let e = monsters[i];

        // 更新方向和位置
        if (!paused) {
            e.move();  // 移动怪物
            // 选择目标并更新塔的冷却时间

            e.target(towers);  // 塔攻击目标


            e.update();  // 更新怪物状态
            e.onTick();  // 每帧更新怪物的逻辑
        }

        // 如果怪物超出地图范围，击杀怪物
        if (outsideMap(e)) e.kill();

        // 如果怪物到达出口格子，击杀并减少玩家生命
        if (atTileCenter(e.pos.x, e.pos.y, exit.x, exit.y)) e.quit();

        // 绘制怪物
        e.draw();

        // 如果怪物死亡，从怪物数组中移除
        if (e.ifDie()) monsters.splice(i, 1);
    }

// 绘制怪物的血条
    for (var i = 0; i < monsters.length; i++) {
        monsters[i].showHealth();  // 显示每个怪物的血条
    }

// 更新并绘制塔
    for (let i = 0; i < towers.length; i++) {
        let t = towers[i];

        // 选择目标并更新塔的冷却时间
        if (!paused) {
            t.target(monsters);  // 塔攻击目标
            t.update();  // 更新塔的状态
        }

        // 如果塔超出地图范围，摧毁塔
        if (outsideMap(t)) t.kill();

        // 绘制塔
        t.draw();

        // 如果塔死亡，从塔数组中移除
        if (t.isDead()) towers.splice(i, 1);
    }

// 更新并绘制粒子系统
    for (let i = systems.length - 1; i >= 0; i--) {
        let ps = systems[i];
        ps.run();  // 执行粒子系统
        if (ps.isDead()) systems.splice(i, 1);  // 如果粒子系统已死，从系统数组中移除
    }

// 更新并绘制子弹
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];

        // 如果未暂停，更新子弹
        if (!paused) {
            p.steer();  // 控制子弹的运动
            p.update();  // 更新子弹的位置
        }

        // 如果子弹到达目标，爆炸
        if (p.reachedTarget()) p.explode();

        // 如果子弹超出地图范围，摧毁子弹
        if (outsideMap(p)) p.kill();

        // 绘制子弹
        p.draw();

        // 如果子弹死亡，从子弹数组中移除
        if (p.isDead()) projectiles.splice(i, 1);
    }

// 绘制塔的射程范围
    if (doRange()) {
        var p = gridPos(mouseX, mouseY);  // 获取鼠标位置对应的网格位置
        var c = center(p.x, p.y);  // 计算塔的中心位置
        var t = createTower(0, 0, tower[towerType]);  // 创建一个塔
        showRange(t, c.x, c.y);  // 显示塔的射程

        // 如果塔无法放置，绘制红色的 X
        if (!canPlace(p.x, p.y)) {
            push();
            translate(c.x, c.y);  // 平移到塔的中心位置
            rotate(PI / 4);  // 旋转 45 度

            // 绘制红色的 X
            noStroke();
            fill(207, 0, 15);  // 设置颜色为红色
            var edge = 0.1 * ts;  // 边缘的大小
            var len = 0.9 * ts / 2;  // 线段的长度
            rect(-edge, len, edge * 2, -len * 2);  // 绘制 X 的一部分
            rotate(PI / 2);  // 旋转 90 度
            rect(-edge, len, edge * 2, -len * 2);  // 绘制 X 的另一部分

            pop();
        }
    }

// 移除临时生成的怪物
    removeTempSpawns();

// 将新生成的子弹和塔加入到原数组中
    projectiles = projectiles.concat(newProjectiles);  // 添加新子弹
    towers = towers.concat(newTowers);  // 添加新塔
    newProjectiles = [];  // 清空新子弹数组
    newTowers = [];  // 清空新塔数组

// 如果玩家死亡，重置游戏
    if (health <= 0) resetGame();

// 检测并等待下一波
    if ((toWait && wcd === 0) || (skipToNext && newMonsters.length === 0)) {
        if (wave < totalWaves) {
            toWait = false;
            wcd = 0;
            nextWave();  // 开始下一波
            paused = true;  // 暂停游戏
            tooltip = new Tooltip("Here comes the " + wave + " wave of enemies!", width / 2, height / 2);  // 显示提示框
        } else {
            // 如果已经是最后一波，结束游戏并跳转到选关界面
            endLevel();
        }
    }

// 等待下一波
    if (noMoreMonster() && !toWait) {
        wcd = waveCool;  // 重置波次冷却时间
        toWait = true;  // 设置等待下一波
    }

// 重置生成怪物的冷却时间
    if (toCooldown) {
        scd = spawnCool;  // 重置生成冷却时间
        toCooldown = false;  // 设置冷却完成
    }


    //绘制最上层界面
    image(moneyBarImg, cellWidth, cellHeight / 2, cellWidth * 2, cellWidth * (moneyBarImg.height / moneyBarImg.width) * 1.8);

    noStroke();
    fill(0, 255);
    textSize(cellWidth / 5);
    textAlign(LEFT, BASELINE);
    text(cash, cellWidth * 1.8, cellWidth * 0.85);
    image(healthBarImg, cellWidth * 4, cellHeight / 2, cellWidth * 2, cellWidth * (moneyBarImg.height / moneyBarImg.width) * 1.8);

    text(health + '/' + maxHealth, cellWidth * 4 * 1.2, cellHeight / 2 * 1.7);

    image(monsterBarImg, cellWidth * 6.5, cellHeight / 2 * 0.8, cellWidth * 2.5, cellWidth * (moneyBarImg.height / moneyBarImg.width) * 2.5);

    var displayWave = wave > totalWaves ? totalWaves : wave;
    text(displayWave + '/' + totalWaves, cellWidth * 7.8, cellHeight / 2 * 1.65);


    tooltip.update();  // 更新提示状态
    tooltip.display();  // 显示提示文本


    if (tooltip.isVisible == false) {
        if (isStartGame == false) {
            isStartGame = true;
            paused = false;
        }

    }

    //底座敌人生物显示

    let x = 5; // 初始 x 坐标
    let y = height - cellHeight; // 初始 y 坐标
    let itemWidth = cellHeight * 2; // 每个怪物项的间隔宽度

    for (let key in monster) {


        if (monster.hasOwnProperty(key)) {
            fill(0);
            rect(x + cellHeight * 0.3, y + cellHeight / 2 * 0.3, cellHeight * 1.5, cellHeight / 2, cellHeight);
            // 绘制怪物图像或颜色圆点
            if (monster[key].image) {
                // 如果有图像，加载并绘制图像

                image(monster[key].image, x, y, cellHeight, cellHeight); // 绘制图像
            }
            textAlign(CENTER, CENTER);
            // 绘制怪物名称
            fill(255); // 设置文本颜色为黑色
            textSize(16); // 设置文本大小
            text(key, x + cellHeight * 1.2, y + cellHeight / 2); // 绘制文本

            x += itemWidth; // 更新 y 坐标以绘制下一个怪物项
        }
    }


    //调试模式
    if (debugMap) {
        for (let col = 0; col < mapData.cols; col++) {
            for (let row = 0; row < mapData.rows; row++) {
                let value = mapData.grid[col][row];
                let alpha = 200;
                // 根据值设置不同颜色
                let colors = {
                    0: color(255, 0, 0, alpha),   // 红色：起点
                    1: color(200, 200, 0, alpha), // 黄色：路径
                    3: color(0, 255, 0, alpha),   // 绿色：可放塔
                    2: color(100, alpha),         // 灰色：不可放塔
                    4: color(0, 0, 255, alpha)    // 蓝色：终点
                };

                fill(colors[value] || color(255));
                stroke(0);
                rect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
                // rect(col * 110, row * 110, 110, 110);
            }
        }
    }

}


// User input

function keyPressed() {
    switch (keyCode) {
        case 27:
            // Esc
            toPlace = false;
            clearInfo();
            break;
        case 32:
            // Space
            pause();
            break;
        case 49:
            // 1
            setPlace('gun');
            break;
        case 50:
            // 2
            setPlace('laser');
            break;
        case 51:
            // 3
            setPlace('slow');
            break;
        case 52:
            // 4
            setPlace('sniper');
            break;
        case 53:
            // 5
            setPlace('rocket');
            break;
        case 54:
            // 6
            setPlace('bomb');
            break;
        case 55:
            // 7
            setPlace('tesla');
            break;
        case 77:
            // M
            importMap(prompt('Input map string:'));
            break;
        case 82:
            // R
            resetGame();
            break;
        case 83:
            // S
            if (selected) sell(selected);
            break;
        case 85:
            // U
            if (selected && selected.upgrades.length > 0) {
                upgrade(selected.upgrades[0]);
            }
            break;
        case 87:
            // W
            skipToNext = !skipToNext;
            break;
        case 90:
            // Z
            ts = zoomDefault;
            resizeMax();
            resetGame();
            break;
        case 219:
            // Left bracket
            if (ts > 16) {
                ts -= tileZoom;
                resizeMax();
                resetGame();
            }
            break;
        case 221:
            // Right bracket
            if (ts < 40) {
                ts += tileZoom;
                resizeMax();
                resetGame();
            }
            break;
    }
}

function mousePressed() {
    if (!mouseInMap()) return;
    var p = gridPos(mouseX, mouseY);
    var t = getTower(p.x, p.y);

    if (t) {
        // Clicked on tower
        selected = t;
        toPlace = false;
        updateInfo(selected);
    } else if (canPlace(p.x, p.y)) {
        buy(createTower(p.x, p.y, tower[towerType]));
    }


    if (mouseButton === RIGHT) {
        debugMap = !debugMap;
    }
}


function endLevel() {
    if (!gameEnded) {
        gameEnded = true;
        paused = true;
        // 根据最终 health 更新当前关卡的星级
        var levelId = document.getElementById("map").value;
        var newRating = calculateRating(health, maxHealth);
        var storedRating = parseInt(localStorage.getItem("rating_" + levelId)) || 0;
        if (newRating > storedRating) {
            localStorage.setItem("rating_" + levelId, newRating);
        }
        // 延时0.5秒后显示选关界面
        setTimeout(function () {
            // 清空游戏中的实体（根据需要可进一步清空）
            wave = 1;
            monsters = [];
            projectiles = [];
            systems = [];
            towers = [];
            newMonsters = [];
            newProjectiles = [];
            newTowers = [];
            // 显示选关覆盖层，并重新生成关卡卡片（星级会更新）
            document.getElementById("level-selection").style.display = "flex";
            createLevelCards();
        }, 500); // 延时0.5秒
    }
}

// 根据剩余血量（health）与最大血量（maxHealth）计算星级（0~3 星）
function calculateRating(health, maxHealth) {
    if (health >= maxHealth * 0.85) return 3;
    else if (health >= maxHealth * 0.5) return 2;
    else if (health > 0) return 1;
    else return 0;
}

// 在关卡结束时调用，更新当前关卡的星级记录
function updateLevelRating(levelId, health, maxHealth) {
    var newRating = calculateRating(health, maxHealth);
    var storedRating = parseInt(localStorage.getItem("rating_" + levelId)) || 0;
    if (newRating > storedRating) {
        localStorage.setItem("rating_" + levelId, newRating);
    }
}


function updateMonsterPanel() {
    var monsterList = document.getElementById("monster-list");
    if (!monsterList) return;  // 如果页面中没有该元素，则退出
    monsterList.innerHTML = ""; // 清空原有内容
    // 遍历 global monster 对象中的所有键（每个键对应一种敌人类型）
    for (var key in monster) {
        if (monster.hasOwnProperty(key)) {
            // 创建一个新 div 元素作为敌人项
            var item = document.createElement("div");
            item.className = "monster-item";

            // 创建 img 作为敌人图像
            var monsterImage = document.createElement("img");
            monsterImage.className = "monster-image";

            // 检查是否有贴图
            if (monster[key].image) {
                monsterImage.src = monster[key].image;
            } else {
                // 创建一个显示颜色的小圆点
                var colorCircle = document.createElement("span");
                colorCircle.className = "monster-color";
                var col = monster[key].color;
                // 如果 color 是数组，则转换为 rgb 字符串
                if (Array.isArray(col)) {
                    colorCircle.style.backgroundColor = "rgb(" + col.join(",") + ")";
                } else {
                    colorCircle.style.backgroundColor = col;
                }
                item.appendChild(colorCircle);
            }

            // 创建一个文本节点，显示敌人的名称（key）
            var nameText = document.createTextNode(key);
            // 添加元素
            item.appendChild(monsterImage);
            item.appendChild(nameText);
            monsterList.appendChild(item);
        }
    }
}


class Tooltip {
    constructor(message, x, y) {
        this.message = message;  // 提示信息
        this.x = x;  // 提示位置X坐标
        this.y = y;  // 提示位置Y坐标
        this.alpha = 0;  // 初始透明度为0，表示隐藏
        // this.displayDuration = 3000;  // 提示显示的持续时间（毫秒）
        this.fadeDurationInt = 2000;  // 渐变显示和隐藏的持续时间（毫秒）
        this.fadeDurationOut = 2000;  // 渐变显示和隐藏的持续时间（毫秒）
        this.speed = 20;//显示速度
        this.isVisible = true;  // 是否显示

    }

    // 显示提示


    // 更新提示状态
    update() {
        if (this.fadeDurationInt > 0) {
            this.fadeDurationInt -= this.speed;
            this.alpha = map(this.fadeDurationInt, 2000, 0, 0, 255);
        }


        if (this.fadeDurationInt == 0) {
            if (this.fadeDurationOut > 0) ;
            {
                this.fadeDurationOut -= this.speed;
                this.alpha = map(this.fadeDurationOut, 2000, 0, 255, 0);
            }
        }

        if (this.fadeDurationOut == 0) {


            this.isVisible = false;
        }


    }

    // 显示文本
    display() {
        if (this.isVisible) {
            noStroke();
            fill(255, 0, 0, this.alpha);  // 设置文本颜色和透明度
            textSize(50);
            textAlign(CENTER, CENTER);
            text(this.message, this.x, this.y);  // 显示文本
        }

    }
}

