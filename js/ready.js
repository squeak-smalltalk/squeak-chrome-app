function runSqueak(imageName) {
    sqText.style.display = "none";
    sqCanvas.style.display = "block";
    SqueakJS.runSqueak(imageName, sqCanvas, {
        fullscreen: true,
        spinner: sqSpinner,
        appName: imageName && imageName.replace(/\.image$/, ""),
    });
}

function exportFile(a) {
    var path = Squeak.splitFilePath(a.innerText);
    Squeak.fileGet(path.fullname, function(buffer) {
        var blob = new Blob([buffer], {type: 'application/octet-stream'}),
            blobURL = URL.createObjectURL(blob);
        a.setAttribute('href', blobURL);
        a.setAttribute('download', path.basename);
        a.onclick = function(){
            setTimeout(function(){URL.revokeObjectURL(blobURL);}, 0);
            return true;
        };
        a.click();
    }, alert);
    return false;
}

window.onload = function() {
    // if we have a hash then we just run Squeak with the options provided in the url
    if (location.hash) {
        return runSqueak();
    }
    document.body.ondragover = function(evt) {
        evt.preventDefault();
        if (evt.dataTransfer.items[0].kind == "file") {
            evt.dataTransfer.dropEffect = "copy";
            drop.style.borderColor = "#0E0";
        } else {
            evt.dataTransfer.dropEffect = "none";
        }
        return false;
    };
    document.body.ondragleave = function(evt) {
        drop.style.borderColor = "";
    };
    document.body.ondrop = function(evt) {
        evt.preventDefault();
        drop.style.borderColor = "#080";
        var files = [].slice.call(evt.dataTransfer.files),
            todo = files.length,
            imageName = null;
        files.forEach(function(f) {
            var reader = new FileReader();
            reader.onload = function () {
                var buffer = this.result;
                console.log("Storing " + f.name + " (" + buffer.byteLength + " bytes)");
                if (/.*image$/.test(f.name)) imageName = f.name;
                Squeak.filePut(f.name, buffer, function success() {
                    if (--todo > 0) return;
                    drop.style.borderColor = "";
                    if (!imageName) showFiles();
                    else runSqueak(imageName);
                });
            };
            reader.onerror = function() { alert("Failed to read " + f.name); };
            reader.readAsArrayBuffer(f);
        });
        return false;
    };

    var imageUrl = chrome.runtime.getURL('images/Squeak1.13u.image');
    debugger;
    SqueakJS.runSqueak(imageUrl, sqCanvas, {
        files: ["Squeak1.13u.image", "Squeak1.13u.changes", "SqueakV1.sources"],
        fullscreen: true,
        spinner: sqSpinner,
        appName: 'Foo',
    });
};
