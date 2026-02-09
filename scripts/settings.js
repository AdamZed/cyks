let whistleOn = false
let saveAll = false
let scoreFont = 'Highway Gothic'
let setCount = 'Disabled'
let teamList = []
let gameList = []

const FONT_STYLES = {
  'Overpass Mono': 'font: var(--opm-size-$ID$) OverpassMono, sans-serif;',
  'Highway Gothic': 'font: var(--hwy-size-$ID$) HighwayGothic, sans-serif;',
  Monomakh: 'font: var(--mak-size-$ID$) Monomakh, sans-serif;',
  Monomaniac: 'font: var(--man-size-$ID$) Monomaniac, sans-serif;',
}
const H_ADJ = {
  'Overpass Mono': 45,
  'Highway Gothic': 50,
  Monomakh: 50,
  Monomaniac: 60,
}

function loadSettings() {
  teamList = getTeamList()
  gameList = getGameList()
  whistleOn = (localStorage.getItem('whistle-on') ?? 'false') === 'true'
  saveAll = (localStorage.getItem('saveall-on') ?? 'false') === 'true'
  scoreFont = localStorage.getItem('score-font') ?? 'Highway Gothic'
  setCount = localStorage.getItem('setswon-count') ?? 'Disabled'
  countSetWins()

  refreshTeamList()
  refreshGameList()
  refreshSettings()
  redrawTeams()
  redrawFonts()
  redrawSets()
}

////// teams //////
function addTeam() {
  teamList.push({
    name: `Team ${teamList.length + 1}`,
    cols: [
      '#000000',
      `hsl(${Math.floor(Math.random() * 250)}, ${Math.floor(Math.random() * 100)}%, 50%)`,
    ],
  })
  saveTeamList()
  refreshTeamList()
  redrawTeams()
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
  teamList[team].name = document
    .getElementById(`name-t${team}`)
    .innerHTML.replaceAll('&nbsp;', '')
    .trim()

  saveTeamList()
  refreshGameList()
  redrawTeams()
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
  saveTeamList()
  refreshTeamList()
  redrawTeams()

  return teamList
}

function redrawTeams() {
  for (const [i, tm] of teamList.entries()) {
    let bg = document.getElementById(`col-t${i}-bg`)
    let fg = document.getElementById(`col-t${i}-fg`)
    bg.value = tm.cols[1]
    fg.value = tm.cols[0]
    setTeamCol(i, bg, 1)
    setTeamCol(i, fg, 0)
  }
}

function saveTeamList() {
  localStorage.setItem('teams', JSON.stringify(teamList))
}

function getTeamList() {
  let t = localStorage.getItem('teams')
  if (t == null) return resetTeams()
  return JSON.parse(t)
}

////// games //////
function removeGame(idx) {
  gameList.splice(idx, 1)
  saveGameList()
  refreshGameList()
  redrawTeams()
  countSetWins()
  redrawSets()
}
function resetGames() {
  gameList = [
    //{t1: id, t2: id, s1:X, s2:X}
  ]
  saveGameList()
  refreshGameList()
  redrawTeams()
  countSetWins()
  redrawSets()

  return gameList
}

function saveGameList() {
  localStorage.setItem('games', JSON.stringify(gameList))
}

function getGameList() {
  let g = localStorage.getItem('games')
  if (g == null) return resetGames()
  return JSON.parse(g)
}

function redrawSets() {
  let s1 = document.getElementById('sets-t1')
  let s2 = document.getElementById('sets-t2')
  switch (setCount) {
    case 'Head to Head':
      s1.innerHTML = setWins[teams[0]]?.[teams[1]] ?? 0
      s2.innerHTML = setWins[teams[1]]?.[teams[0]] ?? 0
      break
    case 'All Wins':
      s1.innerHTML = sumSetsTeam(setWins[teams[0]])
      s2.innerHTML = sumSetsTeam(setWins[teams[1]])
      break
    default:
      s1.innerHTML = ''
      s2.innerHTML = ''
  }
}
function sumSetsTeam(teamWins) {
  if (!teamWins) return 0
  return Object.values(teamWins).reduce((a, v) => a + v, 0)
}

////// general settings //////

function refreshSettings() {
  whistle.checked = whistleOn
  saveall.checked = saveAll
  fontChoice.value = scoreFont
  setswonCount.value = setCount
}

function redrawFonts() {
  document.querySelectorAll(`[font-idx="1"]`).forEach((e) => {
    e.style = FONT_STYLES[scoreFont].replace('$ID$', '1')
    e.style.transform = `translate(-50%, -${H_ADJ[scoreFont]}%)`
  })
  document
    .querySelectorAll(`[font-idx="2"]`)
    .forEach((e) => (e.style = FONT_STYLES[scoreFont].replace('$ID$', '2')))
}

function updateFont(val) {
  scoreFont = val
  localStorage.setItem('score-font', scoreFont)
  redrawFonts()
}

function updateSetswonCount(val) {
  setCount = val
  localStorage.setItem('setswon-count', setCount)
  redrawSets()
}

function updateWhistleState(checked) {
  whistleOn = checked
  localStorage.setItem('whistle-on', `${whistleOn}`)
}

function updateSaveAllState(checked) {
  saveAll = checked
  localStorage.setItem('saveall-on', `${saveAll}`)
}

function resetConfig() {
  whistleOn = false
  saveAll = false
  scoreFont = 'Highway Gothic'
  setCount = 'Disabled'
  localStorage.setItem('whistle-on', `${whistleOn}`)
  localStorage.setItem('saveall-on', `${saveAll}`)
  localStorage.setItem('score-font', scoreFont)
  localStorage.setItem('setswon-count', setCount)

  refreshSettings()
  redrawFonts()
  redrawSets()
}
