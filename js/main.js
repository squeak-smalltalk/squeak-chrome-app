window.onload = function() {
    var squeakImages = document.getElementsByClassName('squeak-image');
    for (var i = 0; i < squeakImages.length; i++) {
        squeakImages[i].addEventListener('click', function(e) {
            var files = this.getAttribute('data-files');
            sqWelcome.style.display = "none";
            document.getElementById('sqFrame').style.display = "block";
            document.getElementById('sqFrame').contentWindow.postMessage(files, '*');
        });
    }
    window.addEventListener('message', function(event) {
        sqWelcome.style.display = "block";
    	document.getElementById('sqFrame').style.display = "none";
    });
};
