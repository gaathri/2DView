function hello() {
    // alert('Hello!!!');
}

function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}


function addTaskColorStyleString(cssClassName, cssClassValue) {
    if (document.getElementsByTagName("head")[0].textContent.indexOf(cssClassName) < 0) {
        let css = document.createElement('style');
        css.type = 'text/css';
        let cssRule = cssClassName + " " + cssClassValue;
        if (css.styleSheet) css.styleSheet.cssText = cssRule; // Support for IE
        else css.appendChild(document.createTextNode(cssRule)); // Support for the rest
        document.getElementsByTagName("head")[0].appendChild(css);
    }
}