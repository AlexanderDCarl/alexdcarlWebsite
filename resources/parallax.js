const layers = document.querySelectorAll('.layer');
let currentLowestPeak;

function generateRandomMountainPath(viewWidth, viewHeight) {
    const peaks = 5;
    let points = [];
    for (let i = 0; i <= peaks; i++) {
        let x = (i / peaks) * viewWidth;
        let y = Math.max(0.2, Math.min(Math.random(), 0.8)) * viewHeight;
        points.push(`${x},${y}`);

        if (currentLowestPeak > y || !currentLowestPeak)
            currentLowestPeak = y;
    }
    return `M0,${viewHeight / 2} C${points.join(' ')} L${viewWidth},${viewHeight} L0,${viewHeight} Z`;
}

function createMountainSVG(color, viewWidth, viewHeight) {
    currentLowestPeak = 0;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', generateRandomMountainPath(viewWidth, viewHeight / 2),);
    path.setAttribute('fill', color);
    svg.setAttribute('viewBox', `0 ${currentLowestPeak} ${viewWidth} ${(viewHeight / 2) - currentLowestPeak}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.appendChild(path);

    return svg;
}

function interpolateColor(color1, color2, factor) {
    return `rgb(${color1.map((c, i) => Math.round(c + factor * (color2[i] - c))).join(', ')})`;
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255,
    ];
}

function initializeLayers() {
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const darkColor = hexToRgb('#000000');
    const lightColor = hexToRgb('#c7d9ff');

    layers.forEach((layer, index) => {
        const factor = index / (layers.length - 1);
        const color = interpolateColor(
            darkColor,
            lightColor,
            factor,
        );
        const svg = createMountainSVG(color, viewWidth, viewHeight);
        layer.innerHTML = '';
        layer.appendChild(svg);

        const newDiv = document.createElement('div');

        newDiv.classList = 'filler';
        newDiv.style.background = color;
        newDiv.style.marginTop = `- ${svg.getBoundingClientRect().bottom - svg.children[0].getBoundingClientRect().bottom + 100} px`;
        layer.appendChild(newDiv);

        // layer.style.width = `${ viewWidth } px`;
        // layer.style.height = `${ viewHeight / 8 } px`;
    });
    console.log('');
}

function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

initializeLayers();

window.prevHeight = 0;
function scrolling() {
    if (window.pageYOffset != window.prevHeight) {
        window.prevHeight = window.pageYOffset;
        updateDivs();
    }
    requestAnimationFrame(scrolling);
}

requestAnimationFrame(scrolling);

function updateDivs() {
    if (window.pageYOffset / (document.body.offsetHeight - window.innerHeight) == 1) {
        //const parallax = document.getElementsByClassName('.parallax-group')
        //parallax.style.visibility = 'hidden';
    } else {
        const parallax = document.getElementById('parallax-group');
        parallax.style.visibility = 'visible';
    }
    const scrollFraction = Math.min(
        window.pageYOffset / (document.body.offsetHeight - window.innerHeight),
        0.9999
    );
    document.body.style.setProperty('--scroll', scrollFraction);
    // document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight),);
}
