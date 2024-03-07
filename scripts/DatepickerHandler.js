import DateFormatterForTimetable from "/padelSquashBookingWebsite/scripts/DateFormatterForTimetable.js";

class DatepickerHandler {
    #datepickerSelector = "#datepicker";
    #datepicker = $(this.#datepickerSelector);
    #getDaysDifference = DateFormatterForTimetable.getDaysDifference;
    #diffInDays = 0;
    #buttonImageSource = "/padelSquashBookingWebsite/assets/calendar.png";
    #onSelectEventName = "datepickerOnSelect";
    #onSelectEvent;

    initDatepicker() {
        this.#createOnSelectEvent();
        const handleOnSelect = (dateText) => {
            this.#diffInDays = this.#getDaysDifference(dateText);
            this.#callOnSelectEvent();
        };
        this.#datepicker.datepicker({
            minDate: 0,
            dateFormat: "dd/mm/yy",
            onSelect: handleOnSelect,
            showOn: "button",
            buttonImage: this.#buttonImageSource,
            buttonImageOnly: true,
            buttonText: "Select date",
        });
        this.#setupEventListeners();
    }
    #setupEventListeners() {
        this.#setupResizeAndScrollEventListeners();
    }
    #setupResizeAndScrollEventListeners() {
        const handleResizeAndScroll = () => {
            this.#datepicker.datepicker("hide");
        };
        $(window).on("resize", handleResizeAndScroll);
        $(window).on("scroll", handleResizeAndScroll);
    }
    #createOnSelectEvent() {
        this.#onSelectEvent = $.Event(this.#onSelectEventName);
    }
    #callOnSelectEvent() {
        this.#datepicker.trigger(this.#onSelectEvent);
    }
    get datepicker() {
        return this.#datepicker;
    }
    get datepickerSelector() {
        return this.#datepickerSelector;
    }
    set datepickerSelector(value) {
        this.#datepickerSelector = value;
        this.#datepicker = $(value);
    }
    get onSelectEventName() {
        return this.#onSelectEventName;
    }
    get diffInDays() {
        return this.#diffInDays;
    }
}

export default DatepickerHandler;
