const CREDENTIAL_KEY = "credentials";
/**
 * Version methods
 */
// Gets the version
async function getVersion() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Version`);
  const data = await response.text();
  return data;
}
// Sets the html version with the version fetched
async function showVersion() {
  const versionText = await getVersion(); // Get the version with method
  document.getElementById("version").innerText = versionText; // Set the text to the version
}

/**
 * Sign methods
 */
async function fetchNZSLsigns(term) {
  let response;
  if (!term) {
    response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/AllSigns`);
  } else {
    response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Signs/${term}`);
  }
  const data = await response.json();
  return data.map((sign) => {
    return {
      description: sign.description,
      id: sign.id,
      image: `https://cws.auckland.ac.nz/nzsl/api/SignImage/${sign.id}`,
    };
  });
}
function formatSigns(signs) {
  return signs
    .map((sign) => {
      return `<div class="sign">
      <div>
        ${sign.id}
        ${sign.description}
      </div>
      <img src="${sign.image}"/>
    </div>`;
    })
    .join("\n");
}
function displaySigns(signHTML) {
  const signDiv = document.getElementById("nzsl-signs");
  signDiv.innerHTML = signHTML;
}

/**
 * Event methods
 */
async function getNumberEvents() {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/EventCount`,
  );
  const data = await response.text();
  return parseInt(data);
}
async function getEvent(eventID) {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/Event/${eventID}`,
    {
      headers: { Accept: "text/plain" },
    },
  );
  const data = await response.text();
  return data;
}
function functionParseDate(dateString) {
  // 2024-09-03T01:00:00Z
  const year = dateString.substring(0, 4); // 2024
  const month = dateString.substring(4, 6); // 09
  const day = dateString.substring(6, 8); // 03
  const hour = dateString.substring(9, 11); // 01
  const minutes = dateString.substring(11, 13); // 00
  const seconds = dateString.substring(13, 15); // 00
  const newDate = new Date(
    `${year}-${month}-${day}T${hour}:${minutes}:${seconds}Z`,
  );
  return newDate.toLocaleString();
}
function parseVcalendar(calendar, id) {
  const splitted = calendar.split("\n").map((x) => x.split(":")[1]);
  console.log(splitted);
  return {
    start: functionParseDate(splitted[6]),
    end: functionParseDate(splitted[7]),
    timezone: splitted[8],
    summary: splitted[9],
    description: splitted[10],
    lcocation: splitted[11],
    url: `https://cws.auckland.ac.nz/nzsl/api/Event/${id}`,
  };
}
async function getEvents(eventCount) {
  const eventOutput = [];
  for (let i = 0; i < eventCount; i++) {
    const fetchedEvent = await getEvent(i);
    const parsedCalendar = parseVcalendar(fetchedEvent, i);
    eventOutput.push(parsedCalendar);
  }
  return eventOutput;
}
async function displayEvents() {
  // Fetch event count
  const eventCount = await getNumberEvents();
  // Fetch all events and returns a list of parsed events
  const allEvents = await getEvents(eventCount);
  // Convert the data to HTML
  const formattedEventHTML = formatEvents(allEvents);
  // Display the events html
  const eventDiv = document.getElementById("nzsl-events");
  eventDiv.innerHTML = formattedEventHTML;
}
function formatEvents(events) {
  return events
    .map((event) => {
      return `<div class="event">
      <h2>${event.summary}</h2>
      <a href="${event.url}">
        <button>Click to download event</button>
      </a>
      <br/>
      <strong>Description</strong>: ${event.description}
      <br/>
      <strong>Location</strong>: ${event.lcocation}
      <br/>
      <strong>Starts</strong>: ${event.start}
      <br/>
      <strong>Ends</strong>: ${event.end}
  </div>`;
    })
    .join("\n");
}

/**
 * Comment methods
 */
async function getAllComments() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Comments`);
  const data = await response.text();
  return data;
}
async function displayComments() {
  const commentsDiv = document.getElementById("nzsl-comments");
  commentsDiv.innerHTML = await getAllComments();
}
async function addComment(comment) {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/Comment?comment=${comment}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${getSession(CREDENTIAL_KEY)}`,
      },
    },
  );
  const data = await response.text();
  return data;
}
async function submitComment(event) {
  event.preventDefault();
  // Check for auth
  if (getSession(CREDENTIAL_KEY) == null) {
    return showSection("login");
  }
  console.log(getSession(CREDENTIAL_KEY));
  const form = event.target;
  const formData = new FormData(form);
  // Convert form data to an object (optional, for easier use)
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  await addComment(data.comment);
  showSection("guest-book");
}
/**
 * Auth methods
 */
async function register(username, password, address) {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Register`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      password: password,
      address: address,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.text();
  // Can directly return the data and let the outer methods check the message
  // This endpoint returns 200 regardless of conflicts or success
  return data;
}
async function login(username, password) {
  try {
    const response = await fetch(
      `https://cws.auckland.ac.nz/nzsl/api/TestAuth`,
      {
        headers: {
          Authorization: `Basic ${convertToBase64(username, password)}`,
        },
      },
    );
    if (response.status === 200) {
      return true;
    }
  } catch (e) {}
  return false;
}
async function submitLogin(event) {
  event.preventDefault();
  // Check for auth
  const form = event.target;
  const formData = new FormData(form);
  // Convert form data to an object (optional, for easier use)
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  const output = await login(data.username, data.password);
  console.log(output);
  if (output) {
    storeSession(CREDENTIAL_KEY, convertToBase64(data.username, data.password));
    showSection("home");
  } else {
    showSection("login");
    document.getElementById("errors").innerText = "Invalid login.";
  }
}

async function logout() {
  await clearSession();
  return showSection("login");
}
function convertToBase64(username, password) {
  return btoa(`${username}:${password}`);
}
function storeSession(key, value) {
  return localStorage.setItem(key, value);
}
function getSession(key) {
  return localStorage.getItem(key);
}
async function clearSession() {
  return localStorage.clear();
}
// if (response.status == 200) {
//   data = await response.json();
//   console.log(data);
//   const signElement = document.getElementById("output");
//   signElement.textContent = `${data.map((sign) => `${sign.description}`).join("\n")}`;
// } else if (response.status == 404) {
//   const signElement = document.getElementById("output");
//   signElement.textContent = `${data.map((sign) => `${sign.description}`).join("\n")}`;
//   signElement.textContent = ``;
// }

async function showSection(section) {
  const sections = document.querySelectorAll("section");
  sections.forEach((sect) => {
    sect.style.display = "none";
  });
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.reset();
  });
  if (section == "nzsl") {
    // Reset the search bar
    const searchBar = document.getElementById("nzsl-search");
    searchBar.value = "";
    // Fetch all the signs
    const signs = await fetchNZSLsigns("");
    const formattedSigns = formatSigns(signs);
    displaySigns(formattedSigns);
  }
  if (section == "events") {
    displayEvents();
  }
  if (section == "guest-book") {
    displayComments();
  }
  document.getElementById(section).style.display = "block";
  // Hide all authd stuff
  if (getSession(CREDENTIAL_KEY) !== null) {
    document.getElementById("login-li").style.display = "none";
    document.getElementById("register-li").style.display = "none";
    document.getElementById("logout-li").style.display = "block";
  } else {
    document.getElementById("login-li").style.display = "block";
    document.getElementById("register-li").style.display = "block";
    document.getElementById("logout-li").style.display = "none";
  }
}

function createSearchListener() {
  const input = document.getElementById("nzsl-search");
  input.addEventListener("input", async (event) => {
    const term = event.target.value;
    const signs = await fetchNZSLsigns(term);
    const formattedSigns = formatSigns(signs);
    displaySigns(formattedSigns);
  });
}
// Responsive navbar
// function myFunction() {
//   var x = document.getElementById("nav");
//   if (x.className === "navbar") {
//     x.className += " responsive";
//   } else {
//     x.className = "navbar";
//   }
// }
// Add search bar logic
// Show version at footer
showVersion();
createSearchListener();
// Hide all authd stuff
document.getElementById("logout-li").style.display = "none";
if (getSession(CREDENTIAL_KEY) !== null) {
  document.getElementById("login-li").style.display = "none";
  document.getElementById("register-li").style.display = "none";
  document.getElementById("logout-li").style.display = "block";
}
