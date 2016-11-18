delete window.localStorage;
window.localStorage = {};
delete window.indexedDB;

var IMAGE_BASE_URL = 'https://freudenbergs.de/bert/squeakjs/';
var SQUEAK_JS_DISPLAY = null;

window.onload = function() {
    window.addEventListener('message', function(event) {
        if (event.data.keyboardEvent !== undefined) {
            dispatchClonedKeyboardEvent(event.data.keyboardEvent);
        } else if (event.data.clipboard !== undefined) {
            if (SQUEAK_JS_DISPLAY === null) {
                return;
            }
            SQUEAK_JS_DISPLAY.executeClipboardPaste(
                event.data.clipboard,
                event.data.timeStamp
            );
        } else if (event.data.event == 'copy') {
            var text = SQUEAK_JS_DISPLAY.executeClipboardCopy(
                event.data.key,
                event.data.timeStamp
            );
            event.source.postMessage({
                event: 'copy',
                text: text,
                timeStamp: event.data.timeStamp,
            }, event.origin);
        } else if (event.data.files !== undefined) {
            var files = event.data.files.split(',');
            var imageName = files[0];
            SQUEAK_JS_DISPLAY = SqueakJS.runSqueak(IMAGE_BASE_URL + imageName, sqCanvas, {
                appName: imageName && imageName.replace(/\.image$/, ''),
                files: files,
                fullscreen: true,
                swapButtons: true,
                spinner: sqSpinner,
                onQuit: function(vm, display, options) {
                    display.vm = null;
                    display.showBanner('Exiting...');
                    setTimeout(function() {
                        event.source.postMessage({event: 'exit'}, event.origin);
                        var parentNode = display.cursorCanvas.parentNode;
                        if (parentNode !== null) {
                          parentNode.removeChild(display.cursorCanvas);
                        }
                    }, 500);
                }
            });
            SQUEAK_JS_DISPLAY.fullscreenRequest = function(fullscreen, thenDo) {
                // called from primitive to change fullscreen mode
                if (SQUEAK_JS_DISPLAY.fullscreen != fullscreen) {
                    event.source.postMessage({
                        event: 'fullscreen',
                        enable: fullscreen,
                    }, event.origin);
                    SQUEAK_JS_DISPLAY.fullscreen = fullscreen;
                    SQUEAK_JS_DISPLAY.resizeTodo = thenDo;    // called after resizing
                    SQUEAK_JS_DISPLAY.resizeTodoTimeout = setTimeout(SQUEAK_JS_DISPLAY.resizeDone, 1000);
                } else thenDo();
            };
        }
    });
};

function dispatchClonedKeyboardEvent(event) {
    var keyboardEvent = document.createEvent('KeyboardEvent');
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
    var override_props = ['charCode', 'code', 'keyCode', 'which'];
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
