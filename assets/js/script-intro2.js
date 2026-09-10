document.addEventListener("DOMContentLoaded", () => {

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);


    const images = gsap.utils.toArray(".spotlight .img");
    const cover = document.querySelector(".spotlight-cover-img");

    const introHeader = document.querySelector(".spotlight-intro-header .container");
    const outroHeader = document.querySelector(".spotlight-outro-header h2");


    /* SplitText for outro */
    const outroSplit = new SplitText(outroHeader, {
        type: "words"
    });

    gsap.set(outroSplit.words, {
        y: 80,
        opacity: 0
    });


    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scatter = [{
            x: 1.4,
            y: 0.7
        },
        {
            x: -1.5,
            y: 1.2
        },
        {
            x: 1.4,
            y: -1.3
        },
        {
            x: -1.7,
            y: -0.8
        },
        {
            x: 1.8,
            y: 1.5
        },
    ];


    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".spotlight",
            start: "top top",
            end: `+=${images.length * 600}`,
            pin: true,
            scrub: 1
        }
    });


    /* intro hide */

    tl.to(introHeader, {
        opacity: 0,
        y: -50,
        duration: 0.4
    }, 0.8);


    /* images animation */

    images.forEach((img, i) => {

        const dir = scatter[i % scatter.length];

        tl.fromTo(img, {
                scale: 0,
                z: -800,
                x: 0,
                y: 0,
                opacity: 0
            }, {
                scale: 1,
                z: 0,
                x: dir.x * screenWidth * 0.5,
                y: dir.y * screenHeight * 0.5,
                opacity: 1,
                duration: 1
            },
            i * 0.2
        );

    });


    /* cover image */

    tl.fromTo(cover, {
            scale: 0,
            z: -500,
            opacity: 0
        }, {
            scale: 1,
            z: 0,
            opacity: 1,
            duration: 1
        },
        images.length * 0.2
    );


    /* outro text bounce reveal */

    tl.to(outroSplit.words, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(2)"
    }, images.length * 0.2 + 0.5);

});