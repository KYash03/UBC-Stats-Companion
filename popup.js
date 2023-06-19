let professorRating = 0.0;
let isTBA;

async function getActiveTabURL() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return tabs[0];
}

function hideHeaders() {
  let sections = document.getElementById("sections");
  sections.innerHTML = "";
  sections.style.paddingTop = "20px";

  let h2Elements = document.getElementsByClassName("h2-elements");
  for (let i = 0; i < h2Elements.length; i++) {
    h2Elements[i].style.display = "none";
  }
}
