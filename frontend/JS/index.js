document.addEventListener("DOMContentLoaded", function () {
    function startCounter(element, start, end, duration) {
        let range = end - start;
        let current = start;
        let increment = end > start ? 1 : -1;
        let stepTime = Math.abs(Math.floor(duration / range));
        let timer = setInterval(function () {
            current += increment;
            element.innerHTML = `+${current.toLocaleString()}`;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    function isElementInViewport(el) {
        let rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    function startCountingOnScroll() {
        let counters = document.querySelectorAll(".texto-superpuesto strong");
        let started = false;

        window.addEventListener("scroll", function () {
            if (!started && isElementInViewport(counters[0])) {
                counters.forEach(counter => {
                    let endValue = parseInt(counter.getAttribute("data-target"));
                    startCounter(counter, 0, endValue, 2000);
                });
                started = true;
            }
        });
    }

    startCountingOnScroll();

})

// navegador
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    
    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
});