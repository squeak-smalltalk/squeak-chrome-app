var CLIPBOARD_BUFFER = null;
window.addEventListener('load', function(e) {
    window.squeakImages = document.getElementsByClassName('squeak-image');
    window.sandboxedFrame = document.getElementById('sqFrame');
    window.sandboxedWindow = sandboxedFrame.contentWindow;
    var i;
    for (i = 0; i < squeakImages.length; i++) {
        squeakImages[i].addEventListener('click', selectionHandler);
    }
    window.addEventListener('message', function(event) {
        if (event.data.event == 'exit') {
            sqWelcome.style.display = 'block';
            sandboxedFrame.style.display = 'none';
        } else if (event.data.event == 'copy') {
            CLIPBOARD_BUFFER = event.data;
            document.execCommand('copy');
        }
    });
    var keyboardEventTypes = ['keydown', 'keyup', 'keypress'];
    for (i = 0; i < keyboardEventTypes.length; i++) {
        document.addEventListener(keyboardEventTypes[i], keyboardHandler);
    }
    document.addEventListener('paste', clipboardPasteHandler);
    document.addEventListener('copy', clipboardCopyHandler);
    document.addEventListener('cut', clipboardCopyHandler);
});

function selectionHandler(e) {
    var files = this.getAttribute('data-files');
    sqWelcome.style.display = 'none';
    window.sandboxedFrame.style.display = 'block';
    window.sandboxedWindow.postMessage({files: files}, '*');
}

function keyboardHandler(e) {
    window.sandboxedWindow.postMessage({keyboardEvent: copyKeyboardEvent(e)}, '*');
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

function clipboardPasteHandler(e) {
    try {
        window.sandboxedWindow.postMessage({
            clipboard: e.clipboardData.getData('Text'),
            timeStamp: e.timeStamp,
        }, '*');
    } catch(err) {
        console.log('paste error ' + err);
    }
    e.preventDefault();
}

function clipboardCopyHandler(e) {
    if (CLIPBOARD_BUFFER !== null) {
        e.clipboardData.setData('Text', CLIPBOARD_BUFFER.text);
        CLIPBOARD_BUFFER = null;
    } else {
        window.sandboxedWindow.postMessage({
            event: 'copy',
            key: (e.type == 'copy' ? 'c' : 'x'),
            timeStamp: e.timeStamp,
        }, '*');
    }
    e.preventDefault();
}
