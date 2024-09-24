const input = document.getElementById("search-bar");

input.addEventListener("input", fetchNZSLsigns);

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
async function getVersion() {
  const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Version`);
  const data = await response.text();
  return data;
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
