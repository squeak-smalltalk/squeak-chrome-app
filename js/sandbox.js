delete window.localStorage;
window.localStorage = {};
delete window.indexedDB;

var IMAGE_BASE_URL = 'http://freudenbergs.de/bert/squeakjs/';

window.onload = function() {
    window.addEventListener('message', function(event) {
        var files = event.data.split(',');
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
                    if (display.cursorCanvas.parentNode != null) {
                      display.cursorCanvas.parentNode.removeChild(display.cursorCanvas);
                    }
                }, 500);
            }
        });
    });
};