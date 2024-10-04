/**
 * Constants
 */
const CREDENTIAL_KEY = "credentials"; // The constant key for credentials in session data

/**
 * Version methods
 */

/**
 * Fetches the version of the NZSL API
 * @returns {Promise<string>} - The version of the API
 */
async function getVersion() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Version`);
  const versionText = await response.text();
  return versionText;
}

/**
 * Sets the html version with the version fetched.
 */
async function showVersion() {
  const versionText = await getVersion(); // Get the version with method
  document.getElementById("version").innerText = versionText; // Set the text to the version
}

/**
 * Sign methods
 */

/**
 * Fetches all NZSL signs
 * @returns {Promise<Array>} - The array of signs
 */
async function fetchAllNZSLSigns() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/AllSigns`);
  const signsData = await response.json();
  return signsData.map((sign) => {
    return {
      description: sign.description,
      id: sign.id,
      image: `https://cws.auckland.ac.nz/nzsl/api/SignImage/${sign.id}`,
    };
  });
}

/**
 * Fetches NZSL signs by term
 * @param {string} term - The term to search for
 * @returns {Promise<Array>} - The array of signs
 */
async function fetchNZSLSignsByTerm(term) {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/Signs/${term}`,
  );
  const signsData = await response.json();
  return signsData.map((sign) => {
    return {
      description: sign.description,
      id: sign.id,
      image: `https://cws.auckland.ac.nz/nzsl/api/SignImage/${sign.id}`,
    };
  });
}

/**
 * Fetches signs and returns the correct function to return either all signs or a search by the term.
 * @param {Promise<string>} term - The term to search for
 */
async function fetchNZSLSigns(term) {
  if (!term || term == "") {
    return await fetchAllNZSLSigns();
  } else {
    return await fetchNZSLSignsByTerm(term);
  }
}

/**
 * Formats the signs and returns the formatted HTML.
 * @param {Array} signs - The array of signs
 * @returns {string} - The formatted HTML
 */
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

/**
 * Displays the signs in the HTML
 * @param {string} signHTML - The HTML to display
 */
function displaySigns(signHTML) {
  const signDiv = document.getElementById("nzsl-signs");
  signDiv.innerHTML = signHTML;
}

/**
 * Event methods
 */

/**
 * Fetches the number of events.
 * @returns {Promise<number>} - The number of events
 */
async function getNumberEvents() {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/EventCount`,
  );
  const data = await response.text();
  return parseInt(data);
}

/**
 * Fetches an event by ID.
 * @param {number} eventID - The event ID
 * @returns {Promise<string>} - The event data in plain text
 */
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

/**
 * Parses the date string and returns the parsed date.
 * Converts the ISO date into NZ time.
 * @param {string} dateString - The date string
 * @param {string} timezone - The timezone
 * @returns {string} - The parsed date
 */
function parseDate(dateString) {
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
  return newDate.toLocaleString([], {
    timeZone: "Pacific/Auckland",
    hour12: true,
  });
}

/**
 * Parses the vcalendar data and returns the parsed data.
 * @param {string} calendar - The calendar data
 * @param {number} id - The event ID
 * @returns {Object} - The parsed data
 */
function parseVcalendar(calendar, id) {
  const splitted = calendar.split("\n").map((x) => x.split(":")[1]);
  return {
    start: parseDate(splitted[6]),
    end: parseDate(splitted[7]),
    timezone: splitted[8],
    summary: splitted[9],
    description: splitted[10],
    lcocation: splitted[11],
    url: `https://cws.auckland.ac.nz/nzsl/api/Event/${id}`,
  };
}

/**
 * Fetches all events and returns the parsed events.
 * @param {number} eventCount - The number of events
 * @returns {Promise<Array>} - The array of parsed events
 */
async function getEvents(eventCount) {
  const eventOutput = [];
  for (let i = 0; i < eventCount; i++) {
    const fetchedEvent = await getEvent(i);
    const parsedCalendar = parseVcalendar(fetchedEvent, i);
    eventOutput.push(parsedCalendar);
  }
  return eventOutput;
}

/**
 * Formats the events and returns the formatted HTML.
 * @param {Array} events - The array of events
 * @returns {string} - The formatted HTML
 */
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
 * Displays the events in the HTML
 */
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

/**
 * Comment methods
 */

/**
 * Fetches all comments and returns the comments.
 * @returns {Promise<string>} - The comments in plain text
 */
async function getAllComments() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Comments`);
  const data = await response.text();
  return data;
}

/**
 * Displays the comments in the HTML
 */
async function displayComments() {
  const commentsDiv = document.getElementById("nzsl-comments");
  commentsDiv.innerHTML = await getAllComments();
}

/**
 * Adds a comment to the server.
 * @param {string} comment - The comment to add
 * @returns {Promise<string>} - The response from the server
 */
async function addComment(comment) {
  try {
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
  } catch (e) {
    throw new Error("An error occurred.");
  }
}

/**
 * The form submission method to create a comment.
 * @param {Event} event - The form submission event
 */
async function submitComment(event) {
  event.preventDefault();
  // Check for auth
  if (getSession(CREDENTIAL_KEY) == null) {
    return showSection("login");
  }
  const form = event.target;
  const formData = new FormData(form);
  // Convert form data to an object (optional, for easier use)
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  try {
    await addComment(data.comment);
    return showSection("guest-book");
  } catch (e) {
    showSection("guest-book");
    console.log("an error");
    document.getElementById("comment-errors").innerText = "An error occurred.";
  }
}

/**
 * Auth methods
 */

/**
 * Registers a new user.
 * Note that the endpoint returns 200 regardless of a conflicted username or success.
 * Can directly return the data and let the outer methods check the message.
 * @param {string} username - The username
 * @param {string} password - The password
 * @param {string} address - The address
 * @returns {Promise<string>} - The response from the server
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
  return data;
}

/**
 * The form submission method to register a user.
 * @param {Event} event - The form submission event
 */
async function submitRegister(event) {
  event.preventDefault();
  // Check for auth
  const form = event.target;
  const formData = new FormData(form);
  // Convert form data to an object (optional, for easier use)
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  const output = await register(data.username, data.password, data.address);
  console.log(output);
  if (output == "Username not available") {
    showSection("register");
    document.getElementById("register-errors").innerText =
      "Username not available";
  } else {
    showSection("login");
    document.getElementById("success").innerText = "Successfully registered!";
  }
}

/**
 * Logs in a user.
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<boolean>} - The response from the server
 */
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

/**
 * The form submission method to test a users authentication.
 * @param {Event} event - The form submission event
 */
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
  if (output) {
    storeSession(CREDENTIAL_KEY, convertToBase64(data.username, data.password));
    showSection("home");
  } else {
    showSection("login");
    document.getElementById("login-errors").innerText =
      "Username or password was invalid.";
  }
}

/**
 * Logs out the user and redirects to the login page after.
 */
function logout() {
  clearSession();
  return showSection("login");
}

/**
 * Log methods
 */

/**
 * Fetches the logs from the server.
 */
async function fetchLogs() {
  const res = await fetch("https://cws.auckland.ac.nz/nzsl/api/Log");
  const logs = await res.json();
  return logs;
}

/**
 * Displays the logs on the page.
 */
async function displayLogs() {
  // Fetch logs and create svg
  const logs = await fetchLogs();
  const svg = createLogSVG(logs);
  // Set start date and end date td
  setLogDates(logs);
  setLogData(logs);
  // Fetch logs divider and set inner html to the svg
  const logsDiv = document.getElementById("nzsl-logs");
  logsDiv.innerHTML = svg;
}

/**
 * Sets the start and end date of the logs.
 * @param {Array} logs - The logs to set the dates for
 */
function setLogDates(logs) {
  const datesDiv = document.getElementById("log-dates");
  const startDate = logs[0].date;
  const endDate = logs[logs.length - 1].date;
  datesDiv.innerHTML = `<tr>
    <td style="text-align: left;">${startDate}</td>
    <td style="text-align: right;">${endDate}</td>
  </tr>`;
}

/**
 * Sets the log data in the log-data div.
 * @param {Array} logs - The logs to set the data for
 */
function setLogData(logs) {
  const visits = logs.map((log) => log.visits).join(",");
  const uniqueVisits = logs.map((log) => log.uniqueVisits).join(",");
  const dataDiv = document.getElementById("log-data");
  dataDiv.innerHTML = `${visits}<br/>${uniqueVisits}`;
}

/**
 * Creates an SVG element to display the logs.
 * @param {Array} logs - The logs to display
 * @returns {string} - The SVG element as a string
 */
function createLogSVG(logs) {
  const numberOfDays = logs.length;

  const maxCount = Math.max(...logs.map((log) => log.visits));
  const minCount = Math.min(...logs.map((log) => log.uniqueVisits));

  const dayWidth = 920 / (numberOfDays - 1);
  const countHeight = 350 / (maxCount - minCount);

  const visitLine = logs.map((log, index) => {
    return `${80 + index * dayWidth},${350 - (log.visits - minCount) * countHeight}`;
  });
  const uniqueVisitLine = logs.map((log, index) => {
    return `${80 + index * dayWidth},${350 - (log.uniqueVisits - minCount) * countHeight}`;
  });

  const svg = `<svg viewBox="0 0 1000 350" xmlns="http://www.w3.org/2000/svg">
    <!-- Axis lines -->
    <line x1="80" y1="0" x2="80" y2="350" stroke="white" stroke-width="3"/>
    <line x1="80" y1="350" x2="1000" y2="350" stroke="white" stroke-width="4"/>
    <line x1="1000" y1="0" x2="1000" y2="350" stroke="white" stroke-width="3"/>
    <line x1="80" y1="0" x2="1000" y2="0" stroke="white" stroke-width="3"/>

    <!-- Min and max count labels -->
    <text x="10" y="340" font-family="Arial" fill="white" font-size="25">${minCount}</text>
    <text x="10" y="20" font-family="Arial" fill="white" font-size="25">${maxCount}</text>

    <!-- Visit line -->
    <polyline points="${visitLine.join(" ")}" fill="none" stroke="red" stroke-width="3"/>

    <!-- Unique visit line -->
    <polyline points="${uniqueVisitLine.join(" ")}" fill="none" stroke="green" stroke-width="3"/>
  </svg>`;
  return svg;
}

/**
 * Helper methods
 */

/**
 * Converts a username and password to base64.
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {string} - The base64 encoded string
 */
function convertToBase64(username, password) {
  return btoa(`${username}:${password}`);
}

/**
 * Stores a session in local storage.
 * @param {string} key - The key to store the session under
 * @param {string} value - The value to store
 */
function storeSession(key, value) {
  return localStorage.setItem(key, value);
}

/**
 * Gets a session from local storage.
 * @param {string} key - The key to get the session from
 * @returns The value of the session
 */
function getSession(key) {
  return localStorage.getItem(key);
}

/**
 * Clears the session from local storage.
 */
function clearSession() {
  return localStorage.clear();
}

/**
 * Checks the session and updates the page accordingly.
 */
function checkSession() {
  if (getSession(CREDENTIAL_KEY) !== null) {
    document.getElementById("login-li").style.display = "none";
    document.getElementById("register-li").style.display = "none";
    document.getElementById("logout-li").style.display = "block";
    document.getElementById("status").innerHTML =
      `Logged in as: <i>${atob(getSession(CREDENTIAL_KEY)).split(":")[0]}</i>`;
  } else {
    document.getElementById("login-li").style.display = "block";
    document.getElementById("register-li").style.display = "block";
    document.getElementById("logout-li").style.display = "none";
    document.getElementById("status").innerText = "";
  }
}

/**
 * Resets all the status messages on the page.
 */
function resetStatusMessages() {
  document.getElementById("login-errors").innerText = "";
  document.getElementById("register-errors").innerText = "";
  document.getElementById("comment-errors").innerText = "";
  document.getElementById("success").innerText = "";
}

/**
 * The main method to show a section.
 * @param {string} section - The section to show
 */
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
    const signs = await fetchNZSLSigns("");
    const formattedSigns = formatSigns(signs);
    displaySigns(formattedSigns);
  }
  if (section == "events") {
    displayEvents();
  }
  if (section == "guest-book") {
    displayComments();
  }
  if (section == "log") {
    displayLogs();
  }
  // Hide all authenticated stuff
  checkSession();
  // Reset all errors
  resetStatusMessages();
  // Display the section requested
  document.getElementById(section).style.display = "block";
}

/**
 * The method to create the search bar listener to actively shrink the results of signs.
 */
function createSearchListener() {
  const input = document.getElementById("nzsl-search");
  input.addEventListener("input", async (event) => {
    const term = event.target.value;
    const signs = await fetchNZSLSigns(term);
    const formattedSigns = formatSigns(signs);
    displaySigns(formattedSigns);
  });
}

// Show version at footer
showVersion();
// Add searchbar listener
createSearchListener();
// Hide all authenticated buttons, this just ensures that the correct buttons are displayed.
checkSession();
// Reset all status messages
resetStatusMessages();
// Show the home page
showSection("home");
