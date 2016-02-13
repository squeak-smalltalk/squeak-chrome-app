IMAGE_BASE_URL = 'http://freudenbergs.de/bert/squeakjs/';

window.onload = function() {
    var squeakImages = document.getElementsByClassName('squeak-image');
    for (var i = 0; i < squeakImages.length; i++) {
        squeakImages[i].addEventListener('click', function(e) {
            var files = this.getAttribute('data-files').split(',');
            var imageName = files[0];
            sqWelcome.style.display = "none";
            sqCanvas.style.display = "block";
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
                        sqWelcome.style.display = "block";
                        sqCanvas.style.display = "none";
                        document.body.style = '';
                        if (display.cursorCanvas.parentNode != null) {
                            display.cursorCanvas.parentNode.removeChild(display.cursorCanvas);
                        }
                    }, 1000);
                }
            });
        });
    }
    
};
