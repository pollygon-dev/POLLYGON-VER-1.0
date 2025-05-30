// Replace your loader.js content with this
document.onreadystatechange = function() {
    if (document.readyState === "complete") {
        // Minimum 1 second display time for the loader
        setTimeout(showPage, 1000);
    }
};

function showPage() {
    document.getElementById("loader").classList.add("hidden");
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 500);
}