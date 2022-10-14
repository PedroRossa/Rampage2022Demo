const headerContent = document.querySelector("#header-content");
const footerContent = document.querySelector("#footer-content");
const canvasOverlay = document.querySelector("#canvas-overlay");

const headerContentHeight = headerContent.getBoundingClientRect().height;
const unityContainerWidth = container.getBoundingClientRect().width;
const unityContainerHeight = container.getBoundingClientRect().height;

const unityCanvasPosition = Number(headerContentHeight + headerContent.style.marginTop);

footerContent.style.paddingTop = unityContainerHeight + "px";

canvasOverlay.style.width = unityContainerWidth + "px";
canvasOverlay.style.height = unityContainerHeight + "px";
canvasOverlay.style.top = headerContentHeight + "px";

//for mobile
document.addEventListener("touchstart", onTouchStart);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchmove', onMobileTouch);

//for desktop
document.addEventListener('wheel', onWheel);

const canvasOffsetToTouch = unityContainerHeight / 10;
const canvasOffsetToWheel = unityContainerHeight / 4;

const animateToPosParameter = "AnimateToPosition";

let animationIsRunning = false;
let currentAnimationPosition = 0;
let currentAnimState = -1;

let windowFixed = false;

var touchStart = { x: 0, y: 0 };
var touchOffset = { x: 0, y: 0 };

function onTouchStart(e) {
    touchStart.x = e.touches[0].clientX;
    touchStart.y = e.touches[0].clientY;
}

function onTouchMove(e) {
    touchOffset.x = touchStart.x - e.touches[0].clientX;
    touchOffset.y = touchStart.y - e.touches[0].clientY;
}

function onMobileTouch(e) {
    U_sendScrollDataToUnity(window.scrollY, touchOffset.y / 100);
    refreshCanvas(touchOffset.y, canvasOffsetToTouch);
}

function onWheel(e) {
    U_sendScrollDataToUnity(window.scrollY, e.deltaY / 100);
    refreshCanvas(e.deltaY, canvasOffsetToWheel);
}

function refreshCanvas(scrollDeltaY, canvasOffset) {
    scrollPos = window.pageYOffset;
    // var1.innerHTML = "Cur Pos: " + scrollPos;
    debugPanel.style.paddingTop = scrollPos + "px";

    let scrollingDown = scrollDeltaY > 0;
    let isOnCanvasRegion = scrollPos > (headerContentHeight - Number(canvasOffset)) && scrollPos < (headerContentHeight + Number(canvasOffset));

    if (isOnCanvasRegion) {
        // var2.innerHTML = "Canvas " + headerContentHeight + " - "+ canvasOffset;

        if (!animationIsRunning) {
            if (scrollingDown) {
                if (currentAnimationPosition < 1) {
                    fixPageOnAnimatedCanvas();
                    return;
                }
            } else {
                if (currentAnimationPosition > 0) {
                    fixPageOnAnimatedCanvas();
                    return;
                }
            }
        }

        if(window.scrollY != unityCanvasPosition){
            fixPageOnAnimatedCanvas();
        }

        currentAnimState = updateAnimation(scrollDeltaY);

        if (scrollingDown && currentAnimState == 1) {
            releasePageFromAnimatedCanvas(scrollingDown, unityCanvasPosition + canvasOffset);
        } else if (!scrollingDown && currentAnimState == -1) {
            releasePageFromAnimatedCanvas(scrollingDown, unityCanvasPosition - canvasOffset);
        }

        return;
    }

    if(animationIsRunning){
        if (scrollingDown) {
            releasePageFromAnimatedCanvas(scrollingDown, unityCanvasPosition + canvasOffset);
        } else {
            releasePageFromAnimatedCanvas(scrollingDown, unityCanvasPosition - canvasOffset);
        }
    }

    // var2.innerHTML = "Webpage " + headerContentHeight + " - "+ canvasOffset;
}

//return 1 to animation finished topDown, -1 finished downTop and 0 if not finished yet
function updateAnimation(scrollDeltaY) {
    currentAnimationPosition += scrollDeltaY / 8001;
    currentAnimationPosition = clamp01(currentAnimationPosition);

    ///The position need to be normalized between 0 - 1
    U_sendFloatValue(animateToPosParameter, currentAnimationPosition);

    if (currentAnimationPosition >= 1) return 1;
    else if (currentAnimationPosition <= 0) return -1;
    else return 0;
}

function fixPageOnAnimatedCanvas() {
    //stack window position at the canvas element
    scrollWindowsToNewPos(0, unityCanvasPosition);

    canvasOverlay.style.display = "none";
    document.body.style.overflow = "hidden";
    animationIsRunning = true;
    windowFixed = true;

    // var3.innerHTML = "animation is Running!";
}

function releasePageFromAnimatedCanvas(scrollingDown, newWindowPos) {
    //if scrolling down, indicates that the animation finished, else, it's back to the top page
    currentAnimationPosition = scrollingDown ? 1 : 0
    U_sendFloatValue(animateToPosParameter, currentAnimationPosition);

    canvasOverlay.style.display = "inline";
    document.body.style.overflow = "scroll";
    animationIsRunning = false;
    windowFixed = false;

    scrollWindowsToNewPos(0, newWindowPos);
}