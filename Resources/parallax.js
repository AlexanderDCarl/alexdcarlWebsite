document.addEventListener('DOMContentLoaded', function () {
    var parallaxContainer = document.querySelector('.parallax');
    var layers = document.querySelectorAll('.layer');
    var contactInfo = document.getElementById('bottomParallax');
    var nameElement = document.getElementById('name');

    function generateRandomMountainPath(viewWidth, viewHeight) {
        var width = viewWidth;
        var height = viewHeight;
        var peaks = 5;
        var points = [];
        for (var i = 0; i <= peaks; i++) {
            var x = (i / peaks) * width;
            var numRand = Math.random();
            if(numRand < .2)
                numRand = .2;
            else if(numRand > .8)
                numRand = .8;
            var y = numRand * height;
            points.push("".concat(x, ",").concat(y));
        }
        return "M0,".concat(height / 2, " C").concat(points.join(' '), " L").concat(width, ",").concat(height, " L0,").concat(height, " Z");
    }

    function createMountainSVG(color, viewWidth, viewHeight) {
        var svgNS = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(svgNS, "svg");
        svg.setAttributeNS(null, "viewBox", "0 0 " + viewWidth + " 1000");
        svg.setAttributeNS(null, "preserveAspectRatio", "none");
        var path = document.createElementNS(svgNS, "path");
        path.setAttributeNS(null, "d", generateRandomMountainPath(viewWidth, viewHeight/2));
        path.setAttributeNS(null, "fill", color);
        svg.appendChild(path);
        return svg;
    }

    function interpolateColor(color1, color2, factor) {
        var result = color1.slice();
        for (var i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
        }
        return "rgb(".concat(result[0], ", ").concat(result[1], ", ").concat(result[2], ")");
    }

    function hexToRgb(hex) {
        var bigint = parseInt(hex.slice(1), 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;
        return [r, g, b];
    }

    function initializeLayers() {
        var viewWidth = window.innerWidth;
        var viewHeight = window.innerHeight;
        var darkColor = hexToRgb("#000000");
        var lightColor = hexToRgb("#c7d9ff");
        layers.forEach(function (layer, index) {
            var factor = index / (layers.length - 1);
            var color = interpolateColor(darkColor, lightColor, factor);
            var svg = createMountainSVG(color, viewWidth, viewHeight);
            layer.innerHTML = '';
            layer.appendChild(svg);
            layer.style.width = viewWidth + 'px';
            layer.style.height = viewHeight/8 + 'px';
        });
    }

    let isScrolling = false;
    let lastScrollTop = 0;
    let ticking = false;

    function handleScroll() {
        const scrollTop = parallaxContainer.scrollTop;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                nameElement.style.transform = `translateY(${scrollTop * 1.4}px)`;

                layers.forEach(function (layer, index) {
                    let depth = Math.pow(index, 1.1) * 0.1 - 1.3;
                    let movement = -(scrollTop * depth);
                    layer.style.transform = `translate3d(0, ${movement}px, 0)`;
                });

                // Show or hide contact info
                let scrollPosition = parallaxContainer.scrollTop + parallaxContainer.clientHeight;
                let documentHeight = parallaxContainer.scrollHeight;
                if (scrollPosition >= documentHeight) {
                    contactInfo.classList.add('show');
                } else {
                    contactInfo.classList.remove('show');
                }

                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    }


    window.addEventListener('resize', initializeLayers);
    initializeLayers();

    handleScroll();
    parallaxContainer.addEventListener('scroll', handleScroll);

});
