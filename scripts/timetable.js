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
    const timetableElement = $(".timetable__opening-hours");

    const getDateInDMYFormat = (offset = 0) => {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + offset);
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return currentDate.toLocaleDateString("en-GB", options);
    };
    let requestedDate = getDateInDMYFormat();

    let device = "mobile";
    if ($(".header-template__burger").css("display") === "none") {
        device = "desktop";
    }

    const cachedTimetable = {};

    //Create datepicker container
    const datepickerContainer = $(
        "<div class='datepicker__container'>" +
            "<input type='text' id='datepicker' />" +
            "<img src='/padelSquashBookingWebsite/assets/calendar.png' alt='Calendar icon' class='calendar-icon' />" +
            "</div>"
    );
    const initDatepicker = () => {
        $("#datepicker").val(requestedDate);
        $("#datepicker").datepicker({
            minDate: 0,
            dateFormat: "dd/mm/yy",
            onSelect: function (dateText) {
                console.log("Выбрана дата: " + dateText);
            },
        });
    };
    //End datepicker section

    function handleAjaxError(xhr, status, error) {
        console.error("XHR Object:", xhr);
        console.error("Status:", status);
        console.error("Error:", error);
    }
    function fetchTimetableData() {
        const timetableAction = "squash_booking/init_timetable";
        $.ajax({
            url: timetableAction,
            method: "GET",
            dataType: "json",
            data: {
                requestedDate,
                device,
            },
            success: function (response) {
                Object.assign(cachedTimetable, response);
                timetableElement.empty();
                if (device === "mobile") {
                    for (const key in response) {
                        if (response.hasOwnProperty(key)) {
                            const ulElement = $("<ul>");
                            const liElement =
                                $("<li>").append(datepickerContainer);
                            ulElement.append(liElement);
                            openingHours.forEach(function (value) {
                                if (response[key].includes(value)) {
                                    ulElement.append(
                                        "<li class='disabled'>" +
                                            "<span>" +
                                            value +
                                            "</span>" +
                                            "<span>booked</span>" +
                                            "</li>"
                                    );
                                } else {
                                    ulElement.append(
                                        "<li>" +
                                            "<span>" +
                                            value +
                                            "</span>" +
                                            "<span>25€</span>" +
                                            "</li>"
                                    );
                                }
                            });
                            timetableElement.append(ulElement);
                            initDatepicker();
                        }
                    }
                } else if (device === "desktop") {
                    const ulElement = $("<ul>");
                    ulElement.append("<li></li>");
                    openingHours.forEach(function (value) {
                        ulElement.append("<li>" + value + "</li>");
                    });
                    timetableElement.append(ulElement);
                    for (const key in response) {
                        if (response.hasOwnProperty(key)) {
                            const ulElement = $("<ul>");
                            ulElement.append("<li>" + key + "</li>");
                            openingHours.forEach(function (value) {
                                if (response[key].includes(value)) {
                                    ulElement.append(
                                        "<li class='disabled'>" +
                                            "<span>25€</span>" +
                                            "</li>"
                                    );
                                } else {
                                    ulElement.append(
                                        "<li>" +
                                            "<span>✔</span>" +
                                            "<span>25€</span>" +
                                            "</li>"
                                    );
                                }
                            });
                            timetableElement.append(ulElement);
                        }
                    }
                }
            },
            error: handleAjaxError,
        });
    }
    fetchTimetableData();

    let eventDelegationSelector;
    if (device === "mobile") {
        eventDelegationSelector = "ul li:not(:first-child):not(.disabled)";
    } else if (device === "desktop") {
        eventDelegationSelector =
            "ul:not(:first-child) li:not(:first-child):not(.disabled)";
    }
    $(".timetable__opening-hours").on(
        "click",
        eventDelegationSelector,
        function () {
            $(this).toggleClass("touched");
        }
    );
});
