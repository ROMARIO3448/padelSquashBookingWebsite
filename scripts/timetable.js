jQuery(function () {
    // Входная строка в формате "dd.mm.yyyy"
    const parseDdMmYyyyDateWithDotsToSeconds = (dateStringDdMmYyyyWithDots) => {
        const parts = dateStringDdMmYyyyWithDots.split(".");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const dateObject = new Date(year, month, day);
        const timestampInSeconds = Math.floor(dateObject.getTime() / 1000);
        return timestampInSeconds;
    };

    console.log(parseDdMmYyyyDateWithDotsToSeconds("10.02.2024"));
    const formatSecondsToDate = (timestampInSeconds) => {
        const dateObject = new Date(timestampInSeconds * 1000);
        const day = dateObject.getDate();
        const month = dateObject.getMonth() + 1;
        const year = dateObject.getFullYear();
        const formattedDate = `${day < 10 ? "0" : ""}${day}.${
            month < 10 ? "0" : ""
        }${month}.${year}`;
        return formattedDate;
    };
    console.log(
        formatSecondsToDate(parseDdMmYyyyDateWithDotsToSeconds("10.02.2024"))
    );
    console.log(formatSecondsToDate(1707585210));

    const getCurrentDateString = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const formattedDate = `${day < 10 ? "0" : ""}${day}/${
            month < 10 ? "0" : ""
        }${month}/${year}`;
        return formattedDate;
    };
    let requestedDate = getCurrentDateString();
    /*const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
    let requestedDate = currentTimestampInSeconds;
    console.log(requestedDate); //getCurrentDate();*/ //данное значение requestedDate
    //будет динамическим. При инициализации его значение будет текущей датой
    //а далее оно будет при необходимости меняться. Либо с помощью datepicker
    //на мобилках, либо же при нажатии на кнопку "СЛЕД НЕДЕЛЯ" на десктопе

    /*ОПРЕДЕЛЯЕМ ВИДИМЫЙ ЛИ КОНКРЕТНЫЙ ЭЛЕМЕНТ НАШЕЙ ВЁРСТКИ И ПОЭТОМУ ОПРЕДЕЛЯЕМ
    ДЕСКТОП ЭТО ИЛИ МОБИЛА*/
    //варианты mobile и desktop
    const device = "desktop"; //пока будет мобила, второй вариант desktop

    const cachedTimetable = [];

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
                for (const key in response) {
                    if (response.hasOwnProperty(key)) {
                        // key - это имя свойства, response[key] - его значение
                        console.log(key, response[key]);
                    }
                }
            },
            error: handleAjaxError,
        });
    }
    fetchTimetableData();

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

    // Получаем элемент с классом timetable__opening-hours
    const timetableElement = $(".timetable__opening-hours");

    // Используем forEach для добавления каждого элемента внутрь timetableElement
    openingHours.forEach(function (value) {
        timetableElement.append("<li>" + value + "</li>");
    });
});
