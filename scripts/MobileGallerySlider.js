import CircularArray from "/padelSquashBookingWebsite/scripts/CircularArray.js";

class MobileGallerySlider {
    constructor(options) {
        this.$galleryContainer = $(options.galleryContainer);
        this.$listOfImgSrcAndAlt = options.listOfImgSrcAndAlt;
        this.$galleryMain = $(options.galleryMain);
        this.$galleryPrev = $(options.galleryPrev);
        this.$galleryNext = $(options.galleryNext);

        this.isDragging = false;
        this.startX = 0;
        this.offsetX = 0;

        this.currentLeftForNext = this.$galleryNext.position().left;
        this.currentLeftForPrev = this.$galleryPrev.position().left;

        this.circularArrayForMain = new CircularArray(this.$listOfImgSrcAndAlt);
        this.circularArrayForNext = new CircularArray(this.$listOfImgSrcAndAlt);
        this.circularArrayForPrev = new CircularArray(this.$listOfImgSrcAndAlt);

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.$galleryMain.one("touchstart", () =>
            this.onGalleryMainTouchStart()
        );
        this.$galleryContainer.on("touchstart", (e) =>
            this.onPreviewGalleryTouchStart(e)
        );
        $(document).on("touchmove", (e) => this.onTouchMove(e));
        $(document).on("touchend", () => this.onTouchEnd());
    }

    onGalleryMainTouchStart() {
        const targetImageSrcAndAltNext = this.circularArrayForNext.next();
        this.$galleryNext.attr("src", targetImageSrcAndAltNext[0]);
        this.$galleryNext.attr("alt", targetImageSrcAndAltNext[1]);

        const targetImageSrcAndAltPrev = this.circularArrayForPrev.prev();
        this.$galleryPrev.attr("src", targetImageSrcAndAltPrev[0]);
        this.$galleryPrev.attr("alt", targetImageSrcAndAltPrev[1]);
    }

    onPreviewGalleryTouchStart(e) {
        this.isDragging = true;
        this.startX = e.originalEvent.touches[0].clientX;
        this.offsetX = 0;
    }

    onTouchMove(e) {
        if (this.isDragging) {
            const currentX = e.originalEvent.touches[0].clientX;
            this.offsetX = currentX - this.startX;

            this.$galleryMain.css("left", `${this.offsetX}px`);
            this.$galleryNext.css(
                "left",
                `${this.currentLeftForNext + this.offsetX}px`
            );
            this.$galleryPrev.css(
                "left",
                `${this.currentLeftForPrev + this.offsetX}px`
            );
        }
    }

    onTouchEnd() {
        if (this.isDragging) {
            this.isDragging = false;

            const halfGalleryWidth = this.$galleryContainer.width() / 2;
            const isOffsetXBiggerThanHalfWidth =
                Math.abs(this.offsetX) > halfGalleryWidth;

            if (isOffsetXBiggerThanHalfWidth && this.offsetX > 0) {
                this.animateSlider("100%", "200%", "0")
                    .then(() => {
                        this.nextOrPrev("prev");
                        this.setDefaultCssForSlider();
                    })
                    .catch(this.errorHandler);
            } else if (isOffsetXBiggerThanHalfWidth && this.offsetX < 0) {
                this.animateSlider("-100%", "0", "-200%")
                    .then(() => {
                        this.nextOrPrev("next");
                        this.setDefaultCssForSlider();
                    })
                    .catch(this.errorHandler);
            } else {
                this.animateSlider()
                    .then(() => {})
                    .catch(this.errorHandler);
            }
        }
    }

    setDefaultCssForSlider() {
        this.$galleryMain.css("left", "0");
        this.$galleryNext.css("left", "100%");
        this.$galleryPrev.css("left", "-100%");
    }

    animateSlider(mainLeft = "0", nextLeft = "100%", prevLeft = "-100%") {
        const animateElement = ($element, left) => {
            return new Promise((resolve) => {
                $element.animate(
                    { left: left },
                    {
                        duration: 300,
                        step: (now) =>
                            $element.css({
                                left: now + "px",
                            }),
                        complete: () => {
                            $element.css("left", left);
                            resolve();
                        },
                    }
                );
            });
        };
        const promises = [
            animateElement(this.$galleryMain, mainLeft),
            animateElement(this.$galleryNext, nextLeft),
            animateElement(this.$galleryPrev, prevLeft),
        ];

        return Promise.all(promises);
    }

    nextOrPrev(nextOrPrev) {
        const elementsToUpdate = [
            { array: this.circularArrayForNext, element: this.$galleryNext },
            { array: this.circularArrayForPrev, element: this.$galleryPrev },
            { array: this.circularArrayForMain, element: this.$galleryMain },
        ];

        elementsToUpdate.forEach(({ array, element }) => {
            const [src, alt] = array[nextOrPrev]();
            element.attr("src", src);
            element.attr("alt", alt);
        });
    }

    errorHandler(error) {
        console.error("Error:", error.message);
    }
}

export default MobileGallerySlider;
