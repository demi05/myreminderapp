"use strict";

//declaring variables
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const date = document.querySelector("#reminder-date");
const time = document.querySelector("#reminder-time");
const reminderBtn = document.querySelector("#set-reminder-btn");
const card = document.querySelector("#card-section");
const reminderModal = document.querySelector("#reminder-modal");
const reminderModalP = document.querySelector("#reminder-modal-p");
const reminderModalBtn = document.querySelector("#reminder-modal-btn");

//loading the reminders on page reload
document.addEventListener("DOMContentLoaded", function () {
  loadReminders();
  checkReminders();
});

//submitting the reminder details
reminderBtn.addEventListener("click", () => {
  if (validateInputs()) {
    addReminder();
    saveReminders();
    clearInputs();
  }
});

//save or close the reminder
card.addEventListener("click", function (e) {
  if (e.target.classList.contains("close")) {
    e.target.parentElement.remove();
    saveReminders();
  } else if (e.target.classList.contains("save")) {
    saveChanges(e.target.parentElement);
    saveReminders();
  }
});

//make sure all inpits are valid
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

//make the reminder editable
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

//save the changes to the edited reminder
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

//save the reminders to local storage
function saveReminders() {
  localStorage.setItem("reminders", card.innerHTML);
}

//load reminders
function loadReminders() {
  card.innerHTML = localStorage.getItem("reminders") || "";
}

//clear the input fields once the set reminder button is clicked
function clearInputs() {
  title.value = "";
  description.value = "";
  date.value = "";
  time.value = "";
}

//show reminder modal once the time elapsed
function showModal(reminderText) {
  reminderModalP.textContent = `Reminder: ${reminderText}`;
  reminderModal.classList.remove("hidden");
}

//function to hide the reminder modal
function hideModal() {
  reminderModal.classList.add("hidden"); // Hide the modal
  console.log("okayy. click");
}

//hide  the modal once the close button is clicked
reminderModalBtn.addEventListener("click", hideModal);

//play the sound once the reminder modal shows
function playSound() {
  const audio = new Audio("../assets/nice_alert_tone.mp3");
  audio.play().catch((e) => console.error("Error playing sound:", e)); // Play the audio and catch any errors
}

//check if the time has elapsed and show the reminder modal
function checkReminders() {
  const now = new Date();
  document.querySelectorAll("#card-section div").forEach((reminderCard) => {
    const titleElement = reminderCard.querySelector("h2");
    const dateTimeElement = reminderCard.querySelector("p:nth-child(3)");
    if (titleElement && dateTimeElement) {
      const dateTimeStr = dateTimeElement.textContent.split(" at ");
      const reminderDateTime = new Date(dateTimeStr[0] + "T" + dateTimeStr[1]);
      console.log("Reminder Time:", reminderDateTime);
      console.log("Current Time:", now);
      if (reminderDateTime <= now) {
        showModal(titleElement.textContent);
        playSound();
        reminderCard.remove();
        saveReminders();
      }
    }
  });

  setTimeout(checkReminders, 1000); // Check feedback every second
}
