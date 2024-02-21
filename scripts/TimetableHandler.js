import DateFormatterForTimetable from "/padelSquashBookingWebsite/scripts/DateFormatterForTimetable.js";

class TimetableHandler {
    constructor(options) {
        this.openingHours = options.openingHours;
        this.openingHoursForDesktop = options.openingHoursForDesktop;
        this.device = options.device;
        this.timetableElement = $(".timetable__opening-hours");
        this.stepOfDateOffset = 0;
        this.requestedDate = DateFormatterForTimetable.getDateInDMYFormat(
            this.stepOfDateOffset
        );
        this.cachedTimetable = {};
        this.isAjaxInProgress = false;
        this.setupEventListeners();
        this.fetchTimetableData();
    }
    /*----------------------------------------------------------------*/
    setupEventListeners() {
        if (this.device === "mobile") {
            this.setupToggleTouchedIfNotDisabledEventListener();
            this.setupMobileArrowPointerEventListeners();
        } else if (this.device === "desktop") {
            this.setupToggleTouchedIfNotDisabledEventListener(false);
            this.setupDesktopArrowPointerEventListener();
        }
    }
    setupToggleTouchedIfNotDisabledEventListener(isMobile = true) {
        let eventDelegationSelector = "ul li:not(:first-child):not(.disabled)";
        if (!isMobile) {
            eventDelegationSelector =
                "ul:not(:first-child):not(:last-child) li:not(:first-child):not(.disabled)";
        }
        this.timetableElement.on("click", eventDelegationSelector, (event) => {
            $(event.currentTarget).toggleClass("touched");
        });
    }
    setupMobileArrowPointerEventListeners() {
        this.timetableElement.on(
            "click",
            "ul:first-child li:first-child div:nth-child(1)",
            () => {
                if (this.isAjaxInProgress) {
                    return;
                }
                this.stepOfDateOffset--;
                this.requestedDate =
                    DateFormatterForTimetable.getDateInDMYFormat(
                        this.stepOfDateOffset
                    );
                this.fetchTimetableData();
            }
        );
        this.timetableElement.on(
            "click",
            "ul:first-child li:first-child div:nth-child(3)",
            () => {
                if (this.isAjaxInProgress) {
                    return;
                }
                this.stepOfDateOffset++;
                this.requestedDate =
                    DateFormatterForTimetable.getDateInDMYFormat(
                        this.stepOfDateOffset
                    );
                this.fetchTimetableData();
            }
        );
    }
    setupDesktopArrowPointerEventListener() {
        this.timetableElement.on(
            "click",
            ".timetable__arrow-pointer",
            (event) => {
                if (this.isAjaxInProgress) {
                    return;
                }
                const outerText = $(event.currentTarget).text();
                switch (outerText) {
                    case "<":
                        this.stepOfDateOffset -= 7;
                        this.requestedDate =
                            DateFormatterForTimetable.getDateInDMYFormat(
                                this.stepOfDateOffset
                            );
                        this.fetchTimetableData();
                        break;
                    case ">":
                        this.stepOfDateOffset += 7;
                        this.requestedDate =
                            DateFormatterForTimetable.getDateInDMYFormat(
                                this.stepOfDateOffset
                            );
                        this.fetchTimetableData();
                        break;
                    default:
                        break;
                }
            }
        );
    }
    /*----------------------------------------------------------------*/
    getArrayOfTimetableValuesToCheck() {
        const timetableValuesToCheck = [];
        timetableValuesToCheck.push(
            DateFormatterForTimetable.getDateInDMYFormat(this.stepOfDateOffset)
        );
        if (this.device === "desktop") {
            for (let i = 1; i < 7; i++) {
                timetableValuesToCheck.push(
                    DateFormatterForTimetable.getDateInDMYFormat(
                        this.stepOfDateOffset + i
                    )
                );
            }
        }
        return timetableValuesToCheck;
    }
    canIUseCachedTimetableInsteadOfAjax() {
        return this.getArrayOfTimetableValuesToCheck().every((key) =>
            this.cachedTimetable.hasOwnProperty(key)
        );
    }
    getObjForFetchTimetableEmulation() {
        return this.getArrayOfTimetableValuesToCheck().reduce((acc, key) => {
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

        if (this.canIUseCachedTimetableInsteadOfAjax()) {
            const objForFetchTimetableEmulation =
                this.getObjForFetchTimetableEmulation();
            this.handleTimetableSuccess(objForFetchTimetableEmulation);
            this.isAjaxInProgress = false;
            return;
        }

        const timetableAction = "squash_booking/init_timetable";
        $.ajax({
            url: timetableAction,
            method: "GET",
            dataType: "json",
            data: {
                requestedDate: this.requestedDate,
                device: this.device,
            },
            success: (response) => this.handleTimetableSuccess(response),
            error: (xhr, status, error) =>
                this.handleTimetableError(xhr, status, error),
        });
    }
    handleTimetableSuccess(response) {
        Object.assign(this.cachedTimetable, response);
        this.timetableElement.empty();

        if (this.device === "mobile") {
            this.renderMobileTimetable(response);
        } else if (this.device === "desktop") {
            this.renderDesktopTimetable(response);
        }
        this.isAjaxInProgress = false;
    }
    hideArrowPointerIfStepOfDateOffsetLessOrEqualZero() {
        if (this.stepOfDateOffset <= 0) {
            if (this.device === "mobile") {
                $(
                    ".timetable__opening-hours ul:first-child li:first-child div:nth-child(1)"
                ).css("visibility", "hidden");
            } else if (this.device === "desktop") {
                $(
                    ".timetable__opening-hours ul:first-child li:first-child"
                ).css("visibility", "hidden");
            }
        }
    }
    renderMobileTimetable(response) {
        const createMobileFirstLi = (date) => {
            return $(`<li>
                <div>
                    <span class='timetable__arrow-pointer'><</span>
                    <span>${DateFormatterForTimetable.getDateInDMYFormat(
                        this.stepOfDateOffset - 1
                    )}</span>
                </div>
                <div>
                    <span>${date}</span>
                    <img src="/padelSquashBookingWebsite/assets/calendar.png" alt="Calendar icon" />
                </div>
                <div>
                    <span>${DateFormatterForTimetable.getDateInDMYFormat(
                        this.stepOfDateOffset + 1
                    )}</span>
                    <span class='timetable__arrow-pointer'>></span>
                </div>
            </li>`);
        };
        const renderMobileTimeSlots = (ulElement, bookedSlots) => {
            this.openingHours.forEach(function (value) {
                if (bookedSlots.includes(value)) {
                    ulElement.append(
                        "<li class='disabled'><span>" +
                            value +
                            "</span><span>booked</span></li>"
                    );
                } else {
                    ulElement.append(
                        "<li><span>" + value + "</span><span>25€</span></li>"
                    );
                }
            });
        };
        const getCoreUlElementForMobile = (date, bookedSlots) => {
            const ulElement = $("<ul>");
            ulElement.append(createMobileFirstLi(date));
            renderMobileTimeSlots(ulElement, bookedSlots);
            return ulElement;
        };

        for (const key in response) {
            if (response.hasOwnProperty(key)) {
                this.timetableElement.append(
                    getCoreUlElementForMobile(key, response[key])
                );
            }
        }
        this.hideArrowPointerIfStepOfDateOffsetLessOrEqualZero();
    }
    renderDesktopTimetable(response) {
        const getOpeningHoursUlForDesktop = (isFirstUl = true) => {
            const ulElement = $("<ul>");
            if (isFirstUl) {
                ulElement.append(
                    "<li><span class='timetable__arrow-pointer'><</span></li>"
                );
            } else {
                ulElement.append(
                    "<li><span class='timetable__arrow-pointer'>></span></li>"
                );
            }
            this.openingHoursForDesktop.forEach(function (value) {
                ulElement.append("<li>" + value + "</li>");
            });
            return ulElement;
        };
        const getCoreUlElementForDesktop = (date, bookedSlots) => {
            const ulElement = $("<ul>");
            ulElement.append("<li>" + date + "</li>");
            this.openingHours.forEach(function (value) {
                if (bookedSlots.includes(value)) {
                    ulElement.append(
                        "<li class='disabled'><span>25€</span></li>"
                    );
                } else {
                    ulElement.append("<li><span>✔</span><span>25€</span></li>");
                }
            });
            return ulElement;
        };

        this.timetableElement.append(getOpeningHoursUlForDesktop());
        for (const key in response) {
            if (response.hasOwnProperty(key)) {
                this.timetableElement.append(
                    getCoreUlElementForDesktop(key, response[key])
                );
            }
        }
        this.timetableElement.append(getOpeningHoursUlForDesktop(false));
        this.hideArrowPointerIfStepOfDateOffsetLessOrEqualZero();
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
