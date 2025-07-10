$(document).ready(function () {
    let allowScroll = true;
    let scale = 1;
    const minScale = 1;
    const maxScale = 3;
    let videoStarted = false;
    let videoFinished = false;
    const totalFrames = 210;
    const frameStep = 2;
    const images = [];
    let currentFrame = 0;
    let imagesLoaded = 0;
    let imageAspectRatio = 16 / 9;
    let firstImageLoaded = false;
    const progressTop = $("#timeline-progress-top");
    const videoSection = document.querySelector(".video-scale-section");
    const maskedHeading = document.querySelector(".masked-heading");
    const topSub = document.querySelector(".top-sub");
    const bottomSub = document.querySelector(".bottom-sub");
    const bgVideo = document.querySelector(".bg-video");
    // === Canvas scroll-controlled animation start ===
    const canvas = document.getElementById("animation-canvas");
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("canvas-text");
    const canvasSection = document.getElementById("canvas-section");

    const paperVideo = document.getElementById("paperVideo");
    const floatingText = document.getElementById("floatingText");
    const foldedPaper = document.getElementById("folded_paper");
    let videoIsPlaying = false;

    // === Preload SVGs and Resize ===
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = canvas.width / imageAspectRatio;
    }
    for (let i = 0; i < totalFrames; i++) {
        const img = new Image();
        img.src = `frames/${String(i + 1).padStart(1, "0")}.svg`;

        img.onload = () => {
            imagesLoaded++;
            if (!firstImageLoaded) {
                imageAspectRatio = img.width / img.height;
                firstImageLoaded = true;
                resizeCanvas();
            }
            if (imagesLoaded === totalFrames) drawFrame(0);
        };
        images.push(img);
    }
    window.addEventListener("resize", resizeCanvas);
    // === Draw Frame ===
    function drawFrame(frameIndex) {
        const index = Math.max(0, Math.min(totalFrames - 1, frameIndex));
        const img = images[index];
        if (!img || img.width === 0) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        // === Overlay Text Fade Logic ===
        if (frameIndex >= 93 && frameIndex <= 159) {
            let opacity = 1;
            if (frameIndex < 100) opacity = (frameIndex - 93) / (100 - 93);
            else if (frameIndex > 150) opacity = 1 - (frameIndex - 150) / (159 - 150);
            overlay.style.opacity = opacity.toFixed(2);
        } else {
            overlay.style.opacity = 0;
        }
    }
    // === Scroll Handler ===
    function handleCanvasScroll(deltaY) {
        if (deltaY > 0) {
            if (currentFrame < totalFrames - 1) {
                currentFrame = Math.min(currentFrame + frameStep, totalFrames - 1);
                drawFrame(currentFrame);
            } else {
                endCanvasScroll("down");
            }
        } else {
            if (currentFrame > 0) {
                currentFrame = Math.max(currentFrame - frameStep, 0);
                drawFrame(currentFrame);
            } else {
                endCanvasScroll("up");
            }
        }
    }
    function endCanvasScroll(direction) {
        document.body.classList.remove("canvas-active");
        fullpage_api.setAllowScrolling(true);
        direction === "down"
            ? fullpage_api.moveSectionDown()
            : fullpage_api.moveSectionUp();
    }
    // === Global Scroll Events for Canvas ==
    function isCanvasActive() {
        return document.body.classList.contains("canvas-active");
    }

    function unifiedCanvasHandler(e) {
        if (!isCanvasActive()) return;

        let deltaY = 0;

        if (e.type === "wheel") {
            e.preventDefault();
            deltaY = e.deltaY;
        } else if (e.type === "touchmove") {
            const currentY = e.touches[0].clientY;
            deltaY = lastTouchY - currentY;
            lastTouchY = currentY;
        } else if (e.type === "keydown") {
            if (e.key === "ArrowDown" || e.key === "PageDown") deltaY = 100;
            if (e.key === "ArrowUp" || e.key === "PageUp") deltaY = -100;
        }

        if (deltaY !== 0) handleCanvasScroll(deltaY);
    }

    ["wheel", "keydown"].forEach(evt =>
        window.addEventListener(evt, unifiedCanvasHandler, { passive: false })
    );

    canvasSection.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) lastTouchY = e.touches[0].clientY;
    });

    canvasSection.addEventListener("touchmove", unifiedCanvasHandler, { passive: false });
    // === Canvas scroll-controlled animation end ===

    // footer section
    const redCard = document.getElementById("redCard");
    const headline = document.getElementById("headlineText");
    const historiaSection = document.getElementById("historia-section");

    // Set current year in copyright
    document.getElementById("year").textContent = new Date().getFullYear();

    // horihontal slider poiint and line 
    function connectPointsElement(p1, p2, line, containerEl) {
        const container = containerEl.getBoundingClientRect();
        const p1Rect = p1.getBoundingClientRect();
        const p2Rect = p2.getBoundingClientRect();
        const x1 = p1Rect.left + p1Rect.width / 2 - container.left;
        const y1 = p1Rect.top + p1Rect.height / 2 - container.top;
        const x2 = p2Rect.left + p2Rect.width / 2 - container.left;
        const y2 = p2Rect.top + p2Rect.height / 2 - container.top;
        const length = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        line.style.width = length + 'px';
        line.style.left = x1 + 'px';
        line.style.top = y1 + 'px';
        line.style.transform = `rotate(${angle}deg)`;
    }

    function drawLines() {
        document.querySelectorAll('.shining_star').forEach(container => {
            function safeConnect(pA, pB, line) {
                if (pA && pB && line) {
                    connectPointsElement(pA, pB, line, container);
                }
            }

            // Panel 1
            safeConnect(container.querySelector('.p1'), container.querySelector('.p2'), container.querySelector('.line1'));
            safeConnect(container.querySelector('.p2'), container.querySelector('.p3'), container.querySelector('.line2'));
            safeConnect(container.querySelector('.p3'), container.querySelector('.p4'), container.querySelector('.line3'));
            safeConnect(container.querySelector('.p4'), container.querySelector('.p5'), container.querySelector('.line4'));

            // Panel 2
            safeConnect(container.querySelector('.p11'), container.querySelector('.p12'), container.querySelector('.line11'));
            safeConnect(container.querySelector('.p12'), container.querySelector('.p13'), container.querySelector('.line12'));

            // Panel 3
            safeConnect(container.querySelector('.p21'), container.querySelector('.p22'), container.querySelector('.line21'));
            safeConnect(container.querySelector('.p22'), container.querySelector('.p23'), container.querySelector('.line22'));
            safeConnect(container.querySelector('.p23'), container.querySelector('.p24'), container.querySelector('.line23'));

            // Panel 4
            safeConnect(container.querySelector('.p31'), container.querySelector('.p32'), container.querySelector('.line31'));
            safeConnect(container.querySelector('.p32'), container.querySelector('.p33'), container.querySelector('.line32'));
            safeConnect(container.querySelector('.p33'), container.querySelector('.p34'), container.querySelector('.line33'));
            safeConnect(container.querySelector('.p34'), container.querySelector('.p35'), container.querySelector('.line34'));
        });
    }

    window.addEventListener('load', drawLines);
    window.addEventListener('resize', drawLines);
    window.addEventListener('scroll', drawLines);

    // infinites section end

    //banner section swiper slider start
    var length = $(".sec1 .swiper-slide").length;
    var startY = 0;

    // Trigger initial animation for first slide
    $(document).ready(function () {
        $(".swiper-slide").eq(0).find(".content").addClass("animate-in");
    });

    var swiper = new Swiper(".swiper-container-vertical-1", {
        direction: "vertical",
        effect: "fade", // Fade transition
        speed: 800,
        mousewheel: {
            releaseOnEdges: true,
            sensitivity: 1,
        },
        simulateTouch: true,
        touchReleaseOnEdges: true,
        on: {
            slideChange: function () {
                var idx = this.activeIndex;
                if (this.activeIndex != 0 && idx != length)
                    $.fn.fullpage.setAllowScrolling(false);
                if (length == 2 && idx == 0)
                    $.fn.fullpage.setAllowScrolling(false);
            },
            slideChangeTransitionEnd: function () {
                var idx = this.activeIndex;

                // Reset and animate only active slide's content
                $(".swiper-slide .content").removeClass("animate-in");
                $(".swiper-slide").eq(idx).find(".content").addClass("animate-in");

                if (idx == 0 || idx >= length - 1)
                    $.fn.fullpage.setAllowScrolling(true);
            },
            touchStart: function (e) {
                startY = e.touches.startY;
            },
            touchEnd: function (e) {
                if (startY - 10 > e.touches.currentY) {
                    swiper.slideNext();
                } else if (startY + 10 < e.touches.currentY) {
                    swiper.slidePrev();
                }
                console.log(startY, e.touches.currentY);
            },
        },
    });
    // banner section slider end

    function updateFoldedPaperPosition(index) {
        let topValue = "5%";
        if (index === 1) topValue = "20%";
        else if (index === 2) topValue = "35%";

        gsap.to(foldedPaper, {
            top: topValue,
            duration: 0.8,
            ease: "power2.out"
        });
    }

    function isInAniSection() {
        return document.querySelector('.fp-section.active #ani_text_section') !== null;
    }


    // vertical slider section start
    var length = $(".sec3 .swiper-slide").length;
    var startY = 0;

    var swiper2 = new Swiper(".swiper-container-vertical-2", {
        direction: "vertical",
        effect: "fade",
        speed: 1500,
        mousewheel: {
            releaseOnEdges: true,
            sensitivity: 1,
        },
        simulateTouch: true,
        touchReleaseOnEdges: true,
        pagination: {
            el: ".swiper-container-vertical-2 .swiper-pagination",
            clickable: true,
            type: "bullets",
        },
        on: {
            init: function () {
                updateFoldedPaperPosition(this.activeIndex);
            },

            slideChange: function () {
                const idx = this.activeIndex;
                updateFoldedPaperPosition(idx);

                // Disable fullpage scrolling for middle slides
                if ((idx !== 0 && idx !== length - 1) || (length === 2 && idx === 0)) {
                    fullpage_api.setAllowScrolling(false);
                }
            },

            slideChangeTransitionEnd: function () {
                const idx = this.activeIndex;

                // Enable fullpage scrolling at first and last slides
                if (idx === 0 || idx >= length - 1) {
                    fullpage_api.setAllowScrolling(true);
                }
            },

            touchStart: function (e) {
                startY = e.touches.startY;
            },

            touchEnd: function (e) {
                if (startY - 10 > e.touches.currentY) {
                    swiper2.slideNext();
                } else if (startY + 10 < e.touches.currentY) {
                    swiper2.slidePrev();
                }
                console.log(startY, e.touches.currentY);
            },
        },
    });

    // vertical slider section end

    // horizontal slider start 
    let inSwiperSection = false;
    let isScrolling = false;
    const swiper3 = new Swiper(".swiper-container-horizontal", {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 1500,
        allowTouchMove: false,
        resistanceRatio: 0,
        on: {
            init: function () {
                updateProgress(this.activeIndex, this.slides.length);
            },
            slideChange: function () {
                updateProgress(this.activeIndex, this.slides.length);
            }
        }
    });
    function updateProgress(index, total) {
        const percent = ((index + 1) / total) * 100;
        progressTop.css("width", percent + "%");
    }

    // horizontal slider end

    //masking section start
    $("#fullpage").fullpage({
        scrollingSpeed: 1500, // smoother than 1000
        easingcss3: "ease-in-out", // smooth acceleration/deceleration
        easing: "easeInOutCubic", // fallback easing
        touchSensitivity: 15,
        autoScrolling: true,
        scrollHorizontally: false,
        normalScrollElements: '.scrollable-content', //add a scrollable non-Fullpage.js controlled
        onLeave: function (origin, destination, direction) {
            const fromSection = origin.item;
            const toSection = destination.item;

            const isLeavingFoldedSection =
                fromSection.classList.contains("sec3") ||
                fromSection.querySelector('#ani_text_section');

            const isGoingToFoldedSection =
                toSection.classList.contains("sec3") ||
                toSection.querySelector('#ani_text_section');

            if (isLeavingFoldedSection && !isGoingToFoldedSection) {
                gsap.to(foldedPaper, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power1.out"
                });
            }

            if (fromSection.classList.contains("sec3") && toSection.querySelector('#ani_text_section')) {
                gsap.to(foldedPaper, {
                    top: "50%",
                    duration: 0.8,
                    ease: "power2.out"
                });
            }


            // animation text after canvas
            if (origin.item.classList.contains("section-animate")) {
                const titles = origin.item.querySelectorAll(".scroll-title");

                // Exit animation: move from top to bottom
                gsap.to(titles, {
                    opacity: 0,
                    y: 100,
                    duration: 0.8,
                    ease: "power3.inOut",
                    stagger: 0.2
                });
            }

            // canvas section
            if (origin.item.id === "canvas-section") {
                fullpage_api.setAllowScrolling(true);
                document.body.classList.remove("canvas-active");
            }

            // footer section scroll logic start
            // historia-section scroll logic
            if (origin.item.id === "historia-section") {
                redCard.classList.remove("scrolled");
                headline.classList.remove("behind");
            }

            if (destination.item.id === "historia-section") {
                setTimeout(() => {
                    redCard.classList.add("scrolled");
                    headline.classList.add("behind");
                }, 1000);
            }

            if (origin.item.classList.contains("video-scale-section")) {
                if (direction === "down" && !videoFinished) return false;
                if (direction === "up" && videoStarted) return false;
            }
            if (origin && origin.item.id === "canvas-section") {
                fullpage_api.setAllowScrolling(true);
            }

            const currentSection = origin.item;
            // masking section end
            // If we're in the swiper section
            if (currentSection.id === "sec3") {
                // Going down and NOT on last slide
                if (direction === "down" && !swiper.isEnd) {
                    swiper.slideNext();
                    return false; // Cancel fullPage scroll
                }

                // Going up and NOT on first slide
                if (direction === "up" && !swiper.isBeginning) {
                    swiper.slidePrev();
                    return false; // Cancel fullPage scroll
                }
            }
            // video section 
            // Block scrolling IF video hasn’t finished
            const videoSection_15_video = document.getElementById('videoSection_15_video');
            if (currentSection.id === 'videoSection_15' && !videoSection_15_video.ended) {
                // Prevent scroll
                return false;
            }

            //bulb section start

            const fromId = origin.item.id;
            const toId = destination.item.id;


            // Completely hide .drop if going to any other section
            const validSections = [
                "drop_Section",
                "drop_zoom_section",
                "bulb_section",
            ];
            if (!validSections.includes(toId)) {
                gsap.to(".drop", {
                    opacity: 0,
                    duration: 0.5,
                    overwrite: "auto",
                });
                return;
            }

            // --- DROP SECTION ---
            if (toId === "drop_Section") {
                if (direction === "up") {
                    // Scrolling UP into drop_Section → hide at top
                    gsap.to(".drop", {
                        top: "-6%",
                        opacity: 0,
                        scale: 1,
                        duration: 1,
                        ease: "power1.inOut",
                        overwrite: "auto",
                    });
                } else {
                    // Scroll down handled in afterLoad
                }
            }

            // --- DROP ZOOM SECTION ---
            if (toId === "drop_zoom_section") {
                if (direction === "up" && fromId === "bulb_section") {
                    // Scroll up from bulb: small scale
                    gsap.to(".drop", {
                        top: "40%",
                        opacity: 0.5,
                        scale: 2.5,
                        duration: 1,
                        ease: "power1.inOut",
                        overwrite: "auto",
                    });
                } else {
                    // Normal zoom on scroll down
                    gsap.to(".drop", {
                        top: "40%",
                        opacity: 0.5,
                        scale: 2.5,
                        duration: 1,
                        ease: "power1.inOut",
                        overwrite: "auto",
                    });
                }
            }

            // --- BULB SECTION ---
            if (toId === "bulb_section") {
                gsap.to(".drop", {
                    top: "85%",
                    opacity: 0,
                    scale: 0.3,
                    duration: 1,
                    ease: "power1.inOut",
                    overwrite: "auto",
                });
            }

            if (destination.item.id === "hz_section" && direction === "down") {
                // Entering the horizontal section
                inSwiperSection = true;
                fullpage_api.setAllowScrolling(false);
            }

            if (origin.item.id === "hz_section" && !inSwiperSection) {
                // Exiting the horizontal section
                fullpage_api.setAllowScrolling(true);
            }
        },
        // bulb section end
        afterLoad: function (origin, destination, direction) {
            section = destination.item;

            // const section = destination.item;

            const isSliderOrAniSection =
                section.classList.contains("sec3") ||
                section.querySelector('#ani_text_section');

            if (isSliderOrAniSection) {
                gsap.to(foldedPaper, {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
            }

            if (section.classList.contains("sec3")) {
                updateFoldedPaperPosition(swiper2.activeIndex);
            }

            // animation text after canvas
            if (destination.item.classList.contains("section-animate")) {
                const titles = destination.item.querySelectorAll(".scroll-title");

                // Reset to below
                gsap.set(titles, { opacity: 0, y: 100 });

                // Entrance animation: move from bottom to top
                gsap.to(titles, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.2
                });
            }

            // video section
            if (section.id === "videoSection_15") {
                const videoSection_15_video = document.getElementById(
                    "videoSection_15_video"
                );
                // Prevent scrolling until video finishes
                fullpage_api.setAllowScrolling(false);
                videoSection_15_video.play(); // Start playing the video
                videoSection_15_video.addEventListener("ended", function () {
                    fullpage_api.setAllowScrolling(true); // Re-enable scrolling when the video ends
                });
            }
            // horizontal slider section
            if (section.id === "hz_section") {
                inSwiperSection = true; // Set flag indicating we are in the horizontal swiper section
                fullpage_api.setAllowScrolling(false); // Lock vertical scrolling for horizontal interaction
            } else {
                inSwiperSection = false; // We're not in the swiper section
                fullpage_api.setAllowScrolling(true);  // Allow normal vertical scrolling
            }
            // === Canvas scroll-controlled animation start ===
            if (destination.item.id === "canvas-section") {
                fullpage_api.setAllowScrolling(false);
                document.body.classList.add("canvas-active");

                if (!isAnimating) {
                    if (direction === "down" && currentFrameIndex < totalFrames) {
                        playFrames(currentFrameIndex, totalFrames, 1, () => {
                            if (currentFrameIndex === totalFrames) {
                                fullpage_api.setAllowScrolling(true);
                                fullpage_api.moveSectionDown();
                            }
                        });
                    } else if (direction === "up" && currentFrameIndex > 1) {
                        playFrames(currentFrameIndex, 1, -1, () => {
                            if (currentFrameIndex === 1) {
                                fullpage_api.setAllowScrolling(true);
                                fullpage_api.moveSectionUp();
                            }
                        });
                    }
                }
            }
            // === Canvas scroll-controlled animation end ===
        },
    });

    let isAnimating = false;



    // Mousewheel for the Swiper
    let touchStartY = 0;
    let lastTouchY = 0;
    let touchStartX = 0;
    let lastTouchX = 0;

    // 👇 SCROLL / TOUCH EFFECT FOR INFINITES SECTION 👇
    (function () {
        const infinitesSection = document.getElementById("normalScrollSection");
        const heroText = infinitesSection.querySelector(".hero-text");
        const spans = heroText.querySelectorAll("span");

        let scrollTimeout;

        function animateInfinitesOnScroll() {
            if (!infinitesSection.classList.contains("active")) return;

            gsap.fromTo(spans, {
                x: 0,
                y: 0,
                rotation: 0,
                opacity: 1
            }, {
                x: () => gsap.utils.random(-35, 35),
                y: () => gsap.utils.random(-100, 100),
                rotation: () => gsap.utils.random(-60, 60),
                duration: 1,
                ease: "power1.out",
                stagger: 0.03,
                onComplete: () => {
                    gsap.to(spans, {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        duration: 1,
                        ease: "power2.out"
                    });
                }
            });
        }

        infinitesSection.addEventListener("wheel", () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                animateInfinitesOnScroll();
            }, 20);
        }, { passive: true });

        let touchStartY = 0;
        infinitesSection.addEventListener("touchstart", (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        infinitesSection.addEventListener("touchend", (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            if (Math.abs(touchEndY - touchStartY) > 10) {
                animateInfinitesOnScroll();
            }
        }, { passive: true });
    })();


    foldedPaper.addEventListener('mouseenter', () => {
        if (!isInAniSection() || videoIsPlaying) return;

        floatingText.style.opacity = 1;

        paperVideo.classList.add('fullscreen');
        paperVideo.style.opacity = 1;
        paperVideo.currentTime = 0;

        const playPromise = paperVideo.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                videoIsPlaying = true;
                fullpage_api.setAllowScrolling(false);
                fullpage_api.setKeyboardScrolling(false);
                gsap.to(foldedPaper, {
                    opacity: 0,
                    duration: 0.3,
                    ease: "power1.out"
                });
            }).catch((err) => {
                console.error('Video playback failed:', err);
            });
        }
    });

    foldedPaper.addEventListener('mouseleave', () => {
        floatingText.style.opacity = 0;
    });

    paperVideo.addEventListener('ended', () => {
        paperVideo.pause();
        paperVideo.classList.remove('fullscreen');
        paperVideo.style.opacity = 0;
        videoIsPlaying = false;
        fullpage_api.setAllowScrolling(true);
        fullpage_api.setKeyboardScrolling(true);
        gsap.to(foldedPaper, {
            opacity: 1,
            duration: 0.3,
            ease: "power1.out"
        });
    });


    ["wheel", "touchstart", "touchmove", "keydown"].forEach((eventName) => {
        document.getElementById("hz_section").addEventListener(eventName, function (e) {
            if (!inSwiperSection || isScrolling) return;

            // Prevent only if needed
            let delta = 0;

            if (eventName === "wheel") {
                e.preventDefault();
                delta = e.deltaY;
            }

            else if (eventName === "touchstart") {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
                lastTouchY = touchStartY;
                lastTouchX = touchStartX;
            }

            else if (eventName === "touchmove") {
                const currentY = e.touches[0].clientY;
                const currentX = e.touches[0].clientX;

                const diffY = Math.abs(currentY - touchStartY);
                const diffX = Math.abs(currentX - touchStartX);

                // Only trigger swiper scroll if vertical swipe is dominant
                if (diffY > diffX) {
                    e.preventDefault(); // disable browser scroll

                    delta = currentY > lastTouchY ? -1 : 1;
                    lastTouchY = currentY;
                } else {
                    return; // ignore horizontal swipes
                }
            }

            else if (eventName === "keydown") {
                e.preventDefault();
                if (e.key === "ArrowDown" || e.key === "PageDown") delta = 1;
                if (e.key === "ArrowUp" || e.key === "PageUp") delta = -1;
            }

            if (delta === 0) return;

            isScrolling = true;

            if (delta > 0) {
                if (swiper3.isEnd) {
                    inSwiperSection = false;
                    fullpage_api.setAllowScrolling(true);
                    fullpage_api.moveSectionDown();
                } else {
                    swiper3.slideNext();
                }
            } else if (delta < 0) {
                if (swiper3.isBeginning) {
                    inSwiperSection = false;
                    fullpage_api.setAllowScrolling(true);
                    fullpage_api.moveSectionUp();
                } else {
                    swiper3.slidePrev();
                }
            }

            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }, { passive: false });
    });


    // let lastTouchY = 0;

    ["wheel", "touchmove", "keydown"].forEach((eventName) => {
        videoSection.addEventListener(eventName, function (e) {
            e.preventDefault();

            if (videoStarted && !videoFinished) return;

            let delta = 0;

            if (eventName === "wheel") {
                delta = e.deltaY;
            } else if (eventName === "touchmove") {
                const currentY = e.touches[0].clientY;
                delta = currentY > lastTouchY ? -1 : 1;
                lastTouchY = currentY;
            } else if (eventName === "keydown") {
                if (e.key === "ArrowDown" || e.key === "PageDown") delta = 1;
                if (e.key === "ArrowUp" || e.key === "PageUp") delta = -1;
            }


            // Animation logic...
            if (delta > 0 && scale < maxScale) {
                scale += 0.1;
            } else if (delta < 0 && scale > minScale) {
                scale -= 0.1;
            }

            scale = Math.max(minScale, Math.min(maxScale, scale));

            const progress = (scale - minScale) / (maxScale - minScale);

            const subheadingProgress = Math.min(progress / 0.4, 1);
            const subOpacity = 1 - subheadingProgress;
            const subScale = 1 + subheadingProgress * 0.5;

            const headingProgress = Math.max((progress - 0.4) / 0.6, 0);
            const headingOpacity = 1 - headingProgress;
            const headingScale = 1 + headingProgress * 2;

            gsap.to(maskedHeading, {
                scale: headingScale,
                opacity: headingOpacity,
                duration: 0.3,
                ease: "power2.out",
            });

            [topSub, bottomSub].forEach((el) => {
                gsap.to(el, {
                    scale: subScale,
                    opacity: subOpacity,
                    duration: 0.3,
                    ease: "power2.out",
                });
            });

            gsap.to(bgVideo, {
                opacity: progress,
                duration: 0.3,
                ease: "power2.out",
            });

            if (progress >= 1 && !videoStarted) {
                bgVideo.play();
                videoStarted = true;

                bgVideo.onended = () => {
                    videoFinished = true;
                    fullpage_api.setAllowScrolling(true);
                    fullpage_api.setKeyboardScrolling(true);
                };
            }

            if (progress <= 0 && videoStarted) {
                bgVideo.pause();
                videoStarted = false;
                videoFinished = false;
                gsap.to(bgVideo, { opacity: 0, duration: 0.3 });
            }


        }, { passive: false });
    });

    //end mashking---------------



    // Typed.js Text Animation start
    var typed = new Typed(".dtq-typed-text", {
        strings: ["la historia", "|", "tu historia", "|"],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        loop: true,
        cursorChar: "",
    });
    // Typed.js Text Animation end

    // Get the video and overlay text elements start
    const overlayTextEl2 = document.getElementById("videoOverlayText2");
    const videoSection_15_video = document.getElementById(
        "videoSection_15_video"
    );

    // Define timed text cues for the video
    const textCues = [
        { start: 1, end: 5, text: "AHORA SON" },
        // Add more cues here as needed
    ];

    // Define timed text cues for the video section 
    const textCues2 = [
        {
            start: 2,
            end: 6,
            text: "<span class='text_128 text_bold'>AHORA SON..</span>",
        },
        {
            start: 12,
            end: 15,
            text: "<span class='text_128 text_bold'>EXPLORADORES</span>",
        },
        {
            start: 16,
            end: 20,
            text: "<span class='text_96'>Y así captamos y<br>mantenemos su atención</span>",
        },
        {
            start: 22,
            end: 24,
            text: "<span class='text_96'>durante más tiempo y de<br>manera más eficaz</span>",
        },
        {
            start: 25,
            end: 27,
            text: "<span class='text_96 text_bold'>Gracias al...</span>",
        },
        {
            start: 28,
            end: 31,
            text: "<span class='text_96 text_bold'>EFECTO SORPRESA</span>",
        },
        {
            start: 32,
            end: 35,
            text: "<span class='text_96 text_bold'>(y sorprendente)</span>",
        },
        // Add more cues here as needed
    ];
    // Get the video and overlay text elements end

    // Check during video playback
    videoSection_15_video.addEventListener("timeupdate", () => {
        const currentTime = videoSection_15_video.currentTime;
        let activeCue2 = null;

        for (const cue of textCues2) {
            if (currentTime >= cue.start && currentTime <= cue.end) {
                activeCue2 = cue;
                break;
            }
        }

        if (activeCue2) {
            // Only update if text changes
            if (overlayTextEl2.innerHTML !== activeCue2.text) {
                overlayTextEl2.innerHTML = activeCue2.text;
            }
            overlayTextEl2.style.opacity = "1";
        } else {
            overlayTextEl2.style.opacity = "0";
        }
    });
    // text over videos end

});