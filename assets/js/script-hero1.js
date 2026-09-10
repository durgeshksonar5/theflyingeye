import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import {
    vertexShader,
    fragmentShader
} from './shaders.js';

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll
const lenis = new Lenis({
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// CONFIG
const CONFIG = {
    color: "#e1e1e1",
    spread: 0.5,
    speed: 0.3
};

// Hero canvas
const canvas = document.querySelector(".hero-canvas");
const hero = document.querySelector(".hero-style1");
const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
});
renderer.setSize(hero.offsetWidth, hero.offsetHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Convert hex to RGB
const rgb = (() => {
    const hex = CONFIG.color;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : {
        r: 0.89,
        g: 0.89,
        b: 0.89
    };
})();

// Shader material
const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
        uProgress: {
            value: 0
        },
        uResolution: {
            value: new THREE.Vector2(hero.offsetWidth, hero.offsetHeight)
        },
        uColor: {
            value: new THREE.Vector3(rgb.r, rgb.g, rgb.b)
        },
        uSpread: {
            value: CONFIG.spread
        }
    },
    transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

let scrollProgress = 0;

function animate() {
    material.uniforms.uProgress.value = scrollProgress;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
    renderer.setSize(hero.offsetWidth, hero.offsetHeight);
    material.uniforms.uResolution.value.set(hero.offsetWidth, hero.offsetHeight);
});

// Lenis scroll
lenis.on("scroll", ({
    scroll
}) => {
    const maxScroll = Math.max(hero.offsetHeight - window.innerHeight, 1);
    scrollProgress = Math.min((scroll / maxScroll) * CONFIG.speed, 1.1);
});