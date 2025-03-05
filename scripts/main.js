var monsters = [];
var projectiles = [];
var systems = [];
var towers = [];
var newMonsters = [];
var newProjectiles = [];
var newTowers = [];

var cols;
var rows;
var tileZoom = 2;
var ts = 24;            // tile size
var zoomDefault = ts;

var particleAmt = 32;   // number of particles to draw per explosion

var custom;             // custom map JSON
var display;            // graphical display tiles
var displayDir;         // direction display tiles are facing
                        // (0 = none, 1 = left, 2 = up, 3 = right, 4 = down)
var dists = buildArray(12, 8, null);  // 创建一个 12 列，8 行的数组，默认值为 null
                        // distance to exit
var grid;               // tile type
                        // (0 = empty, 1 = wall, 2 = path, 3 = tower,
                        //  4 = monster-only pathing)
var metadata;           // tile metadata
var paths;              // direction to reach exit
var visitMap;           // whether exit can be reached
var walkMap;            // walkability map

var exit;
var spawnpoints = [];
var tempSpawns = [];

var cash;
var health;
var maxHealth;
var wave;

var spawnCool;          // number of ticks between spawning monsters

var bg;                 // background color

var selected;
var towerType;

var sounds;             // dict of all sounds


var paused;             // whether to update or not
var randomWaves = true; // whether to do random or custom waves
var scd;                // number of ticks until next spawn cycle
var skipToNext = false; // whether or not to immediately start next wave
var toCooldown;         // flag to reset spawning cooldown
var toPathfind;         // flag to update monster pathfinding
var toPlace;            // flag to place a tower
var toWait;             // flag to wait before next wave
var wcd;                // number of ticks until next wave

var minDist = 15;       // minimum distance between spawnpoint and exit
var resistance = 0.5;   // percentage of damage blocked by resistance
var sellConst = 0.8;    // ratio of tower cost to sell price
var waveCool = 120;     // number of ticks between waves
var weakness = 0.5;     // damage increase from weakness


var totalWaves = 6;   // 固定总波数为 2 波
var gameEnded = false; // 标记本局游戏是否已经结束

var monsterSpeedMultiplier = 1;  // 默认1倍速度

// 创建Tooltip对象
let tooltip;

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

// Buy and place a tower if player has enough money
function buy(t) {
    if (cash >= t.cost) {
        cash -= t.cost;
        toPlace = false;
        selected = t;
        if (grid[t.gridPos.x][t.gridPos.y] === 0) toPathfind = true;
        updateInfo(t);
        newTowers.push(t);
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
    } catch (err) {}
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
    var name = mapElement.value;
    health = 40;
    cash = 500;

    var m = maps[name];
    // Grids
    display = copyArray(m.display);
    displayDir = copyArray(m.displayDir);
    grid = copyArray(m.grid);
    metadata = copyArray(m.metadata);
    // Important tiles
    exit = createVector(m.exit[0], m.exit[1]);
    spawnpoints = [];
    for (var i = 0; i < m.spawnpoints.length; i++) {
        var s = m.spawnpoints[i];
        spawnpoints.push(createVector(s[0], s[1]));
    }
    // Colors
    bg = m.bg;
    // Misc
    cols = m.cols;
    rows = m.rows;

    resizeFit();

    tempSpawns = [];
}


// Increment wave counter and prepare wave
function nextWave() {
    addWave(randomWaves ? randomWave() : customWave());
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

    if (isWave(0, 1)) {
        waves.push([100, ['plagueRat', 'dockDredger', 1]]);
    }
    if (isWave(1, 2)) {
        waves.push([80, ['dockDredger', 4]]);
    }
    if (isWave(2, 3)) {
        waves.push([80, ['plagueRat', 4]]);
    }
    if (isWave(3, 6)) {
        waves.push([100, ['plagueRat', 'dockDredger', 8]]);
    }

    // if (isWave(0, 3)) {
    //     waves.push([120, ['dockDredger',100]]);
    // }
    // if (isWave(3, 4)) {
    //     waves.push([100, ['dockDredger', 100]]);
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
    tooltip = new Tooltip("Here comes the "+wave+" wave of enemies!", width / 2, height / 2);
}

// Changes tile size to fit everything onscreen
function resizeFit() {
    var div = document.getElementById('main-holder');
    var ts1 = floor(div.offsetWidth / cols);
    var ts2 = floor(div.offsetHeight / rows);
    ts = Math.min(ts1, ts2);
    resizeCanvas(cols * ts, rows * ts, true);
}


// Resizes cols, rows, and canvas based on tile size
function resizeMax() {
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
function upgrade(t) {
    if (cash >= t.cost) {
        cash -= t.cost;
        selected.upgrade(t);
        selected.upgrades = t.upgrades ? t.upgrades : [];
        updateInfo(selected);
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

    // 绘制背景图（覆盖整个画布）
    image(bgImg, 0, 0, width, height);



    // Update game status
    updatePause();
    // updateStatus();

    // Update spawn and wave cooldown
    if (!paused) {
        if (scd > 0) scd--;
        if (wcd > 0 && toWait) wcd--;
    }

    // // Draw spawnpoints
    // for (var i = 0; i < spawnpoints.length; i++) {
    //     stroke(255);
    //     var s = spawnpoints[i];
    //     rect(s.x * ts, s.y * ts, ts, ts);
    // }


    // Draw temporary spawnpoints
    for (var i = 0; i < tempSpawns.length; i++) {
        stroke(255);
        fill(155, 32, 141);
        var s = tempSpawns[i][0];
        rect(s.x * ts, s.y * ts, ts, ts);
    }

    // Spawn monsters
    if (canSpawn() && !paused) {
        // Spawn same monster for each spawnpoint
        var name = newMonsters.shift();
        for (var i = 0; i < spawnpoints.length; i++) {
            var s = spawnpoints[i];
            var c = center(s.x, s.y);
            monsters.push(createMonster(c.x, c.y, monster[name]));
        }

        // Temporary spawnpoints
        for (var i = 0; i < tempSpawns.length; i++) {
            var s = tempSpawns[i];
            if (s[1] === 0) continue;
            s[1]--;
            var c = center(s[0].x, s[0].y);
            monsters.push(createMonster(c.x, c.y, monster[name]));
        }

        // Reset cooldown
        toCooldown = true;
    }

    // Update and draw monsters
    for (let i = monsters.length - 1; i >= 0; i--) {
        let e = monsters[i];

        // Update direction and position
        if (!paused) {
            e.move();
            e.update();
            e.onTick();
        }

        // Kill if outside map
        if (outsideMap(e)) e.kill();

        // If at exit tile, kill and reduce player health
        if (atTileCenter(e.pos.x, e.pos.y, exit.x, exit.y)) e.quit();

        // Draw
        e.draw();

        if (e.ifDie()) monsters.splice(i, 1);
    }

    // Draw health bars
    for (var i = 0; i < monsters.length; i++) {
        monsters[i].showHealth();
    }

    // Update and draw towers
    for (let i = towers.length - 1; i >= 0; i--) {
        let t = towers[i];

        // Target monsters and update cooldowns
        if (!paused) {
            t.target(monsters);
            t.update();
        }

        // Kill if outside map
        if (outsideMap(t)) t.kill();

        // Draw
        t.draw();

        if (t.isDead()) towers.splice(i, 1);
    }

    // Update and draw particle systems
    for (let i = systems.length - 1; i >= 0; i--) {
        let ps = systems[i];
        ps.run();
        if (ps.isDead()) systems.splice(i, 1);
    }

    // Update and draw projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];

        if (!paused) {
            p.steer();
            p.update();
        }

        // Attack target
        if (p.reachedTarget()) p.explode()

        // Kill if outside map
        if (outsideMap(p)) p.kill();

        p.draw();

        if (p.isDead()) projectiles.splice(i, 1);
    }

    // Draw range of tower being placed
    if (doRange()) {
        var p = gridPos(mouseX, mouseY);
        var c = center(p.x, p.y);
        var t = createTower(0, 0, tower[towerType]);
        showRange(t, c.x, c.y);

        // Draw a red X if tower cannot be placed
        if (!canPlace(p.x, p.y)) {
            push();
            translate(c.x, c.y);
            rotate(PI / 4);

            // Draw a red X
            noStroke();
            fill(207, 0, 15);
            var edge = 0.1 * ts;
            var len = 0.9 * ts / 2;
            rect(-edge, len, edge * 2, -len * 2);
            rotate(PI / 2);
            rect(-edge, len, edge * 2, -len * 2);

            pop();
        }
    }

    removeTempSpawns();

    projectiles = projectiles.concat(newProjectiles);
    towers = towers.concat(newTowers);
    newProjectiles = [];
    newTowers = [];

    // If player is dead, reset game
    if (health <= 0) resetGame();

    // Start next wave
    // 检测并等待下一波
    if ((toWait && wcd === 0) || (skipToNext && newMonsters.length === 0)) {
        if (wave < totalWaves) {
            toWait = false;
            wcd = 0;
            nextWave();
        } else {
            // 已经是最后一波，调用 endLevel() 自动跳转到选关界面
            endLevel();
        }
    }

    // Wait for next wave
    if (noMoreMonster() && !toWait) {
        wcd = waveCool;
        toWait = true;
    }

    // Reset spawn cooldown
    if (toCooldown) {
        scd = spawnCool;
        toCooldown = false;
    }
    //绘制最上层界面

    image(moneyBarImg,100,50);
    // var displayWave = wave > totalWaves ? totalWaves : wave;
    // document.getElementById('wave').innerHTML = 'Wave: ' + displayWave + '/' + totalWaves;
    // document.getElementById('health').innerHTML = 'Health: ' + health + '/' + maxHealth;
    // document.getElementById('cash').innerHTML = '$' + cash;
    // var displayWave = wave > totalWaves ? totalWaves : wave;
    // document.getElementById('wave').innerHTML = 'Wave: ' + displayWave + '/' + totalWaves;
    noStroke();
    fill(0,255);
    textSize(25);
    textAlign(LEFT,BASELINE);
    text(cash,210,96);

    image(healthBarImg,400,56);
    text( health + '/' + maxHealth,500,96);

    image(monsterBarImg,680,38);
    var displayWave = wave > totalWaves ? totalWaves : wave;
    text(  displayWave + '/' + totalWaves ,850,96);


    tooltip.update();  // 更新提示状态
    tooltip.display();  // 显示提示文本

    if(tooltip.isVisible==false){
        paused = false;
    }


    let x = width-400; // 初始 x 坐标
    let y = height-100; // 初始 y 坐标
    let itemWidth = 160; // 每个怪物项的间隔宽度

    for (let key in monster) {
        if (monster.hasOwnProperty(key)) {
            fill(0);
            rect(x,y,160,50,30);
            console.log(monster)
            // 绘制怪物图像或颜色圆点
            if (monster[key].image) {
                // 如果有图像，加载并绘制图像
                    image(monster[key].image, x, y, 40, 40); // 绘制图像
            } else {
                // 如果没有图像，绘制颜色圆点
                let col = monster[key].color;
                if (Array.isArray(col)) {
                    fill(col[0], col[1], col[2]); // 设置填充颜色
                } else {
                    fill(col); // 设置填充颜色
                }
                ellipse(x + 25, y + 25, 30, 30); // 绘制圆点
            }
            textAlign(LEFT,BASELINE);
            // 绘制怪物名称
            fill(255); // 设置文本颜色为黑色
            textSize(16); // 设置文本大小
            text(key, x + 50, y + 30); // 绘制文本

            x += itemWidth; // 更新 y 坐标以绘制下一个怪物项
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
        setTimeout(function() {
            // 清空游戏中的实体（根据需要可进一步清空）
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
        if(this.fadeDurationInt>0){
            this.fadeDurationInt-=  this.speed;
            this.alpha = map(this.fadeDurationInt,2000,0,0,255);
        }



        if(this.fadeDurationInt==0){
            if(this.fadeDurationOut>0);{
                this.fadeDurationOut-=  this.speed;
                this.alpha = map(this.fadeDurationOut,2000,0,255,0);
            }
        }

        if(this.fadeDurationOut==0) {


            this.isVisible =false;
        }




    }

    // 显示文本
    display() {
            if(this.isVisible) {
                noStroke();
                fill(255, 0, 0, this.alpha);  // 设置文本颜色和透明度
                textSize(50);
                textAlign(CENTER, CENTER);
                text(this.message, this.x, this.y);  // 显示文本
            }

    }
}

