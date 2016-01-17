function createScore (username, userscore, userlevel) {
  $.ajax({
    url: "/api/scores",
    data: {
            score:
            {
              name: username,
              num: userscore,
              level: userlevel
            }
          },
    method: "POST",
    success: function (response) {
      scoreEntered = true;
      scores = response;
    }
  });
}

function getScores () {
  $.ajax({
    url: "/api/scores",
    method: "GET",
    success: function (response) {
      scores = response;
    }
  });
}
