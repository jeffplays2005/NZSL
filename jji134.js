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

/**
 * Event methods
 */
async function getNumberEvents() {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/EventCount`,
  );
  const data = await response.text();
  return parseInt(data.result);
}

async function getEvents(eventCount) {
  eventOutput = [];
  for (let i = 0; i < eventCount; i++) {
    const response = await fetch(
      `https://cws.auckland.ac.nz/nzsl/api/Event/1`,
      {
        headers: { Accept: "text/plain" },
      },
    );
    const data = await response.text();
    eventOutput.push(data);
  }
  return eventOutput;
}

//0: BEGIN:VCALENDAR
//1: VERSION:2.0
//2: PRODID:-//NSDS//EN
//3: BEGIN:VEVENT
//4: UID:20240903T010000Z@NZDS
//5: DTSTAMP:20240903T010000Z
//6: DTSTART:20240903T010000Z
//7: DTEND:20240903T020000Z
//8: TZID:Pacific/Auckland
//9: SUMMARY:Colours Galore
//10: DESCRIPTION:This event is to celbrate the colours in our lives. Bring the Whānau and plenty of pastels.
//11: LOCATION:Ōtāhuhu
// END:VEVENT
// END:VCALENDAR
function parseVcalendar(calendar) {
  const splitted = calendar.split("\n").map((x) => x.split(":")[1]);
  return {
    uid: splitted[4],
    start: splitted[6],
    end: splitted[7],
    timezone: splitted[8],
    summary: splitted[9],
    description: splitted[10],
    lcocation: splitted[11],
  };
}

/**
 * Comment methods
 */
async function getAllComments() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Comments`);
  const data = await response.text();
  return data;
}
function displayComments() {}
async function addComment(comment) {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/Comment?comment=${comment}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${getSession("credentials")}`,
      },
    },
  );
  const data = await response.text();
  return data;
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
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/TestAuth`, {
    headers: {
      Authorization: `Basic ${convertToBase64(username, password)}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Invalid login. ");
  }
  // Set cookies or something
  storeSession("credentials", convertToBase64(username, password));
  return true;
}
function logout() {
  return clearSession();
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
function clearSession() {
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
  sections.forEach((section) => {
    section.style.display = "none";
  });
  if (section == "nzsl") {
    let signDiv = document.getElementById("nzsl-signs");
    signDiv.innerText = "";
    createSearchListener();
    const signs = await fetchNZSLsigns("");
    signDiv = document.getElementById("nzsl-signs");
    const formattedSigns = formatSigns(signs);
    signDiv.innerHTML = formattedSigns;
  }
  document.getElementById(section).style.display = "block";
}

function createSearchListener() {
  const input = document.getElementById("nzsl-search");
  if (input) {
    input.addEventListener("input", async (event) => {
      const term = event.target.value;
      const signs = await fetchNZSLsigns(term);
      const signDiv = document.getElementById("nzsl-signs");
      const formattedSigns = formatSigns(signs);
      signDiv.innerHTML = formattedSigns;
    });
  }
}

// Add search bar logic
// Show version at footer
showVersion();
