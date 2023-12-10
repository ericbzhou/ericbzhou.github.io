window.addEventListener("DOMContentLoaded", function() {
    var collapsibleTitles = document.getElementsByClassName("collapse-title");
    
    for (var i = 0; i < collapsibleTitles.length; i++) {
        var content = collapsibleTitles[i].nextElementSibling;
        content.style.display = "none"; // Initially set the content to be hidden

        collapsibleTitles[i].addEventListener("click", function(contentElement) {
            return function() {
                this.classList.toggle("active");
                if (contentElement.style.display === "block") {
                    contentElement.style.display = "none";
                } else {
                    contentElement.style.display = "block";
                }
            };
        }(content));
    }
});