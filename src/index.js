let score = [0, 0]
let teams = [0, 1]
let currTeamScoreSet = 0
let teamList = []
let whistleOn = false

let scoreSetter = document.getElementById('score-set')
let scoreSetterInp = document.getElementById('score-set-in')
let scoreSetterText = document.getElementById('enter-score-text')
let settings = document.getElementById('settings')
let teamSettings = document.getElementById('teams')

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
  console.log(teams)
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
    .map((v, index) => {
      let t = index
      return `
      <div class="flex items-center justify-baseline gap-5">
        <div class="flex gap-2">
          <div
            onclick="playTeam(${t}, 0)"
            class="rounded bg-gray-300 px-2 py-0.5 text-black hover:cursor-pointer"
          >
            <
          </div>
          <div
            onclick="playTeam(${t}, 1)"
            class="rounded bg-gray-300 px-2 py-0.5 text-black hover:cursor-pointer"
          >
            >
          </div>
        </div>
        <label
          id="name-t${t}"
          col-idx="t${t}"
          class="rounded p-1"
          onblur="updateName(${t})"
          contenteditable="true"
          >${v.name}</label
        >
        <input
          id="col-t${t}-bg"
          name="col-t${t}-bg"
          type="color"
          onchange="setTeamCol(${t}, this, 1)"
        />
        <input
          id="col-t${t}-fg"
          name="col-t${t}-fg"
          type="color"
          onchange="setTeamCol(${t}, this, 0)"
        />
    </div>
    `
    })
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
  alert('coming soon')
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

function loadConfig() {
  let whistle = document.getElementById('whistle-onoff')
  teamList = JSON.parse(localStorage.getItem('teams')) ?? resetTeams()

  for (const [i, tm] of teamList.entries()) {
    console.log(i, tm)
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
  teamList = JSON.parse(localStorage.getItem('teams')) ?? resetTeams()
  refreshTeamList()

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
