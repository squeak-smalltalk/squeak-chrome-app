window.onload = function() {
    window.squeakImages = document.getElementsByClassName('squeak-image');
    window.sandboxedFrame = document.getElementById('sqFrame');
    window.sandboxedWindow = sandboxedFrame.contentWindow;
    var i;
    for (i = 0; i < squeakImages.length; i++) {
        squeakImages[i].addEventListener('click', selectionHandler);
    }
    window.addEventListener('message', function(event) {
        sqWelcome.style.display = "block";
    	sandboxedFrame.style.display = "none";
    });
    var keyboardEventTypes = ['keydown', 'keyup', 'keypress'];
    for (i = 0; i < keyboardEventTypes.length; i++) {
        document.addEventListener(keyboardEventTypes[i], keyboardHandler);
    }
};

function selectionHandler(e) {
    var files = this.getAttribute('data-files');
    sqWelcome.style.display = "none";
    window.sandboxedFrame.style.display = "block";
    window.sandboxedWindow.postMessage({files: files}, '*');
}

function keyboardHandler(e) {
    window.sandboxedWindow.postMessage({event: copyKeyboardEvent(e)}, '*');
}

function copyKeyboardEvent(event) {
    return {
        altKey: event.altKey,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        charCode: event.charCode,
        code: event.code,
        ctrlKey: event.ctrlKey,
        keyCode: event.keyCode,
        keyIdentifier: event.keyIdentifier,
        location: event.location,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        type: event.type,
        which: event.which,
    };
}
