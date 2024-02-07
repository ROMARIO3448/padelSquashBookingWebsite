import CircularArray from "/padelSquashBookingWebsite/scripts/CircularArray.js";

jQuery(function () {
    const previewGallery = $(".preview__gallery");
    const galleryLeftPointer = $(".gallery__left-pointer");
    const galleryRightPointer = $(".gallery__right-pointer");
    previewGallery.on("mouseenter", function () {
        galleryLeftPointer.toggleClass("hovered");
        galleryRightPointer.toggleClass("hovered");
        galleryLeftPointer.animate({ left: "0" }, "normal");
        galleryRightPointer.animate({ right: "0" }, "normal");
    });

    previewGallery.on("mouseleave", function () {
        galleryLeftPointer.animate({ left: "-1em" }, "normal", function () {
            galleryLeftPointer.toggleClass("hovered");
        });
        galleryRightPointer.animate({ right: "-1em" }, "normal", function () {
            galleryRightPointer.toggleClass("hovered");
        });
    });

    const listOfImgSrcAndAlt = [
        [
            "/padelSquashBookingWebsite/assets/squash_court1.png",
            "First squash court",
        ],
        [
            "/padelSquashBookingWebsite/assets/squash_court2.png",
            "Second squash court",
        ],
        [
            "/padelSquashBookingWebsite/assets/squash_shower.png",
            "Squash shower",
        ],
        [
            "/padelSquashBookingWebsite/assets/squash_locker_room.png",
            "Squash locker room",
        ],
    ];
    const circularArray = new CircularArray(listOfImgSrcAndAlt);
    const galleryMain = $(".gallery__main");

    galleryLeftPointer.on("click", function () {
        const targetImageSrcAndAlt = circularArray.prev();
        galleryMain.attr("src", targetImageSrcAndAlt[0]);
        galleryMain.attr("alt", targetImageSrcAndAlt[1]);
    });
    galleryRightPointer.on("click", function () {
        const targetImageSrcAndAlt = circularArray.next();
        galleryMain.attr("src", targetImageSrcAndAlt[0]);
        galleryMain.attr("alt", targetImageSrcAndAlt[1]);
    });

    /*DRAGGING BEHAVIOR*/
    const circularArrayForMain = new CircularArray(listOfImgSrcAndAlt);
    const circularArrayForNext = new CircularArray(listOfImgSrcAndAlt);
    const circularArrayForPrev = new CircularArray(listOfImgSrcAndAlt);

    const galleryPrev = $(".gallery__prev");
    const galleryNext = $(".gallery__next");

    const gallery = $(".gallery");
    let isDragging = false;
    let startX = 0;
    let offsetX = 0;
    const currentLeftForNext = galleryNext.position().left;
    const currentLeftForPrev = galleryPrev.position().left;

    galleryMain.one("touchstart", function () {
        const targetImageSrcAndAltNext = circularArrayForNext.next();
        galleryNext.attr("src", targetImageSrcAndAltNext[0]);
        galleryNext.attr("alt", targetImageSrcAndAltNext[1]);

        const targetImageSrcAndAltPrev = circularArrayForPrev.prev();
        galleryPrev.attr("src", targetImageSrcAndAltPrev[0]);
        galleryPrev.attr("alt", targetImageSrcAndAltPrev[1]);
    });

    gallery.on("touchstart", (e) => {
        isDragging = true;
        startX = e.originalEvent.touches[0].clientX;
        offsetX = 0;
    });

    $(document).on("touchmove", (e) => {
        if (isDragging) {
            const currentX = e.originalEvent.touches[0].clientX;
            offsetX = currentX - startX;

            galleryMain.css("left", `${offsetX}px`);
            galleryNext.css("left", `${currentLeftForNext + offsetX}px`);
            galleryPrev.css("left", `${currentLeftForPrev + offsetX}px`);
        }
    });

    function setDefaultCssForSlider() {
        galleryMain.css("left", "0");
        galleryNext.css("left", "100%");
        galleryPrev.css("left", "-100%");
    }

    function animateSlider(
        mainLeft = "0",
        nextLeft = "100%",
        prevLeft = "-100%"
    ) {
        const mainPromise = new Promise((resolve) => {
            galleryMain.animate(
                { left: mainLeft },
                {
                    duration: 300,
                    step: function (now) {
                        $(this).css({
                            left: now + "px",
                        });
                    },
                    complete: () => {
                        galleryMain.css("left", mainLeft);
                        resolve();
                    },
                }
            );
        });

        const nextPromise = new Promise((resolve) => {
            galleryNext.animate(
                { left: nextLeft },
                {
                    duration: 300,
                    step: function (now) {
                        $(this).css({
                            left: now + "px",
                        });
                    },
                    complete: () => {
                        galleryNext.css("left", nextLeft);
                        resolve();
                    },
                }
            );
        });

        const prevPromise = new Promise((resolve) => {
            galleryPrev.animate(
                { left: prevLeft },
                {
                    duration: 300,
                    step: function (now) {
                        $(this).css({
                            left: now + "px",
                        });
                    },
                    complete: () => {
                        galleryPrev.css("left", prevLeft);
                        resolve();
                    },
                }
            );
        });

        return Promise.all([mainPromise, nextPromise, prevPromise]);
    }

    function nextOrPrev(nextOrPrev) {
        let targetImageSrcAndAltNext;
        let targetImageSrcAndAltPrev;
        let targetImageSrcAndAltMain;
        switch (nextOrPrev) {
            case "next":
                targetImageSrcAndAltNext = circularArrayForNext.next();
                galleryNext.attr("src", targetImageSrcAndAltNext[0]);
                galleryNext.attr("alt", targetImageSrcAndAltNext[1]);

                targetImageSrcAndAltPrev = circularArrayForPrev.next();
                galleryPrev.attr("src", targetImageSrcAndAltPrev[0]);
                galleryPrev.attr("alt", targetImageSrcAndAltPrev[1]);

                targetImageSrcAndAltMain = circularArrayForMain.next();
                galleryMain.attr("src", targetImageSrcAndAltMain[0]);
                galleryMain.attr("alt", targetImageSrcAndAltMain[1]);
                break;
            case "prev":
                targetImageSrcAndAltNext = circularArrayForNext.prev();
                galleryNext.attr("src", targetImageSrcAndAltNext[0]);
                galleryNext.attr("alt", targetImageSrcAndAltNext[1]);

                targetImageSrcAndAltPrev = circularArrayForPrev.prev();
                galleryPrev.attr("src", targetImageSrcAndAltPrev[0]);
                galleryPrev.attr("alt", targetImageSrcAndAltPrev[1]);

                targetImageSrcAndAltMain = circularArrayForMain.prev();
                galleryMain.attr("src", targetImageSrcAndAltMain[0]);
                galleryMain.attr("alt", targetImageSrcAndAltMain[1]);
                break;
            default:
                break;
        }
    }

    const errorHandler = (error) => {
        console.error("Error:", error.message);
    };

    $(document).on("touchend", () => {
        if (isDragging) {
            isDragging = false;

            const halfGalleryWidth = gallery.width() / 2;
            const isOffsetXBiggerThanHalfWidth =
                Math.abs(offsetX) > halfGalleryWidth;

            if (isOffsetXBiggerThanHalfWidth && offsetX > 0) {
                animateSlider("100%", "200%", "0")
                    .then(() => {
                        nextOrPrev("prev");
                        setDefaultCssForSlider();
                    })
                    .catch(errorHandler);
            } else if (isOffsetXBiggerThanHalfWidth && offsetX < 0) {
                animateSlider("-100%", "0", "-200%")
                    .then(() => {
                        nextOrPrev("next");
                        setDefaultCssForSlider();
                    })
                    .catch(errorHandler);
            } else {
                animateSlider()
                    .then(() => {
                        console.log("All animations have completed");
                    })
                    .catch(errorHandler);
            }
        }
    });
});
