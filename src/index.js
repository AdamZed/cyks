let score = [0, 0]
let whistleOn = false

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

let scoreSetter
let scoreSetterText
let scoreSetterInp
let settings
let currTeamSet = 0

function openScoreSet(team) {
  currTeamSet = team
  scoreSetterText.innerHTML = `Enter Score for Team ${team}`
  scoreSetter.classList.remove('hidden')
  scoreSetter.classList.add('flex')
}

function confirmScoreSet() {
  setScore(currTeamSet, scoreSetterInp.value)
  closeScoreSet()
}

function closeScoreSet() {
  scoreSetter.classList.remove('flex')
  scoreSetter.classList.add('hidden')
  currTeamSet = 0
  scoreSetterInp.value = ''
}
function openSettings() {
  settings.classList.remove('hidden')
  settings.classList.add('flex')
}

function swapTeams() {
  let [s1, s2] = score
  let ct11 = localStorage.getItem('col-t1-i1') ?? 'hsl(38, 90%, 50%)'
  let ct12 = localStorage.getItem('col-t1-i2') ?? '#000000'
  let ct21 = localStorage.getItem('col-t2-i1') ?? 'hsl(220, 95%, 40%)'
  let ct22 = localStorage.getItem('col-t2-i2') ?? '#000000'

  setScore(1, s2)
  setScore(2, s1)
  localStorage.setItem('col-t1-i1', ct21)
  localStorage.setItem('col-t1-i2', ct22)
  localStorage.setItem('col-t2-i1', ct11)
  localStorage.setItem('col-t2-i2', ct12)
  loadConfig()
}

function closeSettings() {
  settings.classList.remove('flex')
  settings.classList.add('hidden')
}

function openTeams() {
  alert('coming soon')
}

function openGames() {
  alert('coming soon')
}

function setTeamCol(col, team, idx) {
  if (idx == 2) {
    document
      .querySelectorAll(`[col-idx="${team}:0"`)
      .forEach((e) => (e.style.color = col))
    document
      .querySelectorAll(`[col-idx="${team}:2"`)
      .forEach((e) => (e.style.color = col))
  } else {
    let hsl = hexToHSL(col)
    document
      .querySelectorAll(`[col-idx="${team}:1"`)
      .forEach(
        (e) => (e.style.background = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`),
      )
    document
      .querySelectorAll(`[col-idx="${team}:2"`)
      .forEach(
        (e) =>
          (e.style.background = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l > 20 ? hsl.l - 10 : hsl.l + 10}%)`),
      )
  }
  localStorage.setItem(`col-t${team}-i${idx}`, col)
}

function setWhistleState(checkbox) {
  whistleOn = checkbox.checked
  localStorage.setItem('whistle-on', whistleOn)
}

function resetConfig() {
  localStorage.clear()
  loadConfig()
}

function loadConfig() {
  let t1bg = document.getElementById('col-t1-bg')
  let t1fg = document.getElementById('col-t1')
  let t2bg = document.getElementById('col-t2-bg')
  let t2fg = document.getElementById('col-t2')
  t1bg.value = localStorage.getItem('col-t1-i1') ?? 'hsl(38, 90%, 50%)'
  setTeamCol(t1bg.value, 1, 1)
  t1fg.value = localStorage.getItem('col-t1-i2') ?? '#000000'
  setTeamCol(t1fg.value, 1, 2)
  t2bg.value = localStorage.getItem('col-t2-i1') ?? 'hsl(220, 95%, 40%)'
  setTeamCol(t2bg.value, 2, 1)
  t2fg.value = localStorage.getItem('col-t2-i2') ?? '#000000'
  setTeamCol(t2fg.value, 2, 2)
  let whistle = document.getElementById('whistle-onoff')
  whistleOn = localStorage.getItem('whistle-on') ?? false
  whistle.checked = whistleOn
}

window.onload = () => {
  scoreSetter = document.getElementById('score-set')
  scoreSetterInp = document.getElementById('score-set-in')
  scoreSetterText = document.getElementById('enter-score-text')
  settings = document.getElementById('settings')

  setScore(1, sessionStorage.getItem('s-t1'))
  setScore(2, sessionStorage.getItem('s-t2'))
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
