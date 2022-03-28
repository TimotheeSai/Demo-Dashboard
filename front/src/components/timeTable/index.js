
//<div  {% include "django/forms/widgets/attrs.html" %}>
//    <input type='text' class="time_table__input form-control" name="{{ widget.name }}"{% if widget.value != None %} value="{{ widget.value|stringformat:'s' }}"{% endif %} hidden/>
//    <div class="time_table__container" tabindex='-1'>
//        <div class="time_table__title">
//            Sélectionnez la date et l’heure
//        </div>
//        <div class="time_table__control">
//            <div tabindex='0' class="time_table__control__button">
//                <img class="time_table__control--prev" src="{% static 'pages_commons/img/chevron-left.svg' %}" alt="select previous month"/>
//                Retour
//            </div>
//            <div class="time_table__control__date"> </div>
//        </div>
//        <div class="time_table__interval__wrapper">
//        </div>
//        <div class="time_table__interval_change__wrapper ">
//            <div class="time_table__interval_change time_table__interval_change--later" data-later="1" tabindex='0'>
//                Plus tard
//            </div>
//        </div>
//        <div class="time_table__data hidden"
//        {% for key, value in working_hours.items %}
//            data-{{key}}="{{value}}" 
//        {% endfor %}
//        data-intervallength={{time_range_interval}}
//        >
//        </div>
//    </div>
//</div>

function TimeTable(initData = {}) {
  const MONTHS = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const DAYS = [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ];

  // Initialize instance
  this.init = function () {
    const now = new Date();
    const initial = {
      date: new Date(now), // Date obj to keep time info
      interval: 30, // length of an interval (in minutes)
      timeRangeIntervalStep: 4, // to increase timeRangeInterval when expanding range
      timeRangeInterval: 4, // length of displayed interval  from start (in hour)
      callback: null, // handler when time is set
      previousStepCallback: null, // handler to go previous step
      minTime: new Date(now).setHours(09, 0, 0, 0), // starting working hour
      maxTime: new Date(now).setHours(18, 0, 0, 0), // ending working hour
      animate: window.screen && window.screen.availWidth >= 770,
      ...initData,
    };
    Object.assign(this, initial);
    Object.assign(this, this.getDataFromFormDataset());

    this.intervalMs = this.interval * 60000;
    if (window.screen && window.screen.availWidth >= 770)
      this.timeRangeInterval = 8;

    const formElts = {
      containerDiv: document.querySelector(".time_table__container"),
      wrapperContainer: document.querySelector(
        ".time_table__interval__wrapper"
      ),
      controlDiv: document.querySelector(".time_table__control"),
      formInput: document.querySelector("input.time_table__input"),
      timeChangeButton: document.querySelector(".time_table__interval_change"),
    };
    Object.assign(this, formElts);

    // Define interval of displayed hours
    this.startTime = new Date(new Date(this.date).setHours(8, 0, 0, 0));
    this.endTime = new Date(new Date(this.date).setHours(12, 0, 0, 0));
    this.delta = this.endTime - this.startTime;
  };

  // return formated info from data stored in dataset to get data from back
  this.getDataFromFormDataset = function () {
    const formDatasetDiv = document.querySelector(".time_table__data");
    if (!formDatasetDiv) return;
    const formDataset = formDatasetDiv.dataset;
    let start = formDataset.start;
    let end = formDataset.end;
    if (this.date.getDay() === 6) {
      start = formDataset.saturday_start;
      end = formDataset.saturday_end;
    }
    const data = {};
    if (start)
      data.minTime = new Date(
        new Date(this.date).setHours(...start.split(":"))
      );
    if (end)
      data.maxTime = new Date(new Date(this.date).setHours(...end.split(":")));
    if (formDataset.intervallength)
      data.interval = parseInt(formDataset.intervallength);
    return data;
  };

  // Remove all buttons from container
  this.clearIntervalsContainers = () => {
    [...this.wrapperContainer.querySelectorAll(".time_table__item")].forEach(
      (elt) => elt.remove()
    );
  };

  // Add time buttons in container
  this.fillIntervals = function () {
    // Return array of Date() from startTime to endTime for each button
    getTimeIntervals = () =>
      [...Array(Math.round(this.delta / this.intervalMs))].map(
        (_, i) => new Date(this.startTime.getTime() + i * this.intervalMs)
      );

    !this.animate && this.clearIntervalsContainers();

    const previousItemsData = [
      ...this.wrapperContainer.querySelectorAll(".time_table__item"),
    ].map((e) => e.dataset.hour + "-" + e.dataset.min);

    // create time buttons
    let timerIdx = 0;
    getTimeIntervals().forEach(async (d, i) => {
      const el = document.createElement("div");
      el.innerText = d.toTimeString().slice(0, 5);

      el.classList.add("time_table__item");

      el.dataset.hour = d.getHours();
      el.dataset.min = d.getMinutes();

      el.setAttribute("tabindex", "0");

      if (this.animate) {
        if (
          !previousItemsData.includes(el.dataset.hour + "-" + el.dataset.min)
        ) {
          timerIdx += 1;
          await new Promise((resolve) => setTimeout(resolve, timerIdx * 50));
          el.classList.add("time_table__item--popin");
          this.wrapperContainer.appendChild(el);
        }
      } else {
        this.wrapperContainer.appendChild(el);
      }
    });
  };

  // get prettified date to show on front
  this.prettyDate = () =>
    DAYS[this.date.getDay()] +
    " " +
    this.date.getDate() +
    " " +
    MONTHS[this.date.getMonth()];

  // get prettified time to show on front ie 15:30 - 16:00
  this.prettyTime = (hours = null, minutes = null) => {
    hours = hours || this.date.getHours();
    minutes = minutes || this.date.getMinutes();

    const recallInterval = 15;
    const hoursNext =
      parseInt(minutes) + recallInterval >= 60 ? parseInt(hours) + 1 : hours;

    const minutesNext =
      parseInt(minutes) + recallInterval >= 60
        ? "00"
        : parseInt(minutes) + recallInterval;

    const toDoubleDigit = (n) => ("0" + n).slice(-2);
    const formated = [hours, minutes, hoursNext, minutesNext].map(
      toDoubleDigit
    );

    return (
      formated[0] + ":" + formated[1] + " - " + formated[2] + ":" + formated[3]
    );
  };

  // Set the date printed in container's top
  this.updateControlDate = function () {
    this.controlDiv.querySelector(".time_table__control__date").innerText =
      this.prettyDate();
  };

  // Handler for click on time
  this.handleTimeClick = function (timeButton) {
    [
      ...this.wrapperContainer.querySelectorAll(".time_table__item--selected"),
    ].forEach((elt) => {
      elt.classList.remove("time_table__item--selected");
    });
    timeButton.classList.add("time_table__item--selected");
    this.setTime(timeButton.dataset.hour, timeButton.dataset.min);
  };

  // return starting Date() of next interval for a given time
  this.getNextInterval = function (time) {
    const minutesIntervals = [...Array(60 / this.interval)].map(
      (_, i) => i * this.interval
    );
    const nextInterval = minutesIntervals.filter(
      (i) => time.getMinutes() < i
    )[0];
    return new Date(
      nextInterval
        ? new Date(time).setMinutes(nextInterval, 0)
        : new Date(time).setHours(time.getHours() + 1, 0)
    );
  };

  // Set the time intervals which will be displayed
  this.setTimeRange = function (startTime) {
    startTime =
      this.minTime >= startTime
        ? (startTime = this.minTime)
        : this.getNextInterval(startTime);

    let endHour = new Date(
      new Date(startTime).setHours(
        startTime.getHours() + this.timeRangeInterval
      )
    );
    if (this.maxTime <= endHour) endHour = this.maxTime;

    this.startTime = new Date(startTime);
    this.endTime = new Date(endHour);
    this.delta = this.endTime - this.startTime;
  };

  this.setTime = function (h, m) {
    this.date.setMinutes(parseInt(m));
    this.date.setHours(parseInt(h));
    this.formInput.value = this.date.toLocaleTimeString("fr-FR");
    if (this.callback) return this.callback();
  };

  this.setDate = function (year, month, day) {
    this.date.setYear(year);
    this.date.setMonth(month - 1);
    this.date.setDate(day);
    this.timeRangeInterval =
      window.screen && window.screen.availWidth >= 770 ? 8 : 4;

    // If saturday hours set from back, update min and max times
    const { minTime, maxTime } = this.getDataFromFormDataset();
    this.minTime = minTime || this.minTime;
    this.maxTime = maxTime || this.maxTime;

    let rangeStartTime = this.minTime;
    const now = new Date();
    // if today, min time should not be less than now
    if (this.date.toJSON().split("T")[0] === now.toJSON().split("T")[0]) {
      rangeStartTime = now;
    }
    this.resetDisplayedTimeRange(rangeStartTime);
    this.displayTimeRangeButtons(rangeStartTime.getHours());
  };

  // Usefull to update date when form date field is set,
  // can be used as a handler for change event
  this.setDateFromString = function (dateString) {
    if (!dateString) return;
    this.setDate(...dateString.split("-"));
  };

  // Show/hide "Plus tard" button
  this.displayTimeRangeButtons = function (startHour) {
    this.timeChangeButton.classList.remove("hidden");
    if (this.maxTime.getHours() <= startHour + this.timeRangeInterval) {
      this.timeChangeButton.classList.add("hidden");
    }
  };

  // Handler for "Plus tard" click
  this.updateTimeRange = function (ev) {
    let startHour = this.startTime.getHours();
    const but = ev.target;
    this.timeRangeInterval += this.timeRangeIntervalStep;
    this.setTimeRange(this.startTime);
    this.displayTimeRangeButtons(startHour);
    this.fillIntervals();
    this.containerDiv.focus();
  };

  // Attach event to component elements
  this.addControlEvents = function () {
    this.controlDiv
      .querySelector(".time_table__control__button")
      .addEventListener("click", () => {
        this.previousStepCallback();
      });
    this.controlDiv
      .querySelector(".time_table__control__button")
      .addEventListener("keypress", (e) => {
        e.key === "Enter" && this.previousStepCallback();
      });
    this.containerDiv.addEventListener("keydown", (e) => {
      e.key === "Escape" && this.previousStepCallback();
      e.target.classList.contains("time_table__item") &&
        e.key === "Enter" &&
        this.handleTimeClick(e.target);
    });
    this.timeChangeButton.addEventListener("click", (ev) => {
      this.updateTimeRange(ev);
    });
    this.timeChangeButton.addEventListener("keydown", (ev) => {
      ev.key === "Enter" && this.updateTimeRange(ev);
    });
    this.wrapperContainer.addEventListener("click", (ev) => {
      const target = ev.target;
      if (!target.classList.contains("time_table__item")) return;
      this.handleTimeClick(target);
    });
  };

  // reset component buttons
  this.resetDisplayedTimeRange = function (rangeStartTime) {
    this.clearIntervalsContainers();
    this.setTimeRange(rangeStartTime);
    this.fillIntervals();
    this.updateControlDate();
    this.displayTimeRangeButtons(rangeStartTime.getHours());
  };

  // Start component (to be use at page load)
  this.bind = function () {
    this.init();
    this.resetDisplayedTimeRange(this.minTime);
    this.addControlEvents();
  };
  this.bind();
}
