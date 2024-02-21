class DateFormatterForTimetable {
    static getDateInDMYFormat(offset = 0) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + offset);
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        return currentDate.toLocaleDateString("en-GB", options);
    }
}

export default DateFormatterForTimetable;
