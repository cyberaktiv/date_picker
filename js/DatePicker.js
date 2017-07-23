var DatePicker = function(id) {

    var that = this;
    var MONTH_NAMES = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var _year,
        _month,
        _day,
        selectedDates = [];

    (function() {
        // create DOM-element here
        init(new Date());
        addEventsOnButtons();
        addEventsOnCells();
    })();

    this.setYear = function(value) {

        if(value > 10000 || value < 0) return;
        init(new Date(value, _month, _day));
    };

    this.setMonth = function(value) {

        init(new Date(_year, value, _day));
    };

    this.getSelectedDates = function() {

        var result = [];
        for (var key in selectedDates) {
            result.push(selectedDates[key]);
        }
        return result;
    };

    this.getYear = function() {

        return _year;
    };

    this.getMonth = function(string) {

        return (string)?MONTH_NAMES[_month]:_month;
    };

    this.unSelectedAllDates = function() {

        selectedDates = [];
        init();
    };

    this.selectDates = function(values) {

        if (Array.isArray(values)) {
            for (var i = 0; i < values.length; i++) {
                selectedDates[(values[i].getFullYear() + "-" + values[i].getMonth() + "-" + values[i].getDate())] = values[i];
            }
        } else {
            var date = values;
            selectedDates[(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate())] = date;
        }
        init();
    };

    this.unSelectDate = function(date) {

        if (selectedDates[(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate())]) {

            delete selectedDates[(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate())];
            init();
        }
    };

    function init(date) {

        date = (date) ? date : new Date(_year, _month, _day);

        _year = date.getFullYear();
        _month = date.getMonth();
        _day = date.getDate();

        var countDays = getLastDayOfMonth(date),
            begin = getBeginPosition(date);

        document.querySelector("#" + id + " .dpMonth .dpHeaderContent").innerHTML = MONTH_NAMES[_month];
        document.querySelector("#" + id + " .dpYear .dpHeaderContent").innerHTML = _year;

        fillCellsOfDays(begin, countDays);
    }

    function addEventsOnCells() {

        var dpCells = document.querySelector("#" + id + " .dpCells"),
            cell, day, date;

        dpCells.addEventListener("click", function(event) {

            cell = event.target;

            if (cell.classList.contains('withData')) {

                day = parseInt(cell.innerHTML);

                if (!cell.classList.contains("selected")) {

                    date = new Date(_year, _month, day);
                    selectedDates[(_year + "-" + _month + "-" + day)] = date;
                    cell.classList.add("selected");
                } else {

                    delete selectedDates[(_year + "-" + _month + "-" + day)];
                    cell.classList.remove("selected");
                }
            }
        });
    }

    function addEventsOnButtons() {

        var dpHeader = document.querySelector("#" + id + " .dpHeader");

        dpHeader.addEventListener("click", function (event) {

            var next = event.target.classList.contains("dpNext");
            var prev = event.target.classList.contains("dpPrev");
            var month = event.target.parentNode.classList.contains("dpMonth");
            var year = event.target.parentNode.classList.contains("dpYear");

            if (next && year) {
                that.setYear(_year + 1);
            }
            if (next && month) {
                that.setMonth(_month + 1);
            }
            if (prev && year) {
                that.setYear(_year - 1);
            }
            if (prev && month) {
                that.setMonth(_month - 1);
            }
        });
    }

    function fillCellsOfDays(begin, countDays) {

        var cells = document.querySelectorAll("#" + id + " .dpCells td"),
            data = createArrayOfDays(begin, countDays);

        for (var i = 0; i < cells.length; i++) {

            var datesEqual = datesAreEqual(
                new Date(),
                new Date(_year, _month, parseInt(data[i]))
            );

            if (datesEqual) {
                cells[i].classList.add("current-day");
            } else {
                cells[i].classList.remove("current-day");
            }

            cells[i].classList.remove("selected");
            if (cells[i].classList.contains("withData") && data[i] === "") {
                cells[i].classList.remove("withData");
            }
            cells[i].innerHTML = data[i];

            if (data[i] !== "") {
                cells[i].classList.add("withData");

                if (typeof selectedDates[(_year + "-" + _month + "-" + data[i])] !== 'undefined') {
                    cells[i].classList.add("selected");
                }
            }
        }
    }

    function datesAreEqual(first, second) {

        return (
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate()
        );
    }

    function createArrayOfDays(begin, countDays) {

        begin--;
        var result = [],
            countCells = 42,
            counter = 0,
            positionBeforeBegin = 0,
            dayNumber;

        for (var i = 1; i <= countCells; i++) {

            if (begin <= counter) {
                dayNumber = i - positionBeforeBegin;
                if (dayNumber > countDays) {
                    result.push("");
                } else {
                    result.push(dayNumber);
                }
            } else {
                result.push("");
                positionBeforeBegin++;
            }
            counter++;
        }
        return result;
    }

    function getLastDayOfMonth(date) {

        var tmpDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return tmpDate.getDate();
    }

    function getBeginPosition(date) {

        var tmpDate = new Date(date.getFullYear(), date.getMonth(), 1);
        // 1, 2, 3, 4, 5, 6, 0 - seven for zero
        return tmpDate.getDay() || 7;
    }
};