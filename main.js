console.clear();

const pad = 20;
const threshold = "0%";

const checkButton = document.querySelector("#check-button");
const resetButton = document.querySelector("#reset-button");

const dragElements = document.querySelectorAll(".drag-tile");
const dropElements = document.querySelectorAll(".drop-tile");

const dragTiles = Array.prototype.map.call(dragElements, createDragTile);
const dropTiles = Array.prototype.map.call(dropElements, createDropTile);

console.log('dragTiles', dragTiles);
//   { element: <div class="tile drag-tile" data-value="alpha" style="top: 20px; left: 20px; t…one; user-select: none;">,
//     ​​parent: null,
//     value: "alpha" }


checkButton.addEventListener("click", checkTiles);
resetButton.addEventListener("click", resetTiles);

function checkTiles() {

    for (let i = 0; i < dragTiles.length; i++) {
        const tile = dragTiles[i];
        if (!tile.parent) {
            continue;
        }
        const className = tile.value === tile.parent.value ? "correct" : "wrong";
        tile.element.classList.add(className);
    }
}

function resetTiles() {

    for (let i = 0; i < dragTiles.length; i++) {
        const tile = dragTiles[i];
        if (tile.parent) {
            tile.parent = tile.parent.child = null;
        }

        tile.element.classList.remove("correct", "wrong", "hitting");
        TweenLite.to(tile.element, 0.3, {
            x: 0,
            y: 0
        });
    }
}

function createDragTile(element, index) {

    TweenLite.set(element, {
        left: pad,
        top: pad + index * (pad + element.offsetHeight)
    });

    const draggable = new Draggable(element, {
        bounds: ".board",
        onDragStart: onDragStart,
        onDrag: onDrag,
        onDragEnd: onDragEnd
    });

    const tile = {
        element: element,
        parent: null,
        value: element.dataset.value
    };

    function onDragStart() {
        element.classList.remove("correct", "wrong");
    }

    function onDrag() {
        let parent = tile.parent;

        if (parent) {

            if (this.hitTest(parent.element, threshold)) {

                // exit the function
                // tile is still hitting parent, so no need to proceed any further.
                return;
            }

            // tile is no longer hitting parent, so clear any references between the two
            parent = tile.parent = parent.child = null;
        }

        for (let i = 0; i < dropTiles.length; i++) {
            const dropTile = dropTiles[i];

            if (dropTile.child) {

                // continue to next loop iteration
                // drop tile already has a child, so no need to proceed any further
                continue;
            }

            if (this.hitTest(dropTile.element, threshold)) {

                // we hit an empty drop tile, so link the two together and exit the function
                tile.parent = dropTile;
                dropTile.child = tile;
                element.classList.add("hitting");
                return;
            }
        }
        // if we made it this far, we're not hitting an empty drop tile
        element.classList.remove("hitting");
    }

    function onDragEnd() {
        let x = 0;
        let y = 0;
        // const p = $(element).position();
        // x = p.x;
        // y = p.y;

        // move to parent
        if (tile.parent) {

            const rect1 = element.getBoundingClientRect();
            const rect2 = tile.parent.element.getBoundingClientRect();

            x = "+=" + (rect2.left - rect1.left);
            y = "+=" + (rect2.top - rect1.top);
        }

        TweenLite.to(element, 0.3, {
            x: x,
            y: y
        });
    }

    return tile;
}

function createDropTile(element, index) {

    TweenLite.set(element, {
        left: pad + 3 * element.offsetWidth,
        top: pad + index * (pad + element.offsetHeight)
    });

    const tile = {
        element: element,
        child: null,
        value: element.dataset.value
    };
    return tile;
}
