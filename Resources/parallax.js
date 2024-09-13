document.addEventListener('DOMContentLoaded', function () {
    const parallaxContainer = document.querySelector('.parallax');
    const layers = document.querySelectorAll('.layer');
    const topBar = document.getElementById('topBar');
    const contactInfo = document.getElementById('contactInfo');

    function generateRandomMountainPath() {
        const width = 1000;
        const height = 200;
        const peaks = 5;
        const points = [];
        for (let i = 0; i <= peaks; i++) {
            const x = (i / peaks) * width;
            const y = Math.random() * height;
            points.push(`${x},${y}`);
        }
        return `M0,${height / 2} C${points.join(' ')} L${width},${height} L0,${height} Z`;
    }

    function createMountainSVG(color) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttributeNS(null, "viewBox", "0 0 1000 200");
        svg.setAttributeNS(null, "preserveAspectRatio", "none");
        const path = document.createElementNS(svgNS, "path");
        path.setAttributeNS(null, "d", generateRandomMountainPath());
        path.setAttributeNS(null, "fill", color);
        svg.appendChild(path);
        return svg;
    }

    function interpolateColor(color1, color2, factor) {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
        }
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    }

    function initializeLayers() {
        const darkColor = hexToRgb("#000000");
        const lightColor = hexToRgb("#c7d9ff");

        layers.forEach((layer, index) => {
            const factor = index / (layers.length - 1);
            const color = interpolateColor(darkColor, lightColor, factor);
            const svg = createMountainSVG(color);
            layer.appendChild(svg);
        });
    }

    function handleScroll() {
        const scrollTop = parallaxContainer.scrollTop;

        layers.forEach((layer, index) => {
            const depth = (index) ** 1.3 * 0.1 - 1.3;
            const movement = -(scrollTop * depth);
            layer.style.transform = `translate3d(0, ${movement}px, 0)`;
        });

        // Show contactInfo when bottom of parallax container is reached
        const scrollPosition = parallaxContainer.scrollTop + parallaxContainer.clientHeight;
        const documentHeight = parallaxContainer.scrollHeight;

        if (scrollPosition >= documentHeight) {
            contactInfo.classList.add('show');
        } else {
            contactInfo.classList.remove('show');
        }
    }

    initializeLayers();
    handleScroll();

    parallaxContainer.addEventListener('scroll', handleScroll);
});
