delete window.localStorage;
window.localStorage = {};
delete window.indexedDB;

var IMAGE_BASE_URL = 'http://freudenbergs.de/bert/squeakjs/';

window.onload = function() {
    window.addEventListener('message', function(event) {
        if (event.data.event !== undefined) {
            dispatchClonedKeyboardEvent(event.data.event);
        } else if (event.data.files !== undefined) {
            var files = event.data.files.split(',');
            var imageName = files[0];
            SqueakJS.runSqueak(IMAGE_BASE_URL + imageName, sqCanvas, {
                appName: imageName && imageName.replace(/\.image$/, ""),
                files: files,
                fullscreen: true,
                swapButtons: true,
                spinner: sqSpinner,
                onQuit: function(vm, display, options) {
                    display.vm = null;
                    display.showBanner("Exiting...");
                    setTimeout(function() {
                        event.source.postMessage('exit', event.origin);
                        var parentNode = display.cursorCanvas.parentNode;
                        if (parentNode !== null) {
                          parentNode.removeChild(display.cursorCanvas);
                        }
                    }, 500);
                }
            });
        }
    });
};

function dispatchClonedKeyboardEvent(event) {
    var keyboardEvent = document.createEvent("KeyboardEvent");
    keyboardEvent.initKeyboardEvent(
        event.type,
        event.bubbles,
        event.cancelable,
        window,
        event.keyIdentifier,
        event.location,
        event.ctrlKey,
        event.altKey,
        event.shiftKey,
        event.metaKey,
        false //event.altGraphKey
    );
    var override_props = ["charCode", "code", "keyCode", "which"];
    for (var i = 0; i < override_props.length; i++) {
        var prop_name = override_props[i];
        delete keyboardEvent[prop_name];
        Object.defineProperty(keyboardEvent, prop_name, {
            writable: true,
            value: event[prop_name],
        });
    }
    document.dispatchEvent(keyboardEvent);
}