const container = document.querySelector("#unity-container");
const canvas = document.querySelector("#unity-canvas");
const loadingBar = document.querySelector("#unity-loading-bar");
const progressBarFull = document.querySelector("#unity-progress-bar-full");
const warningBanner = document.querySelector("#unity-warning");
var unityInstance = null;

const headerContent = document.querySelector("#header-content");
const footerContent = document.querySelector("#footer-content");
const canvasOverlay = document.querySelector("#canvas-overlay");

const headerContentHeight = headerContent.getBoundingClientRect().height;
const unityContainerWidth = container.getBoundingClientRect().width;
const unityContainerHeight = container.getBoundingClientRect().height;

const unityCanvasPosition = Number(headerContentHeight + headerContent.style.marginTop);

footerContent.style.paddingTop = unityContainerHeight + "px";


//Wait for the unity page be loaded
function waitUnityFinishToLoad() {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;

    canvasOverlay.style.width = width + "px";
    canvasOverlay.style.height = height + "px";
    canvasOverlay.style.backgroundColor = "rgb(0,10,210,1)";
    canvasOverlay.innerHTML = " LOADING ...";
}

function unityLoaded() {
    canvasOverlay.style.width = unityContainerWidth + "px";
    canvasOverlay.style.height = unityContainerHeight + "px";
    canvasOverlay.style.top = headerContentHeight + "px";
    canvasOverlay.style.backgroundColor = "rgb(0,0,0,0)";
    canvasOverlay.innerHTML = "";
}


// Shows a temporary message banner/ribbon for a few seconds, or
// a permanent error message on top of the canvas if type=='error'.
// If type=='warning', a yellow highlight color is used.
// Modify or remove this function to customize the visually presented
// way that non-critical warnings and error messages are presented to the
// user.
function unityShowBanner(msg, type) {
    function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
    }
    var div = document.createElement('div');
    div.innerHTML = msg;
    warningBanner.appendChild(div);
    if (type == 'error') div.style = 'background: red; padding: 10px;';
    else {
        if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
        setTimeout(function () {
            warningBanner.removeChild(div);
            updateBannerVisibility();
        }, 5000);
    }
    updateBannerVisibility();
}

var buildUrl = "Build";
var loaderUrl = buildUrl + "/Rampage2022Demo.loader.js";
var config = {
    dataUrl: buildUrl + "/Rampage2022Demo.data",
    frameworkUrl: buildUrl + "/Rampage2022Demo.framework.js",
    codeUrl: buildUrl + "/Rampage2022Demo.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "Red Bull",
    productName: "InteractiveWebPage",
    productVersion: "0.1",
    showBanner: unityShowBanner,
};

// By default Unity keeps WebGL canvas render target size matched with
// the DOM size of the canvas element (scaled by window.devicePixelRatio)
// Set this to false if you want to decouple this synchronization from
// happening inside the engine, and you would instead like to size up
// the canvas DOM size and WebGL render target sizes yourself.
// config.matchWebGLToCanvasSize = false;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    // Mobile device style: fill the whole browser client area with the game canvas:

    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";

    // To lower canvas resolution on mobile devices to gain some
    // performance, uncomment the following line:
    // config.devicePixelRatio = 1;

    //unityShowBanner('WebGL builds are not supported on mobile devices.');
}
else {
    canvas.style.width = "100%";
    canvas.style.height = "100%";
}

loadingBar.style.display = "block";

waitUnityFinishToLoad();

var script = document.createElement("script");
script.src = loaderUrl;
script.onload = () => {
    createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
    }).then((uInstance) => {
        unityInstance = uInstance;
        loadingBar.style.display = "none";
        unityLoaded();
        U_sendWebGlCanvasInfo(pageHeight, headerContentHeight, unityContainerWidth, unityContainerHeight);
    }).catch((message) => {
        alert(message);
    });
};
document.body.appendChild(script);