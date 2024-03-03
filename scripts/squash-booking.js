import MobileGallerySlider from "/padelSquashBookingWebsite/scripts/MobileGallerySlider.js";
import DesktopGallerySlider from "/padelSquashBookingWebsite/scripts/DesktopGallerySlider.js";
import {
    openingHours,
    openingHoursForDesktop,
} from "/padelSquashBookingWebsite/scripts/opening-hours-for-timetable.js";
import TimetableHandler from "/padelSquashBookingWebsite/scripts/TimetableHandler.js";
import DatepickerHandler from "/padelSquashBookingWebsite/scripts/DatepickerHandler.js";

jQuery(function () {
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

    const optionsForDesktopGallerySlider = {
        galleryContainer: ".preview__gallery",
        listOfImgSrcAndAlt,
        galleryMain: "#gallery__main",
        galleryLeftPointer: "#gallery__left-pointer",
        galleryRightPointer: "#gallery__right-pointer",
    };
    const desktopGallerySlider = new DesktopGallerySlider(
        optionsForDesktopGallerySlider
    );

    const optionsForMobileGallerySlider = {
        galleryContainer: ".preview__gallery",
        listOfImgSrcAndAlt,
        galleryMain: "#gallery__main",
        galleryPrev: "#gallery__prev",
        galleryNext: "#gallery__next",
    };
    const mobileGallerySlider = new MobileGallerySlider(
        optionsForMobileGallerySlider
    );

    const datepickerHandler = new DatepickerHandler();

    let device = "mobile";
    if ($(".header-template__burger").css("display") === "none") {
        device = "desktop";
    }
    const optionsForTimetableHandler = {
        openingHours,
        openingHoursForDesktop,
        device,
        timetableDatepicker: datepickerHandler,
    };
    const timetableHandler = new TimetableHandler(optionsForTimetableHandler);
});
