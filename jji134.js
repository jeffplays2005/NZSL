async function fetchLogs() {
  const res = await fetch("https://cws.auckland.ac.nz/nzsl/api/Log");
  const logs = await res.json();
  return logs;
}
