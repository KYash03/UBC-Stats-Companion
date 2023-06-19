let professorName = "";
let html = "";
let professorRating = 0.0;
let subject = "";
let courseCode = "";
let campus = 1;
let professorID = 0;
let numRatings = 0;
let wouldTakeAgainPercent;
let avgDifficulty;
let url = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == "BACKGROUND" && !message.isTBA) {
    professorName = message.professorName;
    subject = message.subject;
    courseCode = message.courseCode;
    campus = message.campus;

    const professorNameParts = professorName.split(",");
    let lastName;
    let firstName;
    let url;

    if (professorNameParts.length > 1) {
      lastName = professorNameParts[0].trim();
      firstName = professorNameParts[1].trim().split(" ")[0];

      url = `https://www.ratemyprofessors.com/search/professors/${
        campus ? "1413" : "5436"
      }?q=${lastName.toLowerCase()}%20${firstName.toLowerCase()}`;
    }

    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (page_html) {
        html = page_html;

        if (html.includes('"resultCount":0')) {
          professorRating = null;
          professorID = null;
          numRatings = null;
          wouldTakeAgainPercent = null;
          avgDifficulty = null;
        } else {
          regex = /"avgRating":/g;
          result = html.search(regex);

          extractedRating = html.slice(result + 12, result + 15);

          if (/[a-zA-Z\,]/g.test(extractedRating)) {
            professorRating = parseInt(html.slice(result + 12, result + 13));
          } else {
            professorRating = parseFloat(extractedRating);
          }

          regex = /"legacyId":\d+/;
          match = html.match(regex);

          if (match) {
            professorID = match[0].match(/\d+/)[0];
          }

          regex = /"numRatings":\d+/;
          match = html.match(regex);

          if (match) {
            numRatings = match[0].match(/\d+/)[0];
          }

          regex = /"wouldTakeAgainPercent":\d+(\.\d+)?/;
          match = html.match(regex);

          if (match) {
            wouldTakeAgainPercent = parseFloat(match[0].match(/\d+(\.\d+)?/));
          }

          regex = /"avgDifficulty":\d+(\.\d+)?/;
          match = html.match(regex);

          if (match) {
            avgDifficulty = match[0].match(/\d+(\.\d+)?/)[0];
          }
        }

        chrome.storage.local.set({
          professorRating,
          professorID,
          url,
          numRatings,
          wouldTakeAgainPercent,
          avgDifficulty,
        });
      });

    fetch(
      `https://ubcgrades.com/api/v3/course-statistics/${
        campus ? "UBCV" : "UBCO"
      }/${subject}/${courseCode}`
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        chrome.storage.local.set({
          course_statistics: data,
          isTBA: false,
          campus,
        });
      });
  } else if (message.isTBA == true) {
    chrome.storage.local.set({
      isTBA: true,
      campus,
    });
  }
});
