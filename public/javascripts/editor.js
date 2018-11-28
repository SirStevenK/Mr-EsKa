String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var config = document.getElementById("config");
var editor = document.getElementById("editor");

var title = document.getElementById("titre");
var url = document.getElementById("url");
var image = document.getElementById("image");
var textarea = document.getElementById("contenu");
var contentVisu = document.getElementById("article-content");
var titleVisu = document.getElementById("article-title");
var imageVisu = document.getElementById("main-image");

function updateVisualizer() {
    titleVisu.innerHTML = "<h1>" + title.value + "</h1>";
    imageVisu.src = image.value;
    contentVisu.innerHTML = textarea.value;
    contentVisu.innerHTML = contentVisu.innerHTML.replace(/<p>/g, '<p>');
    contentVisu.innerHTML = contentVisu.innerHTML.replace(/<\/p>/g, '</p>');
    contentVisu.innerHTML = contentVisu.innerHTML.replace(/<u>/g, '<span class="u">');
    contentVisu.innerHTML = contentVisu.innerHTML.replace(/<\/u>/g, '</span>');
    SyntaxHighlighter.highlight()
}

function validUrlImage() {
    if (url.value == "articles/") {
        url.style.borderColor = "red";
    }
    else url.style.borderColor = "#BBB";
    url.value = "articles/" + url.value.substring(9);
}

title.oninput = updateVisualizer;
image.oninput = updateVisualizer;
textarea.oninput = updateVisualizer;
url.oninput = validUrlImage;

function modifSelect(val1, val2) {
    if (textarea.selectionStart != textarea.selectionEnd) textarea.value = textarea.value.substring(0, textarea.selectionStart) + val1 + textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) + val2 + textarea.value.substring(textarea.selectionEnd)
    updateVisualizer();
}

function toggleEdit() {
    if (config.style.display == "none")
    {
        config.style.display = "flex";
        editor.style.display = "none";
    }
    else
    {
        config.style.display = "none";
        editor.style.display = "flex";
    }
}

updateVisualizer();
validUrlImage();