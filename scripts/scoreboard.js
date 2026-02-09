let score = [0, 0]
let teams = [0, 1]
let setWins = {}

function resetScores() {
  setScore(1, 0)
  setScore(2, 0)
}

function incScore(team) {
  setScore(team, ++score[team - 1])
}

function decScore(team) {
  setScore(team, --score[team - 1])
}

function setScore(team, s) {
  s = Number(s)
  if (!Number.isInteger(s) || s < 0 || s > 99) return
  score[team - 1] = s
  document.getElementById(`score-t${team}`).innerHTML = s
}

function playWhistle() {
  if (whistleOn) new Audio('./assets/sounds/whistle.mp3').play()
  else alert('Whistle is currently disabled. Enable in settings.')
}

function swapTeams() {
  let [s1, s2] = score
  let [t1, t2] = teams

  setScore(1, s2)
  setScore(2, s1)
  teams = [t2, t1]
  redrawTeams()
  redrawSets()
}

function playTeam(team, idx) {
  if (teams.indexOf(team) == -1) {
    teams[idx] = team
    redrawTeams()
  } else if (teams.indexOf(team) != idx) swapTeams()
  redrawSets()
}

function endGame(save) {
  if (!save) {
    resetScores()
  } else {
    logCurrentGame()
  }
  closeGameEnd()
  return
}

function logCurrentGame() {
  let game = {
    t1: teams[0],
    t2: teams[1],
    s1: score[0],
    s2: score[1],
  }
  gameList.push(game)
  addSetWin(game)
  saveGameList()
  refreshGameList()
  redrawTeams()
  redrawSets()
  resetScores()
}

function addSetWin(g) {
  if (g.s1 > g.s2) {
    setWins[g.t1] ??= {}
    setWins[g.t1][g.t2] ??= 0
    setWins[g.t1][g.t2] += 1
  } else if (g.s2 > g.s1) {
    setWins[g.t2] ??= {}
    setWins[g.t2][g.t1] ??= 0
    setWins[g.t2][g.t1] += 1
  }
}
function countSetWins() {
  setWins = {}
  gameList.forEach((g) => addSetWin(g))
}
