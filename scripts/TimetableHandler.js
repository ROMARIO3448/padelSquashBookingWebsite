import DateFormatterForTimetable from "/padelSquashBookingWebsite/scripts/DateFormatterForTimetable.js";

class TimetableHandler {
    constructor(options) {
        this.openingHours = options.openingHours;
        this.openingHoursForDesktop = options.openingHoursForDesktop;
        this.device = options.device;
        this.isMobile = this.device === "mobile";
        this.timetableElement = $(".timetable__opening-hours");
        this.stepOfDateOffset = 0;
        this.dateFormatter = DateFormatterForTimetable.getDateInDMYFormat;
        this.requestedDate = this.dateFormatter(this.stepOfDateOffset);
        this.cachedTimetable = {};
        this.isAjaxInProgress = false;
        this.timetableAction = "squash_booking/init_timetable";

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

        this.setupEventListeners();
        this.fetchTimetableData();
    }
    /*----------------------------------------------------------------*/
    setupEventListeners() {
        this.setupToggleTouchedClassEventListener(this.isMobile);
        this.setupArrowPointerEventListeners(this.isMobile);
    }
    setupToggleTouchedClassEventListener(isMobile) {
        const eventSelector = isMobile
            ? this.mobileTouchableSelector
            : this.desktopTouchableSelector;
        this.timetableElement.on("click", eventSelector, (event) => {
            event.currentTarget.classList.toggle("touched");
        });
    }
    updateDateAndFetchTimetableData(offset) {
        if (this.isAjaxInProgress) {
            return;
        }
        this.stepOfDateOffset += offset;
        this.requestedDate = this.dateFormatter(this.stepOfDateOffset);
        this.fetchTimetableData();
    }
    setupMobileArrowPointerEventListeners() {
        this.timetableElement.on("click", this.mobileArrowLeftSelector, () => {
            this.updateDateAndFetchTimetableData(-1);
        });
        this.timetableElement.on("click", this.mobileArrowRightSelector, () => {
            this.updateDateAndFetchTimetableData(1);
        });
    }
    setupDesktopArrowPointerEventListener() {
        this.timetableElement.on(
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
    }
    setTimetableDatepicker() {
        this.timetableDatepicker.datepickerSelector =
            this.datepickerElementSelector;
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
        if (this.isAjaxInProgress) {
            return;
        }
        this.isAjaxInProgress = true;
        if (this.canIUseCachedTimetable()) {
            const objForFetchTimetableEmulation =
                this.getObjForFetchTimetableEmulation();
            this.handleTimetableSuccess(objForFetchTimetableEmulation);
            this.isAjaxInProgress = false;
            return;
        }
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
    }
    handleTimetableSuccess(response) {
        Object.assign(this.cachedTimetable, response);
        this.timetableElement.empty();
        this.renderTimetable(response);
        this.isAjaxInProgress = false;
    }
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
    getTimetableSlot(isBooked, isMobile, time, price = "25€") {
        const disabledClass = isBooked ? "class='disabled'" : "";
        if (isMobile) {
            return `<li ${disabledClass}><span>${time}</span><span>${
                isBooked ? "booked" : price
            }</span></li>`;
        }
        const desktopCheckmark = !isBooked ? "<span>✔</span>" : "";
        return `<li ${disabledClass}>${desktopCheckmark}<span>${price}</span></li>`;
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
                <span>${date}</span>
                <img src="/padelSquashBookingWebsite/assets/calendar.png" alt="Calendar icon" />
            </div>
            ${getDivTimetableArrow(false, ">", 1)}
        </li>`;
    }
    getCoreUlElement(date, bookedSlots, isMobile) {
        const ulElement = $("<ul>");
        if (isMobile) {
            ulElement.append(this.getMobileFirstLi(date));
        } else {
            ulElement.append("<li>" + date + "</li>");
        }
        this.renderTimeSlots(ulElement, bookedSlots, isMobile);
        return ulElement;
    }
    getOpeningHoursUlForDesktop(isFirstUl = true) {
        const ulElement = $("<ul>");
        if (isFirstUl) {
            ulElement.append(`<li>${this.getSpanTimetableArrow("<")}</li>`);
        } else {
            ulElement.append(`<li>${this.getSpanTimetableArrow(">")}</li>`);
        }
        this.openingHoursForDesktop.forEach(function (value) {
            ulElement.append("<li>" + value + "</li>");
        });
        return ulElement;
    }
    renderTimetable(response) {
        if (!this.isMobile)
            this.timetableElement.append(this.getOpeningHoursUlForDesktop());
        for (const key in response) {
            if (response.hasOwnProperty(key)) {
                this.timetableElement.append(
                    this.getCoreUlElement(key, response[key], this.isMobile)
                );
            }
        }
        if (!this.isMobile)
            this.timetableElement.append(
                this.getOpeningHoursUlForDesktop(false)
            );
        if (this.isMobile) this.initTimetableDatepicker();
        this.hideArrowPointer(this.isMobile);
    }
    handleAjaxError(xhr, status, error) {
        console.error("XHR Object:", xhr);
        console.error("Status:", status);
        console.error("Error:", error);
    }
    handleTimetableError(xhr, status, error) {
        this.isAjaxInProgress = false;
        this.handleAjaxError(xhr, status, error);
    }
}

export default TimetableHandler;
