let score = [0, 0]
let teams = [0, 1]
let currTeamScoreSet = 0
let teamList = []
let gameList = []
let whistleOn = false

let scoreSetter = document.getElementById('score-set')
let scoreSetterInp = document.getElementById('score-set-in')
let scoreSetterText = document.getElementById('enter-score-text')
let settings = document.getElementById('settings')
let teamSettings = document.getElementById('teams')
let gameSettings = document.getElementById('games')

function reset() {
  setScore(1, 0)
  setScore(2, 0)
}

function setScore(team, s) {
  s = Number(s)
  if (!Number.isInteger(s) || s < 0 || s > 99) return
  score[team - 1] = s
  document.getElementById(`score-t${team}`).innerHTML = s
  sessionStorage.setItem(`s-t${team}`, s)
}
function incScore(team) {
  setScore(team, ++score[team - 1])
}
function decScore(team) {
  setScore(team, --score[team - 1])
}

function playWhistle() {
  if (whistleOn) new Audio('./sounds/whistle.mp3').play()
  else alert('Whistle is currently disabled. Enable in settings.')
}

function openScoreSet(team) {
  currTeamScoreSet = team
  scoreSetterText.innerHTML = `Enter Score for Team ${team}`
  scoreSetter.classList.remove('hidden')
  scoreSetter.classList.add('flex')
}

function confirmScoreSet() {
  setScore(currTeamScoreSet, scoreSetterInp.value)
  closeScoreSet()
}

function closeScoreSet() {
  scoreSetter.classList.remove('flex')
  scoreSetter.classList.add('hidden')
  currTeamScoreSet = 0
  scoreSetterInp.value = ''
}
function openSettings() {
  settings.classList.remove('hidden')
  settings.classList.add('flex')
}

function swapTeams() {
  let [s1, s2] = score
  let [t1, t2] = teams

  setScore(1, s2)
  setScore(2, s1)
  teams = [t2, t1]
  loadConfig()
}

function closeSettings() {
  settings.classList.remove('flex')
  settings.classList.add('hidden')
}

function openTeams() {
  teamSettings.classList.remove('hidden')
  teamSettings.classList.add('flex')
}
function refreshTeamList() {
  document.getElementById('team-list').innerHTML = teamList
    .map((tm, index) => {
      return `
      <div class="flex items-center justify-baseline gap-5">
        <div class="flex gap-2">
          <div
            onclick="playTeam(${index}, 0)"
            class="rounded bg-gray-300 px-2 py-0.5 text-black hover:cursor-pointer"
          >
            <
          </div>
          <div
            onclick="playTeam(${index}, 1)"
            class="rounded bg-gray-300 px-2 py-0.5 text-black hover:cursor-pointer"
          >
            >
          </div>
        </div>
        <label
          id="name-t${index}"
          col-idx="t${index}"
          class="rounded p-1"
          onblur="updateName(${index})"
          contenteditable="true"
          >${tm.name}</label
        >
        <input
          id="col-t${index}-bg"
          name="col-t${index}-bg"
          type="color"
          onchange="setTeamCol(${index}, this, 1)"
        />
        <input
          id="col-t${index}-fg"
          name="col-t${index}-fg"
          type="color"
          onchange="setTeamCol(${index}, this, 0)"
        />
    </div>
    `
    })
    .join('\n')
}

function refreshGameList() {
  document.getElementById('game-list').innerHTML =
    gameList.length == 0
      ? 'No games saved'
      : gameList
          .map((gm, index) => {
            let c1 = '',
              c2 = ''
            if (gm.s1 > gm.s2) c1 = 'font-bold text-green-400'
            else if (gm.s2 > gm.s1) c2 = 'font-bold text-green-400'
            return `
      <div class="flex gap-2">
        <p>
          <span col-idx="t${gm.t1}" class="rounded px-2 py-1">${teamList[gm.t1].name}</span>
          <span class="p-1 ${c1}">${gm.s1}</span> -
          <span class="p-1 ${c2}">${gm.s2}</span>
          <span col-idx="t${gm.t2}" class="rounded px-2 py-1">${teamList[gm.t2].name}</span>
        </p>
        <div
          onclick="removeGame(${index})"
          class="rounded bg-gray-300 px-2 py-0.5 text-black hover:cursor-pointer"
        >
          X
        </div>
      </div>
    `
          })
          .reverse()
          .join('\n')
}

function closeTeams() {
  teamSettings.classList.remove('flex')
  teamSettings.classList.add('hidden')
  localStorage.setItem('teams', JSON.stringify(teamList))
  loadConfig()
}
function resetTeams() {
  teamList = [
    {
      name: 'Team 1',
      cols: ['#000000', 'hsl(38, 90%, 50%)'],
    },
    {
      name: 'Team 2',
      cols: ['#000000', 'hsl(208, 74%, 50%)'],
    },
  ]
  localStorage.setItem('teams', JSON.stringify(teamList))
  refreshTeamList()

  loadConfig()

  return teamList
}

function saveCurrentGame() {
  gameList.push({
    t1: teams[0],
    t2: teams[1],
    s1: score[0],
    s2: score[1],
  })
  localStorage.setItem('games', JSON.stringify(gameList))
  refreshGameList()
  loadConfig()
  reset()
}

function removeGame(idx) {
  gameList.splice(idx, 1)
  localStorage.setItem('games', JSON.stringify(gameList))
  refreshGameList()
  loadConfig()
}

function resetGames() {
  gameList = [
    //{t1: id, t2: id, s1:X, s2:X}
  ]
  localStorage.setItem('games', JSON.stringify(gameList))
  refreshGameList()
  loadConfig()
  return gameList
}

function addTeam() {
  teamList.push({
    name: `Team ${teamList.length + 1}`,
    cols: [
      '#000000',
      `hsl(${Math.floor(Math.random() * 250)}, ${Math.floor(Math.random() * 100)}%, 50%)`,
    ],
  })

  localStorage.setItem('teams', JSON.stringify(teamList))
  refreshTeamList()
  loadConfig()
}

function playTeam(team, idx) {
  if (teams.indexOf(team) > -1) alert('That team is already active')
  else {
    teams[idx] = team
    loadConfig()
  }
}

function openGames() {
  gameSettings.classList.remove('hidden')
  gameSettings.classList.add('flex')
}
function closeGames() {
  gameSettings.classList.remove('flex')
  gameSettings.classList.add('hidden')
}

function setTeamCol(team, e, idx) {
  let col = e.value
  if (idx == 0) {
    document
      .querySelectorAll(`[col-idx="t${team}"`)
      .forEach((e) => (e.style.color = col))
  } else {
    document
      .querySelectorAll(`[col-idx="t${team}"`)
      .forEach((e) => (e.style.background = col))
  }
  teamList[team].cols[idx] = col

  let i = teams.indexOf(team)
  if (i > -1) setActiveTeamCol(i + 1, col, idx)
}

function setActiveTeamCol(team, col, idx) {
  if (idx == 0) {
    document
      .querySelectorAll(`[col-idx="${team}:1a"`)
      .forEach((e) => (e.style.color = col))
    document
      .querySelectorAll(`[col-idx="${team}:1b"`)
      .forEach((e) => (e.style.color = col))
  } else {
    let hsl = hexToHSL(col)
    document
      .querySelectorAll(`[col-idx="${team}:1a"`)
      .forEach(
        (e) => (e.style.background = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`),
      )
    document
      .querySelectorAll(`[col-idx="${team}:1b"`)
      .forEach(
        (e) =>
          (e.style.background = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l > 20 ? hsl.l - 10 : hsl.l + 10}%)`),
      )
  }
}

function updateName(team) {
  teamList[team].name = document.getElementById(`name-t${team}`).innerHTML
}

function setWhistleState(checkbox) {
  whistleOn = checkbox.checked
  localStorage.setItem('whistle-on', whistleOn)
}

function resetConfig() {
  localStorage.setItem('whistle-on', false)
  loadConfig()
}

function getTeamList() {
  let t = localStorage.getItem('teams')
  if (t == null) return resetTeams()
  return JSON.parse(t)
}

function getGameList() {
  let g = localStorage.getItem('games')
  if (g == null) return resetGames()()
  return JSON.parse(g)
}

function loadConfig() {
  let whistle = document.getElementById('whistle-onoff')
  teamList = getTeamList()

  for (const [i, tm] of teamList.entries()) {
    let bg = document.getElementById(`col-t${i}-bg`)
    let fg = document.getElementById(`col-t${i}-fg`)
    bg.value = tm.cols[1]
    fg.value = tm.cols[0]
    setTeamCol(i, bg, 1)
    setTeamCol(i, fg, 0)
  }

  whistleOn = localStorage.getItem('whistle-on') ?? false
  whistle.checked = whistleOn
}

window.onload = () => {
  setScore(1, sessionStorage.getItem('s-t1'))
  setScore(2, sessionStorage.getItem('s-t2'))
  teams = [0, 1]
  teamList = getTeamList()
  refreshTeamList()
  gameList = getGameList()
  refreshGameList()

  loadConfig()
}

function hexToHSL(hex) {
  hex = hex.replace('#', '')

  let r = parseInt(hex.substring(0, 2), 16) / 255
  let g = parseInt(hex.substring(2, 4), 16) / 255
  let b = parseInt(hex.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l

  l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}
