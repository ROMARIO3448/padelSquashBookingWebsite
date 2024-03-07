class DateFormatterForTimetable {
    static getDateInDMYFormat(offset = 0) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + offset);
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return currentDate.toLocaleDateString("en-GB", options);
    }
    static getDaysDifference(dateStrInDMYFormat) {
        const currentDate = new Date();
        const [day, month, year] = dateStrInDMYFormat.split("/").map(Number);
        const selectedDate = new Date(year, month - 1, day);
        if (
            currentDate.getDate() === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear()
        ) {
            return 0;
        }
        const timeDiff = Math.abs(
            selectedDate.getTime() - currentDate.getTime()
        );
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
}

export default DateFormatterForTimetable;
