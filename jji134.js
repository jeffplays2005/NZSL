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
    return { description: sign.description, id: sign.id };
  });
}

async function fetchSignLogo() {}

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
