jQuery(function () {
    const openingHours = [
        "7:30 - 8:00",
        "8:00 - 8:30",
        "8:30 - 9:00",
        "9:00 - 9:30",
        "9:30 - 10:00",
        "10:00 - 10:30",
        "10:30 - 11:00",
        "11:00 - 11:30",
        "11:30 - 12:00",
        "12:00 - 12:30",
        "12:30 - 13:00",
        "13:00 - 13:30",
        "13:30 - 14:00",
        "14:00 - 14:30",
        "14:30 - 15:00",
        "15:00 - 15:30",
        "15:30 - 16:00",
        "16:00 - 16:30",
        "16:30 - 17:00",
        "17:00 - 17:30",
        "17:30 - 18:00",
        "18:00 - 18:30",
        "18:30 - 19:00",
        "19:00 - 19:30",
        "19:30 - 20:00",
        "20:00 - 20:30",
        "20:30 - 21:00",
        "21:00 - 21:30",
        "21:30 - 22:00",
        "22:00 - 22:30",
        "22:30 - 23:00",
    ];
    const openingHoursForDesktop = [
        "7:30",
        "8:00",
        "8:30",
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
    ];

    const timetableElement = $(".timetable__opening-hours");

    let stepOfDateOffset = 0;
    const getDateInDMYFormat = (offset = 0) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + offset);
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return currentDate.toLocaleDateString("en-GB", options);
    };
    let requestedDate = getDateInDMYFormat(stepOfDateOffset);

    let device = "mobile";
    if ($(".header-template__burger").css("display") === "none") {
        device = "desktop";
    }

    const cachedTimetable = {};
    let isAjaxInProgress = false;

    function handleAjaxError(xhr, status, error) {
        console.error("XHR Object:", xhr);
        console.error("Status:", status);
        console.error("Error:", error);
    }

    const getArrayOfTimetableValuesToCheck = () => {
        const timetableValuesToCheck = [];
        timetableValuesToCheck.push(getDateInDMYFormat(stepOfDateOffset));
        if (device === "desktop") {
            for (let i = 1; i < 7; i++) {
                timetableValuesToCheck.push(
                    getDateInDMYFormat(stepOfDateOffset + i)
                );
            }
        }
        return timetableValuesToCheck;
    };
    const canIUseCachedTimetableInsteadOfAjax = () => {
        return getArrayOfTimetableValuesToCheck().every((key) =>
            cachedTimetable.hasOwnProperty(key)
        );
    };
    const getObjForFetchTimetableEmulation = () => {
        return getArrayOfTimetableValuesToCheck().reduce((acc, key) => {
            if (cachedTimetable.hasOwnProperty(key)) {
                acc[key] = cachedTimetable[key];
            }
            return acc;
        }, {});
    };

    function fetchTimetableData() {
        if (isAjaxInProgress) {
            return;
        }
        isAjaxInProgress = true;

        if (canIUseCachedTimetableInsteadOfAjax()) {
            const objForFetchTimetableEmulation =
                getObjForFetchTimetableEmulation();
            handleTimetableSuccess(objForFetchTimetableEmulation);
            isAjaxInProgress = false;
            return;
        }

        const timetableAction = "squash_booking/init_timetable";
        $.ajax({
            url: timetableAction,
            method: "GET",
            dataType: "json",
            data: {
                requestedDate,
                device,
            },
            success: handleTimetableSuccess,
            error: handleTimetableError,
        });
    }

    function handleTimetableSuccess(response) {
        Object.assign(cachedTimetable, response);
        timetableElement.empty();

        if (device === "mobile") {
            renderMobileTimetable(response);
        } else if (device === "desktop") {
            renderDesktopTimetable(response);
        }
        isAjaxInProgress = false;
    }

    const hideArrowPointerIfStepOfDateOffsetLessOrEqualZero = () => {
        if (stepOfDateOffset <= 0) {
            if (device === "mobile") {
                $(
                    ".timetable__opening-hours ul:first-child li:first-child div:nth-child(1)"
                ).css("visibility", "hidden");
            } else if (device === "desktop") {
                $(
                    ".timetable__opening-hours ul:first-child li:first-child"
                ).css("visibility", "hidden");
            }
        }
    };

    function renderMobileTimetable(response) {
        const createMobileFirstLi = (date) => {
            return $(`<li>
                <div>
                    <span class='timetable__arrow-pointer'><</span>
                    <span>${getDateInDMYFormat(stepOfDateOffset - 1)}</span>
                </div>
                <div>
                    <span>${date}</span>
                    <img src="/padelSquashBookingWebsite/assets/calendar.png" alt="Calendar icon" />
                </div>
                <div>
                    <span>${getDateInDMYFormat(stepOfDateOffset + 1)}</span>
                    <span class='timetable__arrow-pointer'>></span>
                </div>
            </li>`);
        };
        const renderMobileTimeSlots = (ulElement, bookedSlots) => {
            openingHours.forEach(function (value) {
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
                timetableElement.append(
                    getCoreUlElementForMobile(key, response[key])
                );
            }
        }
        hideArrowPointerIfStepOfDateOffsetLessOrEqualZero();
    }

    function renderDesktopTimetable(response) {
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
            openingHoursForDesktop.forEach(function (value) {
                ulElement.append("<li>" + value + "</li>");
            });
            return ulElement;
        };
        const getCoreUlElementForDesktop = (date, bookedSlots) => {
            const ulElement = $("<ul>");
            ulElement.append("<li>" + date + "</li>");
            openingHours.forEach(function (value) {
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

        timetableElement.append(getOpeningHoursUlForDesktop());
        for (const key in response) {
            if (response.hasOwnProperty(key)) {
                timetableElement.append(
                    getCoreUlElementForDesktop(key, response[key])
                );
            }
        }
        timetableElement.append(getOpeningHoursUlForDesktop(false));
        hideArrowPointerIfStepOfDateOffsetLessOrEqualZero();
    }

    function handleTimetableError(xhr, status, error) {
        isAjaxInProgress = false;
        handleAjaxError(xhr, status, error);
    }

    fetchTimetableData();

    let eventDelegationSelector;
    if (device === "mobile") {
        eventDelegationSelector = "ul li:not(:first-child):not(.disabled)";
    } else if (device === "desktop") {
        eventDelegationSelector =
            "ul:not(:first-child):not(:last-child) li:not(:first-child):not(.disabled)";
    }
    $(".timetable__opening-hours").on(
        "click",
        eventDelegationSelector,
        function () {
            $(this).toggleClass("touched");
        }
    );

    const setupArrowPointerEventListeners = () => {
        if (device === "mobile") {
            $(".timetable__opening-hours").on(
                "click",
                "ul:first-child li:first-child div:nth-child(1)",
                function () {
                    if (isAjaxInProgress) {
                        return;
                    }
                    stepOfDateOffset--;
                    requestedDate = getDateInDMYFormat(stepOfDateOffset);
                    fetchTimetableData();
                }
            );
            $(".timetable__opening-hours").on(
                "click",
                "ul:first-child li:first-child div:nth-child(3)",
                function () {
                    if (isAjaxInProgress) {
                        return;
                    }
                    stepOfDateOffset++;
                    requestedDate = getDateInDMYFormat(stepOfDateOffset);
                    fetchTimetableData();
                }
            );
        } else if (device === "desktop") {
            $(".timetable__opening-hours").on(
                "click",
                ".timetable__arrow-pointer",
                function () {
                    if (isAjaxInProgress) {
                        return;
                    }
                    const outerText = $(this).text();
                    switch (outerText) {
                        case "<":
                            stepOfDateOffset -= 7;
                            requestedDate =
                                getDateInDMYFormat(stepOfDateOffset);
                            fetchTimetableData();
                            break;
                        case ">":
                            stepOfDateOffset += 7;
                            requestedDate =
                                getDateInDMYFormat(stepOfDateOffset);
                            fetchTimetableData();
                            break;
                        default:
                            break;
                    }
                }
            );
        }
    };
    setupArrowPointerEventListeners();
});
