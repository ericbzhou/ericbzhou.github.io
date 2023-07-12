window.addEventListener("DOMContentLoaded", function() {
    var collapsibleTitles = document.getElementsByClassName("research-title");
    for (var i = 0; i < collapsibleTitles.length; i++) {
        collapsibleTitles[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
});

window.addEventListener("DOMContentLoaded", function() {
    var collapsibleTitles = document.getElementsByClassName("header-title");
    for (var i = 0; i < collapsibleTitles.length; i++) {
        collapsibleTitles[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
});