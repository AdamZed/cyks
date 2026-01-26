let settings = document.getElementById('settings')
let teamSettings = document.getElementById('teams')
let gameSettings = document.getElementById('games')
let scoreSetter = document.getElementById('score-set')
let scoreSetterInp = document.getElementById('score-set-in')
let scoreSetterText = document.getElementById('enter-score-text')
let setswonCount = document.getElementById('setswon-count')
let fontChoice = document.getElementById('font-choice')

let whistle = document.getElementById('whistle-onoff')

let currTeamScoreSet = 0

window.onload = loadSettings

function openSettings() {
  settings.showModal()
}
function closeSettings() {
  settings.close()
}

function openTeams() {
  teamSettings.showModal()
}
function closeTeams() {
  teamSettings.close()
}

function openGames() {
  gameSettings.showModal()
}
function closeGames() {
  gameSettings.close()
}

function openScoreSet(team) {
  currTeamScoreSet = team
  scoreSetterText.innerHTML = `Enter Score for ${teamList[teams[team - 1]].name}`
  scoreSetter.showModal()
}
function closeScoreSet() {
  scoreSetter.close()
  currTeamScoreSet = 0
  scoreSetterInp.value = ''
}
function confirmScoreSet() {
  setScore(currTeamScoreSet, scoreSetterInp.value)
  closeScoreSet()
}

function refreshTeamList() {
  document.getElementById('team-list').innerHTML = teamList
    .map((tm, index) => {
      return document
        .getElementById('team-template')
        .innerHTML.replaceAll('$IDX$', index)
        .replaceAll('$NAME$', tm.name)
    })
    .join('\n')
}

function refreshGameList() {
  document.getElementById('game-list').innerHTML =
    gameList.length == 0
      ? 'No games saved'
      : gameList
          .map((gm, index) => {
            let [c1, c2] = ['', '']
            if (gm.s1 > gm.s2) c1 = 'font-bold text-green'
            else if (gm.s2 > gm.s1) c2 = 'font-bold text-green'
            return document
              .getElementById('game-template')
              .innerHTML.replace('$T1$', gm.t1)
              .replace('$T2$', gm.t2)
              .replace('$S1$', gm.s1)
              .replace('$S2$', gm.s2)
              .replace('$STY1$', c1)
              .replace('$STY2$', c2)
              .replace('$NAME1$', teamList[gm.t1].name)
              .replace('$NAME2$', teamList[gm.t2].name)
              .replace('$IDX$', index)
          })
          .reverse()
          .join('\n')
}
