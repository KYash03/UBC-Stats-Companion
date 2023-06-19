(() => {
  let professorName = "";
  let subject = "";
  let courseCode = "";
  let isTBA = false;
  let campus = 0;

  let instructorLink = $('td a[href^="/cs/courseschedule?pname=inst"]');
  if (instructorLink.length) {
    professorName = instructorLink.html();
  }

  let courseInformation = $("h4");
  if (courseInformation.length) {
    let courseInfoText = courseInformation.html();
    subject = courseInfoText.slice(0, 4);
    courseCode = courseInfoText.slice(5, 8);
  }

  let campusInfo = $('button[data-toggle="dropdown"]');
  if (campusInfo.length && campusInfo.html().slice(12) === "Vancouver") {
    campus = 1;
  }

  let tdElements = $("td");
  tdElements.each((index, element) => {
    if ($(element).html() === "TBA") {
      isTBA = true;
    }
  });
  chrome.runtime.sendMessage({
    type: "BACKGROUND",
    professorName,
    subject,
    courseCode,
    isTBA,
    campus,
  });
})();
