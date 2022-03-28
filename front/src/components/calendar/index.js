function Calendar(initData = {}) {
  const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  this.setUp = function() {
    const today = new Date();
    const initial = {
      date: today,
      callback: null,
      minDate: today,
      maxDate: new Date(new Date(today).setMonth(today.getMonth() + 6)),
      closedDaysIndex: [0],
      ...initData,
      ...this.getDataFromFormDataset(),
    };
    Object.assign(this, initial);

    const formElts = {
      wrapperDiv: document.querySelector(".calendar__days__wrapper"),
      controlDiv: document.querySelector(".calendar__control"),
      formInput: document.querySelector("input.calendar__input"),
    };
    Object.assign(this, formElts);

    this.dateDay = this.date.getDate();
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
  };

  this.getDataFromFormDataset = function() {
    const formDatasetDiv = document.querySelector(".calendar__data");
    if (!formDatasetDiv) return;
    const formDataset = formDatasetDiv.dataset;
    const data = {};
    const startHour = formDataset.start || "09:00:00";
    const endHour = formDataset.end || "19:00:00";
    if (formDataset.start_day)
      data.minDate = new Date(
        new Date(formDataset.start_day).setHours(...startHour.split(":"))
      );
    if (formDataset.end_day)
      data.maxDate = new Date(
        new Date(formDataset.end_day).setHours(...endHour.split(":"))
      );
    data.closedDaysIndex = [0];
    formDataset.saturday_start === formDataset.saturday_end &&
      data.closedDaysIndex.push(6);
    return data;
  };

  this.fillDays = function() {
    getDaysOfMonth = () => {
      const lastDay = new Date(this.year, this.month + 1, 0);
      return [...Array(lastDay.getDate())].map(
        (_, i) => new Date(this.year, this.month, i + 1)
      );
    };

    cleanDays = () => {
      [...this.wrapperDiv.querySelectorAll(".calendar__day")].forEach((e) =>
        e.remove()
      );
    };

    cleanDays();
    getDaysOfMonth().forEach((d) => {
      const el = document.createElement("div");
      const dayIndex = d.getDay();
      const now = new Date();
      d.setHours(now.getHours(), now.getMinutes());

      el.innerText = d.getDate();

      el.classList.add("day-" + dayIndex);
      el.classList.add("calendar__day");
      el.classList.add("calendar__item");
      const isActive = !(
        this.closedDaysIndex.includes(dayIndex) ||
        d < this.minDate ||
        d > this.maxDate
      );

      !isActive && el.classList.add("calendar__day--inactive");
      isActive && el.setAttribute("tabindex", "0");

      el.dataset.date = d.getDate();
      el.dataset.month = d.getMonth();
      el.dataset.year = d.getFullYear();
      this.wrapperDiv.appendChild(el);
    });
  };

  this.updateControls = function() {
    updateControlDate = () => {
      this.controlDiv.querySelector(".calendar__control__date").innerText =
        MONTHS[this.month] + " " + this.year;
    };
    updateControlButtons = () => {
      const buttons = [
        ...this.controlDiv.querySelectorAll(".calendar__control__button"),
      ];
      buttons.forEach((elt) => elt.classList.remove("hidden"));
      const openDays = [
        ...this.wrapperDiv.querySelectorAll(".calendar__day:not(.day-0)"),
      ];
      if (openDays[0].classList.contains("calendar__day--inactive"))
        buttons[0].classList.add("hidden");
      if (
        openDays[openDays.length - 1].classList.contains(
          "calendar__day--inactive"
        )
      )
        buttons[1].classList.add("hidden");
    };
    updateControlDate();
    updateControlButtons();
  };

  this.updateCalendar = function() {
    this.fillDays();
    this.updateControls();
  };

  this.setDate = function(y, m, d) {
    Object.assign(this, { dateDay: d, month: m, year: y });
    this.date = new Date(this.year, this.month, this.dateDay, 12);
    this.formInput.value = this.date.toJSON().split("T")[0];
    if (this.callback) return this.callback();
  };

  this.handleDateClick = function(dateButton) {
    if (dateButton.classList.contains("calendar__day--inactive")) return;
    [...this.wrapperDiv.querySelectorAll(".calendar__day--selected")].forEach(
      (elt) => {
        elt.classList.remove("calendar__day--selected");
      }
    );
    dateButton.classList.add("calendar__day--selected");
    const { year, month, date } = dateButton.dataset;
    this.setDate(...[year, month, date].map((e) => parseInt(e)));
  };

  this.showNextMonth = function() {
    this.month = this.month < 11 ? this.month + 1 : 0;
    this.year = this.month !== 0 ? this.year : this.year + 1;
    this.updateCalendar();
  };

  this.showPrevMonth = function() {
    this.month = this.month > 0 ? this.month - 1 : 11;
    this.year = this.month !== 11 ? this.year : this.year - 1;
    this.updateCalendar();
  };

  this.addControlEvents = function() {
    this.controlDiv
      .querySelector(".calendar__control--prev")
      .addEventListener("click", () => {
        this.showPrevMonth();
      });
    this.controlDiv
      .querySelector(".calendar__control--next")
      .addEventListener("click", () => {
        this.showNextMonth();
      });
    this.wrapperDiv.addEventListener("click", (ev) => {
      const button = ev.target;
      if (!button.classList.contains("calendar__day")) return;
      this.handleDateClick(button);
    });
    this.wrapperDiv.addEventListener("keypress", (ev) => {
      ev.target.classList.contains("calendar__day") &&
        !ev.target.classList.contains("calendar__day--inactive") &&
        ev.key == "Enter" &&
        this.handleDateClick(ev.target);
    });
  };

  this.bind = function() {
    this.setUp();
    this.fillDays();
    this.updateControls();
    this.addControlEvents();
  };
  this.bind();
}


//{% load static %}
//<div  {% include "django/forms/widgets/attrs.html" %}>
//    <input type='text' class="calendar__input form-control" name="{{ widget.name }}"{% if widget.value != None %} value="{{ widget.value|stringformat:'s' }}"{% endif %} hidden/>
//    <div class="calendar__container">
//        <div class="calendar__data hidden"
//        {% for key, value in working_hours.items %}
//            data-{{key}}="{{value}}" 
//        {% endfor %}
//        {% for key, value in opening_days.items %}
//            data-{{key}}="{{value}}" 
//        {% endfor %}
//        data-intervallength={{time_range_interval}}
//        >
//        </div>
//        <div class="calendar__title">
//            Sélectionnez la date et l’heure
//        </div>
//        <div class="calendar__control">
//            <div class="calendar__control__button__wrapper">
//                <img class="calendar__control--prev calendar__control__button" src="{% static 'pages_commons/img/chevron-left-dark.svg' %}" alt=" select previous month"/>
//            </div>
//            <div class="calendar__control__date"> Février </div>
//            <div class=" calendar__control__button__wrapper">
//                <img class="calendar__control--next calendar__control__button" src="{% static 'pages_commons/img/chevron-right-dark.svg' %}" alt=" select next month"/>
//            </div>
//        </div>
//        <div class="calendar__days__wrapper">
//            {% for d in "LMMJVSD" %}
//            <div class="day-{{ forloop.counter }} calendar__header__day calendar__item"> {{ d }} </div> 
//            {% endfor %}
//        </div>
//    </div>
//</div>

