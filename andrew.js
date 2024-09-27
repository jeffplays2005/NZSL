// Method: /api/Version
async function getVersionText() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Version`);
  const version = await response.text();
  return version;
}
async function displayVersion() {
  const versionText = await getVersionText();
  // Set the text later
}
// Method: /api/Signs/{term} and /api/AllSigns
async function getAllSigns() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/AllSigns`);
  const signs = await response.json();
  return signs;
}
async function getSignByTerm(term) {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/Signs/${term}`,
  );
  const signs = await response.json();
  return signs;
}
// Method: /api/EventCount and /api/Event/{i}
async function getEventCount() {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/EventCount`,
  );
  const eventCount = await response.text();
  return parseInt(eventCount.result);
}
async function getEventByID(id) {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/Event/${id}`,
    {
      headers: { Accept: "text/plain" },
    },
  );
  const event = await response.text();
  return event;
}
async function getAllEvents() {
  const eventCount = await getEventCount();
  const events = [];
  for (let i = 0; i < eventCount; i++) {
    const event = await getEventByID(i);
    events.push(event);
  }
  return events;
}
// Method: /api/Comments and /api/Comment POST
async function getAllComments() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Comments`);
  const commentsHTML = await response.text();
  return commentsHTML;
}
async function createComment(comment, auth) {
  const response = await fetch(
    `https://cws.auckland.ac.nz/nzsl/api/Comment?comment=${comment}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );
  const output = await response.text();
  return output;
}
// Method: /api/Register POST and /api/TestAuth
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
  const output = await response.text();
  return output;
}
async function testAuth(username, password) {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/TestAuth`, {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });
  if (response.status === 200) {
    return true;
  }
  return false;
}
function logout() {
  return localStorage.clear();
}
function setSessionData(auth) {
  localStorage.setItem("auth", auth);
}
function getSessionData() {
  return localStorage.getItem("auth");
}
