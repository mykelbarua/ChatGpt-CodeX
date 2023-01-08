import bot from "/assets/bot.svg";
import user from "/assets/user.svg";

const chatContainer = document.querySelector("#chat_container");
const form = document.querySelector("form");

let loadInterval;

// loader function for loading sign
function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

// typeText function is for getting animation flavour when answer will be print
function typeText(element, text) {
  let index = 0;
  const interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// For getting a unique id
function generateUniqueId() {
  const date = Date.now();
  const randomNumber = Math.random();
  const randomNumberHexa = randomNumber.toString(16);

  return `id-${date}-${randomNumberHexa}`;
}

// For generating chat template
function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi ? "bot" : "user"}">
      <div class="chat">
      <div class="profile">
      <img src="${isAi ? bot : user}" alt="${isAi ? bot : user}" />
       </div>
       <div class="message" id="${uniqueId}">${value}</div>
       </div>
    </div>
    `;
}

// Handle form data
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  form.reset();

  // bot chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, "", uniqueId);

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  const response = await fetch("https://chatgpt-codex-blvs.onrender.com/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";
  if (response.ok) {
    const data = await response.json();
    const prasedData = data.bot.trim();

    typeText(messageDiv, prasedData);
  } else {
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong";
    alert({ err });
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSubmit(e);
  }
});
