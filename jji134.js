/**
 * Version methods
 */
async function getVersion() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Version`);
  const data = await response.text();
  return data;
}
function showVersion() {
  getVersion().then((data) => {
    document.getElementById("version").innerText = data;
  });
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

// const input = document.getElementById("search-bar");

// input.addEventListener("input", fetchNZSLsigns);
showVersion();
