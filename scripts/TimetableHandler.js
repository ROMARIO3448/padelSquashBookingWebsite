import DateFormatterForTimetable from "/padelSquashBookingWebsite/scripts/DateFormatterForTimetable.js";
import RedirectHandler from "/padelSquashBookingWebsite/scripts/RedirectHandler.js";
import ObjectUtils from "/padelSquashBookingWebsite/scripts/ObjectUtils.js";

class TimetableHandler {
    constructor(options) {
        this.openingHours = options.openingHours;
        this.openingHoursForDesktop = options.openingHoursForDesktop;
        this.device = options.device;
        this.isMobile = this.device === "mobile";
        this.$timetableElement = $(".timetable__opening-hours");
        this.stepOfDateOffset = 0;
        this.dateFormatter = DateFormatterForTimetable.getDateInDMYFormat;
        this.requestedDate = this.dateFormatter(this.stepOfDateOffset);
        this.cachedTimetable = {};
        this.isAjaxInProgress = false;
        this.timetableAction = "squash_booking/init_timetable";

        /*ObjectUtils functions*/
        this.hasAnyKeyInObj = ObjectUtils.hasAnyKeyInObj;
        this.isObjEmpty = ObjectUtils.isObjEmpty;

        /*Arrow-pointer selectors*/
        this.mobileArrowLeftSelector =
            "ul:first-child li:first-child div:nth-child(1)";
        this.mobileArrowRightSelector =
            "ul:first-child li:first-child div:nth-child(3)";
        this.desktopArrowSelector = ".timetable__arrow-pointer";
        /*Selectors for touchable elements in Timetable*/
        this.mobileTouchableSelector = "ul li:not(:first-child):not(.disabled)";
        this.desktopTouchableSelector =
            "ul:not(:first-child):not(:last-child) li:not(:first-child):not(.disabled)";
        /*Left arrow-pointer full selectors*/
        this.mobileArrowLeftFullSelector =
            ".timetable__opening-hours ul:first-child li:first-child div:nth-child(1)";
        this.desktopArrowLeftFullSelector =
            ".timetable__opening-hours ul:first-child li:first-child";

        /*Datepicker*/
        this.timetableDatepicker = options.timetableDatepicker;
        this.datepickerElementSelector =
            ".timetable__opening-hours ul:first-child li:first-child div:nth-child(2) input";
        this.datepickerElem;

        /*Cache booked slots*/
        this.alreadyChosenSlots = {};

        /*Timetable book-action*/
        this.$timetableBookingInfoElement = $(
            ".timetable__book-action div:first-child > div span"
        );
        this.$timetableBookButtonElement = $(
            ".timetable__book-action > div:last-child"
        );
        this.$touchscreenIconElement = $(
            ".timetable__book-action > div:first-child > div img"
        );
        this.bookingInfoText = [
            "To book, select a time",
            "Select a convenient time for classes and click “Book”",
        ];
        this.initTimetableBookingInfoElement();
        this.timetableAvailabilityAction =
            "squash_booking/check_timetable_slots";

        this.setupEventListeners();
        this.fetchTimetableData();
    }
    /*----------------------------------------------------------------*/
    setupBookButtonClickListener() {
        const fetchAreSelectedSlotsStillAvailable = (slotsToCheck) => {
            $.ajax({
                url: this.timetableAvailabilityAction,
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({ slotsToCheck }),
                success: (response, textStatus, jqXHR) => {
                    this.isAjaxInProgress = false;
                    if (jqXHR.status === 201)
                        RedirectHandler.redirectToPaymentPage();
                },
                error: this.handleTimetableError.bind(this),
            });
        };
        this.$timetableBookButtonElement.on("click", () => {
            if (this.isObjEmpty(this.alreadyChosenSlots)) {
                return;
            }
            if (this.isAjaxInProgress) {
                return;
            }
            const objWithTimestamps = this.convertIndexesToTimestamps(
                this.alreadyChosenSlots
            );
            fetchAreSelectedSlotsStillAvailable(objWithTimestamps);
            this.isAjaxInProgress = true;
        });
    }
    convertIndexesToTimestamps(objWithIndexes) {
        const objWithTimestamps = {};
        for (const date in objWithIndexes) {
            if (objWithIndexes.hasOwnProperty(date)) {
                const timestamps = objWithIndexes[date].map((index) => {
                    return this.openingHours[index - 1];
                });
                objWithTimestamps[date] = timestamps;
            }
        }
        return objWithTimestamps;
    }
    /*----------------------------------------------------------------*/
    initTimetableBookingInfoElement() {
        if (!this.isMobile)
            this.$timetableBookingInfoElement.text(this.bookingInfoText[1]);
    }
    setupTimetableBookField(isMobile, priceInEuro = 25) {
        const handleEmptySlots = () => {
            this.$timetableBookingInfoElement.text(
                isMobile ? this.bookingInfoText[0] : this.bookingInfoText[1]
            );
            if (isMobile) {
                this.$touchscreenIconElement.show();
            }
            this.$timetableBookButtonElement.removeClass("active");
        };
        const calculateBookedSlots = () => {
            let amountOfBookedSlots = 0;
            for (const date in this.alreadyChosenSlots) {
                if (this.alreadyChosenSlots.hasOwnProperty(date)) {
                    amountOfBookedSlots += this.alreadyChosenSlots[date].length;
                }
            }
            return amountOfBookedSlots;
        };
        const handleBookedSlots = () => {
            if (isMobile) {
                this.$touchscreenIconElement.hide();
            }
            this.$timetableBookButtonElement.addClass("active");
            const amountOfBookedSlots = calculateBookedSlots();
            const totalPrice = priceInEuro * amountOfBookedSlots;
            this.$timetableBookingInfoElement.text(
                `Selected ${amountOfBookedSlots / 2} hours for ${totalPrice}€`
            );
        };
        if (this.isObjEmpty(this.alreadyChosenSlots)) {
            handleEmptySlots();
        } else {
            handleBookedSlots();
        }
    }
    /*----------------------------------------------------------------*/
    getDateFromUl($element, isMobile, isParent) {
        const firstUlChild = isParent
            ? $element.children(":first")
            : $element.parent().children(":first");
        return isMobile
            ? firstUlChild.find("input").val()
            : firstUlChild.text();
    }
    cacheTouchedLiData(event, isMobile) {
        const updateAlreadyChosenSlots = (selectedDate, index) => {
            if (!this.alreadyChosenSlots?.[selectedDate]) {
                this.alreadyChosenSlots[selectedDate] = [];
            }
            if (this.alreadyChosenSlots[selectedDate].includes(index)) {
                removeIndexFromChosenSlots(selectedDate, index);
            } else {
                this.alreadyChosenSlots[selectedDate].push(index);
            }
        };
        const removeIndexFromChosenSlots = (selectedDate, index) => {
            if (this.alreadyChosenSlots[selectedDate].length === 1) {
                delete this.alreadyChosenSlots[selectedDate];
                return;
            }
            const indexToRemove =
                this.alreadyChosenSlots[selectedDate].indexOf(index);
            this.alreadyChosenSlots[selectedDate].splice(indexToRemove, 1);
        };
        const $currentTarget = $(event.currentTarget);
        const index = $currentTarget.index();
        const selectedDate = this.getDateFromUl($currentTarget, isMobile);
        updateAlreadyChosenSlots(selectedDate, index);
    }
    renderAlreadyChosenSlots(isMobile) {
        const toggleTouchedLi = ($ulElement, indexes) => {
            indexes.forEach((indexOfTouchedLi) => {
                $ulElement
                    .children()
                    .eq(indexOfTouchedLi)
                    .toggleClass("touched");
            });
        };
        if (
            this.isObjEmpty(this.alreadyChosenSlots) ||
            !this.hasAnyKeyInObj(
                this.getTimetableDatesToCheck(),
                this.alreadyChosenSlots
            )
        ) {
            return;
        }
        const $ulElements = isMobile
            ? this.$timetableElement.find("ul")
            : this.$timetableElement.find(
                  "ul:not(:first-child):not(:last-child)"
              );
        $ulElements.each((index, ulElement) => {
            const $ulElement = $(ulElement);
            const dateFromUl = this.getDateFromUl($ulElement, isMobile, true);
            if (this.alreadyChosenSlots.hasOwnProperty(dateFromUl)) {
                toggleTouchedLi(
                    $ulElement,
                    this.alreadyChosenSlots[dateFromUl]
                );
            }
        });
    }
    /*----------------------------------------------------------------*/
    setupEventListeners() {
        this.setupToggleTouchedClassEventListener(this.isMobile);
        this.setupArrowPointerEventListeners(this.isMobile);
        this.setupBookButtonClickListener();
    }
    setupToggleTouchedClassEventListener(isMobile) {
        const eventSelector = isMobile
            ? this.mobileTouchableSelector
            : this.desktopTouchableSelector;
        this.$timetableElement.on("click", eventSelector, (event) => {
            event.currentTarget.classList.toggle("touched");
            this.cacheTouchedLiData(event, isMobile);
            this.setupTimetableBookField(isMobile);
        });
    }
    updateDateAndFetchTimetableData(offset, diffInDays) {
        if (this.isAjaxInProgress) {
            return;
        }
        this.stepOfDateOffset =
            diffInDays !== undefined
                ? diffInDays
                : this.stepOfDateOffset + offset;
        this.requestedDate = this.dateFormatter(this.stepOfDateOffset);
        this.fetchTimetableData();
    }
    setupMobileArrowPointerEventListeners() {
        this.$timetableElement.on("click", this.mobileArrowLeftSelector, () => {
            this.updateDateAndFetchTimetableData(-1);
        });
        this.$timetableElement.on(
            "click",
            this.mobileArrowRightSelector,
            () => {
                this.updateDateAndFetchTimetableData(1);
            }
        );
    }
    setupDesktopArrowPointerEventListener() {
        this.$timetableElement.on(
            "click",
            this.desktopArrowSelector,
            (event) => {
                const outerText = event.currentTarget.textContent;
                const offset =
                    outerText === ">" ? 7 : outerText === "<" ? -7 : 0;
                this.updateDateAndFetchTimetableData(offset);
            }
        );
    }
    setupArrowPointerEventListeners(isMobile) {
        if (isMobile) {
            this.setupMobileArrowPointerEventListeners();
            return;
        }
        this.setupDesktopArrowPointerEventListener();
    }
    /*----------------------------------------------------------------*/
    initTimetableDatepicker() {
        this.setTimetableDatepicker();
        this.timetableDatepicker.initDatepicker();
        this.setupDatepickerOnSelectEventListener();
    }
    setTimetableDatepicker() {
        this.timetableDatepicker.datepickerSelector =
            this.datepickerElementSelector;
    }
    setupDatepickerOnSelectEventListener() {
        this.datepickerElem = this.timetableDatepicker.datepicker;
        this.datepickerElem.on(
            this.timetableDatepicker.onSelectEventName,
            () => {
                this.updateDateAndFetchTimetableData(
                    undefined,
                    this.timetableDatepicker.diffInDays
                );
            }
        );
    }
    /*----------------------------------------------------------------*/
    getTimetableDatesToCheck() {
        const timetableDatesToCheck = [
            this.dateFormatter(this.stepOfDateOffset),
        ];
        if (!this.isMobile) {
            for (let i = 1; i < 7; i++) {
                timetableDatesToCheck.push(
                    this.dateFormatter(this.stepOfDateOffset + i)
                );
            }
        }
        return timetableDatesToCheck;
    }
    canIUseCachedTimetable() {
        return this.getTimetableDatesToCheck().every((key) =>
            this.cachedTimetable.hasOwnProperty(key)
        );
    }
    getObjForFetchTimetableEmulation() {
        return this.getTimetableDatesToCheck().reduce((acc, key) => {
            if (this.cachedTimetable.hasOwnProperty(key)) {
                acc[key] = this.cachedTimetable[key];
            }
            return acc;
        }, {});
    }
    /*----------------------------------------------------------------*/
    fetchTimetableData() {
        const fetchCachedTimetable = () => {
            const objForFetchTimetableEmulation =
                this.getObjForFetchTimetableEmulation();
            this.handleTimetableSuccess(objForFetchTimetableEmulation);
            this.isAjaxInProgress = false;
        };
        const fetchTimetableFromServer = () => {
            $.ajax({
                url: this.timetableAction,
                method: "GET",
                dataType: "json",
                data: {
                    requestedDate: this.requestedDate,
                    device: this.device,
                },
                success: this.handleTimetableSuccess.bind(this),
                error: this.handleTimetableError.bind(this),
            });
        };
        if (this.isAjaxInProgress) {
            return;
        }
        this.isAjaxInProgress = true;
        if (this.canIUseCachedTimetable()) {
            fetchCachedTimetable();
        } else {
            fetchTimetableFromServer();
        }
    }
    /*----------------------------------------------------------------*/
    handleAjaxError(xhr, status, error) {
        console.error("XHR Object:", xhr);
        console.error("Status:", status);
        console.error("Error:", error);
    }
    handleTimetableError(xhr, status, error) {
        this.isAjaxInProgress = false;
        this.handleAjaxError(xhr, status, error);
    }
    handleTimetableSuccess(response) {
        Object.assign(this.cachedTimetable, response);
        this.$timetableElement.empty();
        this.renderTimetable(response);
        this.isAjaxInProgress = false;
        this.renderAlreadyChosenSlots(this.isMobile);
    }
    /*----------------------------------------------------------------*/
    hideArrowPointer(isMobile) {
        if (this.stepOfDateOffset <= 0) {
            const eventSelector = isMobile
                ? this.mobileArrowLeftFullSelector
                : this.desktopArrowLeftFullSelector;
            $(eventSelector).css("visibility", "hidden");
        }
    }
    getSpanTimetableArrow(arrowChar) {
        return `<span class='timetable__arrow-pointer'>${arrowChar}</span>`;
    }
    getTimetableSlot(isBooked, isMobile, time, priceInEuro = 25) {
        const disabledClass = isBooked ? "class='disabled'" : "";
        if (isMobile) {
            return `<li ${disabledClass}><span>${time}</span><span>${
                isBooked ? "booked" : priceInEuro + "€"
            }</span></li>`;
        }
        const desktopCheckmark = !isBooked ? "<span>✔</span>" : "";
        return `<li ${disabledClass}>${desktopCheckmark}<span>${priceInEuro}€</span></li>`;
    }
    renderTimeSlots(ulElement, bookedSlots, isMobile) {
        this.openingHours.forEach((time) => {
            ulElement.append(
                this.getTimetableSlot(
                    bookedSlots.includes(time),
                    isMobile,
                    time
                )
            );
        });
    }
    getMobileFirstLi(date) {
        const getDivTimetableArrow = (isFirstDiv, arrowChar, offset) => {
            return `<div>
              ${isFirstDiv ? this.getSpanTimetableArrow(arrowChar) : ""}
              <span>${this.dateFormatter(this.stepOfDateOffset + offset)}</span>
              ${isFirstDiv ? "" : this.getSpanTimetableArrow(arrowChar)}
            </div>`;
        };
        return `<li>
            ${getDivTimetableArrow(true, "<", -1)}
            <div>
                <input type="text" value="${date}" readonly>
            </div>
            ${getDivTimetableArrow(false, ">", 1)}
        </li>`;
    }
    getCoreUlElement(date, bookedSlots, isMobile) {
        const $ulElement = $("<ul>");
        if (isMobile) {
            $ulElement.append(this.getMobileFirstLi(date));
        } else {
            $ulElement.append("<li>" + date + "</li>");
        }
        this.renderTimeSlots($ulElement, bookedSlots, isMobile);
        return $ulElement;
    }
    getOpeningHoursUlForDesktop(isFirstUl = true) {
        const $ulElement = $("<ul>");
        if (isFirstUl) {
            $ulElement.append(`<li>${this.getSpanTimetableArrow("<")}</li>`);
        } else {
            $ulElement.append(`<li>${this.getSpanTimetableArrow(">")}</li>`);
        }
        this.openingHoursForDesktop.forEach(function (value) {
            $ulElement.append("<li>" + value + "</li>");
        });
        return $ulElement;
    }
    renderTimetable(response) {
        if (!this.isMobile)
            this.$timetableElement.append(this.getOpeningHoursUlForDesktop());
        for (const key in response) {
            if (response.hasOwnProperty(key)) {
                this.$timetableElement.append(
                    this.getCoreUlElement(key, response[key], this.isMobile)
                );
            }
        }
        if (!this.isMobile)
            this.$timetableElement.append(
                this.getOpeningHoursUlForDesktop(false)
            );
        if (this.isMobile) this.initTimetableDatepicker();
        this.hideArrowPointer(this.isMobile);
    }
}

export default TimetableHandler;
