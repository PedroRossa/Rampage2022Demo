const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

function U_sendWebGlCanvasInfo(pageSize, initialPos, canvasWidth, canvasHeight) {
    unityInstance.SendMessage('JsBridge', 'JsGetPageSize', pageSize);
    unityInstance.SendMessage('JsBridge', 'JsGetInitialWebGlPosition', initialPos);
    unityInstance.SendMessage('JsBridge', 'JsGetWebGlCanvasWidth', canvasWidth);
    unityInstance.SendMessage('JsBridge', 'JsGetWebGlCanvasHeight', canvasHeight);
    //Need to be the last data to be sent to guarantee that other values was already set
    unityInstance.SendMessage('JsBridge', 'JsWebGlReady');
}

function U_sendScrollDataToUnity(scrollPos, deltaY) {
    unityInstance.SendMessage('JsBridge', 'JsScrollPositionChanged', scrollPos);
    unityInstance.SendMessage('JsBridge', 'JsDeltaYChanged', deltaY);
}

function U_sendFloatValue(propertyName, value) {
    var valueToSend = propertyName + ':' + value;

    if (typeof value != "number") {
        console.error("You are trying to send a value that is not a number.");
        return;
    }

    unityInstance.SendMessage('JsBridge', 'JsReceiveFloatValue', valueToSend);
}

function U_sendIntValue(propertyName, value) {
    var valueToSend = propertyName + ':' + value;

    if (typeof value != "number") {
        console.error("You are trying to send a value that is not a number.");
        return;
    }

    unityInstance.SendMessage('JsBridge', 'JsReceiveIntValue', valueToSend);
}

function U_sendStringValue(propertyName, value) {
    var valueToSend = propertyName + ':' + value;

    if (typeof value != "string") {
        console.error("You are trying to send a value that is not a string.");
        return;
    }

    unityInstance.SendMessage('JsBridge', 'JsReceiveStringValue', valueToSend);
}

function U_sendBooleanValue(propertyName, value) {
    var valueToSend = propertyName + ':' + value;

    if (typeof value != "boolean") {
        console.error("You are trying to send a value that is not a boolean.");
        return;
    }

    unityInstance.SendMessage('JsBridge', 'JsReceiveBooleanValue', valueToSend);
}