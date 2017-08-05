var DatePicker = function(id, options) {

    options = options || {};
    var _default = {
        monthNames: [
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
        ],
        namesDaysWeek: [
            "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"
        ],
        weekStart: 0 // 0 - sunday
    };

    var MONTH_NAMES = options.monthNames    || _default.monthNames,
        WEEK_DAYS   = options.namesDaysWeek || _default.namesDaysWeek,
        WEEK_START  = options.weekStart     || _default.weekStart,
        _year, _month, _day;

    (function() {
        createHTMLStructure();
        init(new Date());
        addEventsOnButtons();
        addEventsOnCells();
    })();

    function createHTMLStructure() {

        var i,
            content =
                '<div class="dpHeader">' +
                '   <div class="dpMonth">' +
                '       <div class="dpPrev dpButton"></div>' +
                '       <div class="dpTriangleLeft"></div>' +
                '       <div class="dpNext dpButton"></div>' +
                '       <div class="dpTriangleRight"></div>' +
                '       <div class="dpHeaderContent"></div>' +
                '   </div>' +
                '   <div class="dpYear">' +
                '       <div class="dpPrev dpButton"></div>' +
                '       <div class="dpTriangleLeft"></div>' +
                '       <div class="dpNext dpButton"></div>' +
                '       <div class="dpTriangleRight"></div>' +
                '       <div class="dpHeaderContent"></div>' +
                '   </div>' +
                '</div>' +
                '<div class="dpCells">' +
                '   <table>' +
                '       <tr>' +
                '           <th></th>' +
                '           <th></th>' +
                '           <th></th>' +
                '           <th></th>' +
                '           <th></th>' +
                '           <th></th>' +
                '           <th></th>' +
                '       </tr>';

        for(i = 0; i < 6; i++) {
            content +=
                '       <tr>' +
                '           <td></td>' +
                '           <td></td>' +
                '           <td></td>' +
                '           <td></td>' +
                '           <td></td>' +
                '           <td></td>' +
                '           <td></td>' +
                '       </tr>';
        }

        content += '</table>' +
                '</div>'

        document.querySelector('#' + id).innerHTML = content
    }

    function init(date) {

        date = (date) ? date : new Date(_year, _month, _day);

        _year = date.getFullYear();
        _month = date.getMonth();
        _day = date.getDate();

        document.querySelector("#" + id + " .dpMonth .dpHeaderContent").innerHTML = MONTH_NAMES[_month];
        document.querySelector("#" + id + " .dpYear .dpHeaderContent").innerHTML = _year;

        var ths = document.querySelectorAll("#" + id + " .dpCells th"),
            countTh = ths.length,
            i;

        for(i = 0; i < countTh; i++) {
            ths[i].innerHTML = WEEK_DAYS[i];
        }

        var countDays = getLastDayOfMonth(date),
            begin = getBeginPosition(date);

        fillCellsOfDays(begin, countDays);
    }

    function addEventsOnCells() {

        var dpCells = document.querySelector("#" + id + " .dpCells"),
            cell, day, date;

        dpCells.addEventListener("click", function(event) {

            cell = event.target;

            if (cell.classList.contains('withData')) {

                day = parseInt(cell.innerHTML);

                date = new Date(_year, _month, day);
                console.log(date);
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
                setYear(_year + 1);
            }
            if (next && month) {
                setMonth(_month + 1);
            }
            if (prev && year) {
                setYear(_year - 1);
            }
            if (prev && month) {
                setMonth(_month - 1);
            }
        });
    }

    function getLastDayOfMonth(date) {

        var tmpDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return tmpDate.getDate();
    }

    function getBeginPosition(date) {

        var tmpDate = new Date(date.getFullYear(), date.getMonth(), 1);
        return tmpDate.getDay();
    }

    function fillCellsOfDays(begin, countDays) {

        var cells = document.querySelectorAll("#" + id + " .dpCells td"),
            data = createArrayOfDays(begin, countDays),
            i;

        for (i = 0; i < cells.length; i++) {

            var datesEqual = datesAreEqual(
                new Date(),
                new Date(_year, _month, parseInt(data[i]))
            );

            if (datesEqual) {
                cells[i].classList.add("current-day");
            } else {
                cells[i].classList.remove("current-day");
            }

            if (cells[i].classList.contains("withData") && data[i] === "") {
                cells[i].classList.remove("withData");
            }
            cells[i].innerHTML = data[i];

            if (data[i] !== "") {
                cells[i].classList.add("withData");
            }
        }
    }

    function createArrayOfDays(begin, countDays) {

        begin = begin - WEEK_START;
        begin = (begin < 0) ? begin + 7 : begin;

        var result = [],
            countCells = 42,
            counter = 0,
            positionBeforeBegin = 0,
            dayNumber,
            i;

        for (i = 1; i <= countCells; i++) {

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

    function datesAreEqual(first, second) {

        return (
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate()
        );
    }

    function setYear(value) {

        if(value > 10000 || value < 0) return;
        init(new Date(value, _month, _day));
    }

    function setMonth(value) {

        init(new Date(_year, value, _day));
    }
};