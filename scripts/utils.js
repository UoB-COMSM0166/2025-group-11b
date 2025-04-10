new p5();

function atTileCenter(x, y, col, row) {
    const c = center(col, row);
    const t = ts / 24;
    return between(x, c.x - t, c.x + t) && between(y, c.y - t, c.y + t);
}

function between(num, min, max) {
    return num >= Math.min(min, max) && num <= Math.max(min, max);
}

function buildArray(cols, rows, val) {
    return Array(cols).fill().map(() => Array(rows).fill(val));
}

function center(col, row) {
    return createVector(col * ts + ts / 2, row * ts + ts / 2);
}

function copyArray(arr) {
    return arr.map(row => [...row]);
}

function cts(col, row) {
    return `${col},${row}`;
}

function getByName(entities, names) {
    const nameList = Array.isArray(names) ? names : [names];
    return entities.filter(e => nameList.includes(e.name));
}

function getFirst(entities) {
    return entities.reduce((a, e) => {
        const p = gridPos(e.pos.x, e.pos.y);
        return dists[p.x][p.y] < dists[a.pos.x][a.pos.y] ? e : a;
    }, entities[0]);
}

function getInRange(cx, cy, radius, entities) {
    return entities.filter(e => dist(e.pos.x, e.pos.y, cx, cy) < radius * ts);
}

function getNearest(entities, pos, ignore = []) {
    return entities.reduce((a, e) => 
        !ignore.includes(e) && pos.dist(e.pos) < pos.dist(a.pos) ? e : a, 
    entities[0]);
}

function getStrongest(entities) {
    return entities.reduce((a, e) => e.health > a.health ? e : a, entities[0]);
}

function getTaunting(entities) {
    return entities.filter(e => e.taunt);
}

function checkRectCollision(rect1, rect2) {
    return abs(rect1.x - rect2.x) < (rect1.width + rect2.width)/2 && 
           abs(rect1.y - rect2.y) < (rect1.height + rect2.height)/2;
}

function gridPos(x, y) {
    return createVector(floor(x / ts), floor(y / ts));
}

function gridPosByLastest(x, y) {
    return createVector(floor((x - gameX) / ts), floor((y - gameY) / ts));
}

// 检查点是否在圆内
function insideCircle(x, y, cx, cy, r) {
    return sq(x - cx) + sq(y - cy) < sq(r);
}

// 检查鼠标是否在地图内
function mouseInMap() {
    const inX = between(mouseX, gameX, gameX + gameWidth);
    const inY = between(mouseY, gameY, gameY + gameHeight);
    const inside = inX && inY;

    return inside;
}
// 返回某个值的正交邻居
function neighbors(grid, col, row, val) {
    var neighbors = [];
    if (col !== 0 && grid[col - 1][row] === val) {
        neighbors.push(cts(col - 1, row));
    }
    if (row !== 0 && grid[col][row - 1] === val) {
        neighbors.push(cts(col, row - 1));
    }
    if (col !== grid.length - 1 && grid[col + 1][row] === val) {
        neighbors.push(cts(col + 1, row));
    }
    if (row !== grid[col].length - 1 && grid[col][row + 1] === val) {
        neighbors.push(cts(col, row + 1));
    }
    return neighbors;
}

// 检查点是否在矩形外
function outsideRect(x, y, cx, cy, w, h) {
    return x < cx || y < cy || x > cx + w || y > cy + h;
}

// 绘制多边形
function polygon(x, y, radius, npoints) {
    var angle = TWO_PI / npoints;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = x + cos(a) * radius;
        var sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

// 返回一个随机整数，参数与 p5.js 的 random() 相同
function randint() {
    return floor(random(...arguments));
}

// 显示数字范围
function rangeText(min, max) {
    if (min === max) {
        return String(min);
    } else {
        return String(min) + '-' + String(max);
    }
}

// 移除空的临时生成点
function removeTempSpawns() {
    for (var i = tempSpawns.length - 1; i >= 0; i--) {
        if (tempSpawns[i][1] === 0) tempSpawns.splice(i, 1);
    }
}

// 将字符串转换为向量
function stv(str) {
    var arr = str.split(',');
    return createVector(parseInt(arr[0]), parseInt(arr[1]));
}

// 将向量转换为字符串
function vts(v) {
    return v.x + ',' + v.y;
}

/**
 * 寻找从格子值 0（开始）到格子值 4（终点）的整条路径。
 * @param {number[][]} grid - 上面 maps.customMap.grid 形式的二维数组
 * @returns {Array<{col:number, row:number}>} 路径坐标列表
 */
function findPathBFS(grid) {
    // 1. 找到起点(0) 和 终点(4)
    let startPos = null;
    let endPos = null;
    for (let c = 0; c < grid.length; c++) {
        for (let r = 0; r < grid[c].length; r++) {
            if (grid[c][r] === 0) {
                startPos = {col: c, row: r};
            } else if (grid[c][r] === 4) {
                endPos = {col: c, row: r};
            }
        }
    }
    if (!startPos || !endPos) {
        console.log('未找到起点或终点');
        return [];
    }

    // 2. BFS 所需队列、标记
    let queue = [];
    let visited = new Set();
    let cameFrom = new Map();
    let distance = {}; // 用来存储每个格子到终点的距离

    // 起点入队
    queue.push(startPos);
    visited.add(posKey(startPos.col, startPos.row));
    distance[posKey(startPos.col, startPos.row)] = 0;  // 起点的距离是 0

    // 3. BFS 主循环
    while (queue.length > 0) {
        let current = queue.shift();
        if (current.col === endPos.col && current.row === endPos.row) {
            // 找到终点 => 回溯得到路径
            return backtrackPath(cameFrom, startPos, endPos);
        }
        // 获取可通行的邻居(值为 1 或 4)
        let nb = getWalkableNeighbors(grid, current.col, current.row);
        for (let nxt of nb) {
            let k = posKey(nxt.col, nxt.row);
            if (!visited.has(k)) {
                visited.add(k);
                cameFrom.set(k, current);
                queue.push(nxt);
                // 更新当前邻居的距离
                distance[k] = distance[posKey(current.col, current.row)] + 1;
            }
        }
    }

    // 没搜到终点，返回空
    return [];
}

/** 返回当前位置上下左右、值为1(路径)或4(终点)的邻居 */
function getWalkableNeighbors(grid, c, r) {
    let results = [];
    // 上
    if (r > 0 && (grid[c][r-1] === 1 || grid[c][r-1] === 4)) {
        results.push({col:c, row:r-1});
    }
    // 下
    if (r < grid[c].length-1 && (grid[c][r+1] === 1 || grid[c][r+1] === 4)) {
        results.push({col:c, row:r+1});
    }
    // 左
    if (c > 0 && (grid[c-1][r] === 1 || grid[c-1][r] === 4)) {
        results.push({col:c-1, row:r});
    }
    // 右
    if (c < grid.length-1 && (grid[c+1][r] === 1 || grid[c+1][r] === 4)) {
        results.push({col:c+1, row:r});
    }
    return results;
}

/** 回溯 cameFrom，构造完整路径 */
function backtrackPath(cameFrom, startPos, endPos) {
    let path = [];
    let current = endPos;
    let startKey = posKey(startPos.col, startPos.row);
    while (true) {
        path.push(current);
        if (posKey(current.col, current.row) === startKey) {
            break;
        }
        current = cameFrom.get(posKey(current.col, current.row));
    }
    path.reverse();
    return path;
}

function posKey(c, r) {
    return c + ',' + r;
}

// 判断点是否在扇形内
function isPointInSector(x, y, centerX, centerY, radius, startAngle, endAngle) {
    let dx = x - centerX;
    let dy = y - centerY;
    let distance = sqrt(dx * dx + dy * dy);
    
    if (distance > radius) return false;
    
    let angle = atan2(dy, dx);
    if (angle < 0) angle += TWO_PI;
    if (startAngle > endAngle) {
      return (angle >= startAngle || angle <= endAngle);
    } else {
      return (angle >= startAngle && angle <= endAngle);
    }
}