function scrollWindowsToNewPos(x, y) {

    if(isNaN(x) || isNaN(y)){
        console.logerror("NAN", x, y)
        return;
    } 

    var numX = Number(x);
    var numY = Number(y);

    uss.scrollTo(numX, numY, window,  () => console.log("dOnE"));   
    uss.stopScrolling();
    // if(window.scrollX != numX){
    //     uss.stopScrollingX();
    //     uss.scrollXTo(numX, window, () => console.log("re-scrolled Window X axis"));   
    // }

    // if(window.scrollY != numY){
    //     uss.stopScrollingY();
    //     uss.scrollYTo(numY, window, () => console.log("re-scrolled Window Y axis"));   
    // }
}

function clamp01(value) {
    return Math.min(Math.max(0, value), 1);
}

function getElementPosition(el) {
    // yay readability
    for (var lx = 0, ly = 0;
        el != null;
        lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return { x: lx, y: ly };
}