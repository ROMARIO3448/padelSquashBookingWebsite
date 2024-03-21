import CircularArray from "/padelSquashBookingWebsite/scripts/CircularArray.js";

class DesktopGallerySlider {
    constructor(options) {
        this.$galleryContainer = $(options.galleryContainer);
        this.$galleryLeftPointer = $(options.galleryLeftPointer);
        this.$galleryRightPointer = $(options.galleryRightPointer);
        this.listOfImgSrcAndAlt = options.listOfImgSrcAndAlt;
        this.$galleryMain = $(options.galleryMain);

        this.circularArray = new CircularArray(this.listOfImgSrcAndAlt);

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.$galleryContainer.on("mouseenter", () => this.handleMouseEnter());
        this.$galleryContainer.on("mouseleave", () => this.handleMouseLeave());
        this.$galleryLeftPointer.on("click", () =>
            this.handleLeftPointerClick()
        );
        this.$galleryRightPointer.on("click", () =>
            this.handleRightPointerClick()
        );
    }

    handleMouseEnter() {
        this.$galleryLeftPointer.animate({ left: "0" }, "normal");
        this.$galleryRightPointer.animate({ right: "0" }, "normal");
    }

    handleMouseLeave() {
        this.$galleryLeftPointer.animate({ left: "-1rem" }, "normal");
        this.$galleryRightPointer.animate({ right: "-1rem" }, "normal");
    }

    handleLeftPointerClick() {
        const targetImageSrcAndAlt = this.circularArray.prev();
        this.updateGalleryMain(targetImageSrcAndAlt);
    }

    handleRightPointerClick() {
        const targetImageSrcAndAlt = this.circularArray.next();
        this.updateGalleryMain(targetImageSrcAndAlt);
    }

    updateGalleryMain(targetImageSrcAndAlt) {
        this.$galleryMain.attr("src", targetImageSrcAndAlt[0]);
        this.$galleryMain.attr("alt", targetImageSrcAndAlt[1]);
    }
}

export default DesktopGallerySlider;
