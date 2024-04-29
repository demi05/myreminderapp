"use strict";

const title = document.querySelector("#title");
const description = document.querySelector("#description");
const date = document.querySelector("#reminder-date");
const time = document.querySelector("#reminder-time");
const reminderBtn = document.querySelector("#set-reminder-btn");
const card = document.querySelector("#card-section");
const reminderModal = document.querySelector("#reminder-modal");
const reminderModalP = document.querySelector("#reminder-modal-p");
const reminderModalBtn = document.querySelector("#reminder-modal-btn");

document.addEventListener("DOMContentLoaded", function () {
  loadReminders();
  checkReminders();
});

reminderBtn.addEventListener("click", () => {
  if (validateInputs()) {
    addReminder();
    saveReminders();
    clearInputs();
  }
});

card.addEventListener("click", function (e) {
  if (e.target.classList.contains("close")) {
    e.target.parentElement.remove();
    saveReminders();
  } else if (e.target.classList.contains("save")) {
    saveChanges(e.target.parentElement);
    saveReminders();
  }
});

document.addEventListener("click", (event) => {
  if (
    !reminderModal.contains(event.target) &&
    !event.target.matches("#reminder-modal-btn")
  ) {
    reminderModal.classList.add("hidden");
  }
});

function validateInputs() {
  let isValid = true;
  [title, description, date, time].forEach((input) => {
    if (!input.value.trim()) {
      alert("All fields must be filled!");
      isValid = false;
    }
  });
  const reminderDateTime = new Date(`${date.value} ${time.value}`);
  if (reminderDateTime < new Date()) {
    alert("Reminder must be set for a future time!");
    isValid = false;
  }
  return isValid;
}

function addReminder() {
  const reminderCard = document.createElement("div");
  reminderCard.innerHTML = `
    <input type="text" class="editable-title" style="width:100%" value="${title.value}" />
    <textarea class="editable-description" style="width:100%">${description.value}</textarea>
    <input type="date" class="editable-date" style="width:100%" value="${date.value}" />
    <input type="time" class="editable-time" style="width:100%" value="${time.value}" />
    <button class="save">Save</button>
    <button class="close">Close</button>
  `;
  reminderCard.style.padding = "1em";
  card.appendChild(reminderCard);
}

function saveChanges(reminderCard) {
  const title = reminderCard.querySelector(".editable-title").value;
  const description = reminderCard.querySelector(".editable-description").value;
  const date = reminderCard.querySelector(".editable-date").value;
  const time = reminderCard.querySelector(".editable-time").value;
  reminderCard.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
    <p>${date} at ${time}</p>
    <button class="close">Close</button>
  `;
}

function saveReminders() {
  localStorage.setItem("reminders", card.innerHTML);
}

function loadReminders() {
  card.innerHTML = localStorage.getItem("reminders") || "";
}

function clearInputs() {
  title.value = "";
  description.value = "";
  date.value = "";
  time.value = "";
}

function showModal(reminderText) {
  reminderModalP.textContent = `Reminder: ${reminderText}`;
  reminderModal.classList.remove("hidden");
}

function hideModal() {
  reminderModal.classList.add("hidden"); // Hide the modal
  console.log("okayy. click");
}

reminderModalBtn.addEventListener("click", hideModal);

function playSound() {
  const audio = new Audio("../assets/nice_alert_tone.mp3");
}

function checkReminders() {
  const now = new Date();
  document.querySelectorAll("#card-section div").forEach((reminderCard) => {
    const titleElement = reminderCard.querySelector("h2");
    const dateTimeElement = reminderCard.querySelector("p:nth-child(3)");
    if (titleElement && dateTimeElement) {
      const dateTimeStr = dateTimeElement.textContent.split(" at ");
      const reminderDateTime = new Date(`${dateTimeStr[0]} ${dateTimeStr[1]}`);
      if (reminderDateTime <= now) {
        showModal(titleElement.textContent);
        playSound();
        reminderCard.remove();
        saveReminders();
      }
    }
  });
  setTimeout(checkReminders, 60000); // Recheck every minute
}
