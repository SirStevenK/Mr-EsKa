let overview = document.getElementById("overview");
let urlOverview = document.getElementById("ov-top").lastElementChild;
let imageOverview = document.getElementById("ov-mid").firstElementChild;
let main = document.getElementById("main");
let currentUrl = document.getElementById("url");

function showOverview(element) {
    main.style.display = "none";
    overview.style.display = "flex";
    urlOverview.value = element.attributes.src.nodeValue;
    imageOverview.src = element.src;
    currentUrl.value = element.attributes.src.nodeValue;
}

urlOverview.oninput = function() {
    if (urlOverview.value == "/images/") {
        urlOverview.style.borderColor = "red";
    }
    else urlOverview.style.borderColor = "#BBB";
    urlOverview.value = "/images/" + urlOverview.value.substring(8);
}

