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

document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["isTBA"]).then(async (result) => {
    isTBA = result.isTBA;

    const activeTab = await getActiveTabURL();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentSection = urlParameters.get("section");

    if (!currentSection) {
      const randomContainer = document.getElementById("random-container-id");
      randomContainer.innerHTML = "Invalid Page";
      hideHeaders();
    } else if (isTBA == true) {
      const randomContainer = document.getElementById("random-container-id");
      randomContainer.innerHTML = "Instructor Not Announced";
      hideHeaders();
    } else {
      const result = await new Promise((resolve) => {
        chrome.storage.local.get(
          [
            "professorRating",
            "course_statistics",
            "campus",
            "professorID",
            "numRatings",
            "wouldTakeAgainPercent",
            "avgDifficulty",
            "url",
          ],
          (result) => {
            resolve(result);
          }
        );
      });

      document.getElementById("professor-rating").innerHTML =
        "Professor Rating: " +
        (result.professorRating ? result.professorRating : "N.A.");

      document.getElementById("numRatings-id").innerHTML =
        "Number of Ratings: " +
        (result.numRatings ? result.numRatings : "N.A.");

      document.getElementById("wouldTakeAgainPercent-id").innerHTML =
        "Would Take Again: " +
        (result.wouldTakeAgainPercent !== undefined
          ? Math.round(result.wouldTakeAgainPercent * 100) / 100 + "%"
          : "N.A.");

      document.getElementById("avg-difficulty-id").innerHTML =
        "Average Difficulty: " +
        (result.avgDifficulty ? result.avgDifficulty : "N.A.");

      document.getElementById("course-id").innerHTML =
        "Course: " +
        (result.course_statistics.subject
          ? result.course_statistics.subject
          : "N.A.") +
        " " +
        (result.course_statistics.course
          ? result.course_statistics.course
          : "");
      document.getElementById("average-id").innerHTML =
        "Average: " +
        (result.course_statistics.average
          ? Math.round(result.course_statistics.average * 100) / 100
          : "N.A.");

      const professorLink = document.getElementById("professor-link-id");
      professorLink.innerHTML = "RMP Page";
      // professorLink.href = `https://www.ratemyprofessors.com/professor/${result.professorID}`;
      professorLink.href = result.url ? result.url : "";

      const ubcGradesLink = document.getElementById("ubc-grades-link-id");
      ubcGradesLink.innerHTML = "UBC Grades' Page";
      ubcGradesLink.href = `https://ubcgrades.com/statistics-by-course#${
        result.campus ? "UBCV" : "UBCO"
      }-${result.course_statistics.subject}-${result.course_statistics.course}`
        ? `https://ubcgrades.com/statistics-by-course#${
            result.campus ? "UBCV" : "UBCO"
          }-${result.course_statistics.subject}-${
            result.course_statistics.course
          }`
        : "";
    }
  });
});
