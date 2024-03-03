class DatepickerHandler {
    constructor() {
        this._datepickerSelector = "#datepicker";
        this._datepicker = $(this._datepickerSelector);
    }
    initDatepicker() {
        console.log("Init datepicker");
        this._datepicker.datepicker();
    }
    get datepickerSelector() {
        return this._datepickerSelector;
    }
    set datepickerSelector(value) {
        this._datepickerSelector = value;
        this._datepicker = $(value);
    }
}

export default DatepickerHandler;
