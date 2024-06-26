const ALL_CREATURES = ['swooping', 'zouwu', 'puffskein', 'kelpie', 'salamander'];
const SEQUENCE_LENGTH = 3;
const trySwapCreatures = (sourceCoords, targetCoords) => {
    const offsetX = targetCoords.x - sourceCoords.x;
    const offsetY = targetCoords.y - sourceCoords.y;

    const isAdjacentHorizontal = offsetY === 0 && offsetX === -1 || offsetY === 0 && offsetX === 1;
    const isAdjacentVertical = offsetX === 0  && offsetY === -1 || offsetX === 0 && offsetY === 1;
    if(isAdjacentHorizontal || isAdjacentVertical) {
        const match = tryMatch(targetCoords, sourceCoords);
            if(match){
                executeSwap(sourceCoords, targetCoords);
                crushSequence(match, targetCoords, sourceCoords);
            }
    }
};
const tryMatch = (targetCoords, sourceCoords) => {
    const rows = document.getElementsByTagName('tr');
    const sourceBeing = rows[sourceCoords.y].cells[sourceCoords.x].getAttribute("data-being");

    const verticalMonsters = monsterOrderVertical(targetCoords, sourceCoords, rows);
    const horizontalMonsters = monsterOrderHorizontal(targetCoords, sourceCoords, rows);

    let monsterCountVert = 0;
    let monsterCountHor = 0;
    if (verticalMonsters || horizontalMonsters) {
        for (let i = 0; i < verticalMonsters.length +1; i++) {
            if (i == targetCoords.y) {
                monsterCountVert++
            } else if (verticalMonsters[i] == sourceBeing) {
                monsterCountVert++;
            } else if (monsterCountVert >= SEQUENCE_LENGTH) {
                console.log("match vertical", monsterCountVert);
                return verticalMonsters;
            } else if (verticalMonsters[i] !== sourceBeing) {
                monsterCountVert = 0;
            }
        }
        for (let i = 0; i < horizontalMonsters.length +1; i++) {
            if (i == targetCoords.x) {
                monsterCountHor++
            } else if (horizontalMonsters[i] == sourceBeing) {
                monsterCountHor++;
            } else if (monsterCountHor >= SEQUENCE_LENGTH) {
                console.log("match horizontal", monsterCountHor);
                return horizontalMonsters;
            } else if (horizontalMonsters[i] !== sourceBeing) {
                monsterCountHor = 0;
            }
        }
    }
};
const monsterOrderVertical = (coords, sourceCoords, rows) => {
    const checkMonsterOrder = [];
    const targetCell = rows[coords.y].cells[coords.x];
    const targetBeing = targetCell.getAttribute("data-being");
    //vertically because x remains the x of the target
    for (let i = 0; i < rows.length; i++) {
        if (sourceCoords.y == i) {
            checkMonsterOrder[i] = targetBeing;
        } if (coords.y == i) {
            const sourceMonsterCell = document
                .querySelector(`[data-coords = "x${sourceCoords.x}_y${sourceCoords.y}"]`)
                .parentNode;
            const sourceMonster = sourceMonsterCell.getAttribute("data-being");
            checkMonsterOrder[i] = sourceMonster;
        } else {
            const adjacentSimilar = document
                .querySelector(`[data-coords = "x${coords.x}_y${i}"]`)
                .parentNode;
            const adjacentMonster = adjacentSimilar.getAttribute("data-being");
            checkMonsterOrder.push(adjacentMonster);
        }
    }
    return checkMonsterOrder;
}
const monsterOrderHorizontal = (coords, sourceCoords, rows) => {
    const checkMonsterOrder = [];
    //horizontally the y is the y of target
    const cells = rows[0].cells;
    const targetCell = rows[coords.y].cells[coords.x];
    const targetBeing = targetCell.getAttribute("data-being");

    for (let i = 0; i < cells.length; i++) {
        if (sourceCoords.x == i) {
            checkMonsterOrder[i] = targetBeing;

        } if (coords.x == i) {
            const sourceMonsterCell = document
                .querySelector(`[data-coords = "x${sourceCoords.x}_y${sourceCoords.y}"]`)
                .parentNode;
            const sourceMonster = sourceMonsterCell.getAttribute("data-being");
            checkMonsterOrder[i] = sourceMonster;

        } else {
            const adjacentSimilar = document
                .querySelector(`[data-coords = "x${i}_y${coords.y}"]`)
                .parentNode;
            const adjacentMonster = adjacentSimilar.getAttribute("data-being");
            checkMonsterOrder.push(adjacentMonster);
        }
    }
    return checkMonsterOrder;
}
const executeSwap = (sourceCoords, targetCoords) => {
    const finalSource = {
        x: null,
        y: null,
    };
    const finalTarget = {
        x: null,
        y: null,
    };

    const source = document.querySelector(`[data-coords = "x${sourceCoords.x}_y${sourceCoords.y}"]`)
    const target = document.querySelector(`[data-coords = "x${targetCoords.x}_y${targetCoords.y}"]`)

    finalSource.x = target.getBoundingClientRect().left - source.getBoundingClientRect().left;
    finalSource.y = target.getBoundingClientRect().top - source.getBoundingClientRect().top;

    finalTarget.x = source.getBoundingClientRect().left - target.getBoundingClientRect().left;
    finalTarget.y = source.getBoundingClientRect().top - target.getBoundingClientRect().top;

    source.classList.toggle('swapped');
    target.classList.toggle('swapped');
    source.style.transform = `translate(${finalSource.x}px, ${finalSource.y}px)`;
    target.style.transform = `translate(${finalTarget.x}px, ${finalTarget.y}px)`;

    const sourceBeing =  source.parentNode.getAttribute(`data-being`);
    const sourceImage = source.getAttribute(`src`);

    setTimeout(() => {
        source.setAttribute("src", target.getAttribute(`src`));
        source.parentNode.setAttribute("data-being", target.parentNode.getAttribute(`data-being`));
        target.setAttribute("src", sourceImage);
        target.parentNode.setAttribute("data-being", sourceBeing);
        source.classList.remove('swapped');
        target.classList.remove('swapped');
        source.removeAttribute('style');
        target.removeAttribute('style');
    }, 400);
};

const crushSequence = (match, targetCoords, sourceCoords) => {
    // todo: get the coords from the first creature until last in the sequence
    //  empty the cells, empty the target cell vertically and horizontally
    // make sure only the neighbouring creatures in match are being cleared
    const rows = document.getElementsByTagName('tr');
    const targetRow = rows[targetCoords.y];
    let matchCount = 0;
    for (let i = 0; i < rows.length; i++){
        const sourceMonsterCell = document
            .querySelector(`[data-coords = "x${targetCoords.x}_y${i}"]`)
            .parentNode;
        if ((targetRow.cells[sourceCoords.x].getAttribute("data-being")) == (sourceMonsterCell.getAttribute("data-being"))) {
            console.log("miaw");
            matchCount++;
            sourceMonsterCell.firstChild.setAttribute("src", "");
            sourceMonsterCell.setAttribute("data-being", "");
        }

    }
};

const onCellClick = (event) => {
    const selectedClassName = 'selected';
    const selectedCell = document.querySelector('#map td.selected');
    if (selectedCell === event.currentTarget) {
        event.currentTarget.classList.remove(selectedClassName);
    } else if (selectedCell) {
        const selectedCoords = getCoordsFromCell(selectedCell);
        const targetCoords = getCoordsFromCell(event.currentTarget);
        event.currentTarget.classList.toggle('selected');
       if(selectedCoords !== null && targetCoords !== null) {
           trySwapCreatures(selectedCoords, targetCoords);
           event.currentTarget.classList.toggle(selectedClassName);
           selectedCell.classList.toggle(selectedClassName);
       }
    } else {
        event.currentTarget.classList.toggle(selectedClassName);
    }
};

const getCoordsFromCell = (cellElement) => {
    const coordsString = cellElement.querySelector('[data-coords]').getAttribute('data-coords');
    const matches = coordsString.match(/^x(\d+)_y(\d+)$/)
    return matches ? {
        x: parseInt(matches[1]),
        y: parseInt(matches[2]),
    } : null;
};

const bindCellEventHandlers = () => {
    document.querySelectorAll('#map td')
        .forEach(e => e.addEventListener("click", onCellClick));
}
const fillMap = (map, creatures) => {
    const rows = map.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const cols = rows[i].getElementsByTagName("td");
        for (let ii = 0; ii < cols.length; ii++) {
            const creature = creatures[i][ii] ?? null;
            if (creature !== null) {
                cols[ii].setAttribute("data-being", creature);
                const image = document.createElement("img");
                image.setAttribute("src", `graphics/${creature}.png`);
                image.setAttribute("data-coords", `x${ii}_y${i}`);
                cols[ii].appendChild(image);
            }
        }
    }
}

const generateRandomCreatures = (rows, cols, creatures) => {
    const randomCreatures = [];
    for (let i = 0; i < rows; i++) {
        for (let ii = 0; ii < cols; ii++) {
            const randomIndex = Math.floor(Math.random() * creatures.length);
            const creature = creatures[randomIndex];
            if(typeof randomCreatures[i] !== "object") {
                randomCreatures[i] = [];
            }
            randomCreatures[i][ii] = creature;
        }
    }
    return randomCreatures;
}

const drawMap = (rowsCount, colsCount) => {
    const table = document.getElementById("map");
    let tableBody = document.createElement('TBODY');
    tableBody.setAttribute('class', "table_js_body");
    tableBody.setAttribute('id', "removable_body");
    table.appendChild(tableBody);
    for(let i = 0; i < parseInt(rowsCount); i++) {
      let rowElement = table.insertRow(i);
        for(let ii= 0; ii < parseInt(colsCount); ii++) {
            let colElement=  rowElement.insertCell(ii);
            colElement.setAttribute('class', "cell");
        }
    }
    return table;
}

const clearMap = () => {
   document.getElementById("removable_body").remove();
}

const initMap = (rows, cols) => {
    const seedCreatures = generateRandomCreatures(rows, cols, ALL_CREATURES);
    const map = drawMap(rows, cols);
    fillMap(map, seedCreatures);
}

function main () {
    window.renderMap = () => {
        initMap(5, 5);
        bindCellEventHandlers();
    };
    window.clearMap = clearMap;
    window.redrawMap = (creatures) => {
        clearMap();
        const rows = creatures.length;
        const cols = Math.max(...creatures.map(entry => entry.length));
        if (rows < 3 || cols < 3) {
            return false;
        }
        const map = drawMap(rows, cols);
        fillMap(map, creatures);
        bindCellEventHandlers();
        return true;
    };
    window.renderMap();
}

main();
