const parallaxContainer = document.querySelector('#parallax');
const layers = document.querySelectorAll('.layer');
const nameElement = document.getElementById('name');
const arrow = document.querySelector('.arrow');
let ticking = false;
let prevScrollTop = 0;
let scrollTop = 0;
let cachedDepths = [];
layers.forEach((layer, index) => {
    cachedDepths[index] = Math.pow(index, 1.1) * 0.1 - 1.3;
});

document.addEventListener('DOMContentLoaded', function () {

    function generateRandomMountainPath(viewWidth, viewHeight) {
        const peaks = 5;
        let points = [];
        for (let i = 0; i <= peaks; i++) {
            let x = (i / peaks) * viewWidth;
            let y = Math.max(0.2, Math.min(Math.random(), 0.8)) * viewHeight;
            points.push(`${x},${y}`);
        }
        return `M0,${viewHeight / 2} C${points.join(' ')} L${viewWidth},${viewHeight} L0,${viewHeight} Z`;
    }

    function createMountainSVG(color, viewWidth, viewHeight) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", `0 0 ${viewWidth} 1000`);
        svg.setAttribute("preserveAspectRatio", "none");
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", generateRandomMountainPath(viewWidth, viewHeight / 2));
        path.setAttribute("fill", color);
        svg.appendChild(path);
        return svg;
    }

    function interpolateColor(color1, color2, factor) {
        return `rgb(${color1.map((c, i) => Math.round(c + factor * (color2[i] - c))).join(', ')})`;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function initializeLayers() {
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight;
        const darkColor = hexToRgb("#000000");
        const lightColor = hexToRgb("#c7d9ff");

        layers.forEach((layer, index) => {
            const factor = index / (layers.length - 1);
            const color = interpolateColor(darkColor, lightColor, factor);
            const svg = createMountainSVG(color, viewWidth, viewHeight);
            layer.innerHTML = '';
            layer.appendChild(svg);
            layer.style.width = `${viewWidth}px`;
            layer.style.height = `${viewHeight / 8}px`;
        });
    }

    function debounce(func, wait = 100) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    window.addEventListener('resize', debounce(initializeLayers));

    initializeLayers();

    function scroll() {
        scrollTop = parallaxContainer.scrollTop;

        if (scrollTop > 10) {
            arrow.classList.add('hide');
        } else {
            arrow.classList.remove('hide');
        }

        if (!ticking) {
            window.requestAnimationFrame(() => {
                nameElement.style.transform = `translateY(${scrollTop * 1.4}px)`;

                layers.forEach((layer, index) => {
                    layer.style.transform = `translateY(${-scrollTop * cachedDepths[index]}px)`;
                });

                ticking = false;
            });

            ticking = true;
        }
    }
    parallaxContainer.addEventListener('scroll', scroll);

});

