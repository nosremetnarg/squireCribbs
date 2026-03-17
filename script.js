const musicContainer = document.getElementById('music-container')

const playBtn = document.getElementById('play')
const prevBtn = document.getElementById('prev')
const nextBtn = document.getElementById('next')
const shuffleBtn = document.getElementById('shuffle')

const audio = document.getElementById('audio')
const progress = document.getElementById('progress')
const progressContainer = document.getElementById('progress-container')

const title = document.getElementById('title')
const cover = document.getElementById('cover')

const songListContainer = document.getElementById('song-list')
const statusMessage = document.getElementById('status-message')

// Playlist data
let songs = []
let songIndex = 0

const STORAGE_KEY_SONG_INDEX = 'squire-cribbs-song-index'

function setStatusMessage(text, type = 'info') {
  if (!statusMessage) return
  statusMessage.textContent = text || ''
  statusMessage.className = 'status-message'
  if (text) {
    statusMessage.classList.add(`status-message--${type}`)
  }
}

function setSongIndex(index) {
  songIndex = index
  try {
    localStorage.setItem(STORAGE_KEY_SONG_INDEX, String(songIndex))
  } catch (e) {
    // Ignore storage errors
  }
  updateActiveSongHighlight()
}

// --- Init player ---
async function initPlayer() {
  setStatusMessage('Loading songs...', 'info')
  try {
    const res = await fetch('songs.json')
    songs = await res.json()

    if (!Array.isArray(songs) || songs.length === 0) {
      console.error('No songs found in songs.json')
      setStatusMessage('No songs found.', 'error')
      return
    }

    // Pick starting song: last played if available, otherwise random
    let initialIndex = Math.floor(Math.random() * songs.length)
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SONG_INDEX)
      const parsed = stored !== null ? parseInt(stored, 10) : NaN
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < songs.length) {
        initialIndex = parsed
      }
    } catch (e) {
      // Ignore storage errors
    }
    setSongIndex(initialIndex)

    // Load and render
    loadSong(songs[songIndex])
    renderSongList()
    setStatusMessage('')
  } catch (err) {
    console.error('Error loading songs.json', err)
    setStatusMessage('Error loading songs. Please try again later.', 'error')
  }
}

// --- Helpers ---
function loadSong(song) {
  // song is an object: { title, file }
  title.innerText = song.title
  audio.src = `music/${song.file}.m4a`
  cover.src = 'images/squireCribbs.jpg'
}

// Play song
function playSong() {
  musicContainer.classList.add('play')
  playBtn.querySelector('i.fas').classList.remove('fa-play')
  playBtn.querySelector('i.fas').classList.add('fa-pause')

  audio.play()
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play')
  playBtn.querySelector('i.fas').classList.add('fa-play')
  playBtn.querySelector('i.fas').classList.remove('fa-pause')

  audio.pause()
}

// Previous song
function prevSong() {
  let newIndex = songIndex - 1
  if (newIndex < 0) {
    newIndex = songs.length - 1
  }
  setSongIndex(newIndex)
  loadSong(songs[songIndex])
  playSong()
}

// Next song
function nextSong() {
  let newIndex = songIndex + 1
  if (newIndex > songs.length - 1) {
    newIndex = 0
  }
  setSongIndex(newIndex)
  loadSong(songs[songIndex])
  playSong()
}

// Shuffle song
function shuffleSong() {
  const randomIndex = Math.floor(Math.random() * songs.length)
  setSongIndex(randomIndex)
  loadSong(songs[songIndex])
  playSong()
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement
  const progressPercent = (currentTime / duration) * 100
  progress.style.width = `${progressPercent}%`
}

// Set progress bar
function setProgress(e) {
  const width = this.clientWidth
  const clickX = e.offsetX
  const duration = audio.duration

  audio.currentTime = (clickX / width) * duration
}

// Render clickable song list
function renderSongList() {
  songListContainer.innerHTML = ''

  songs.forEach((song, index) => {
    const songItem = document.createElement('div')
    songItem.classList.add('song-item')
    if (index === songIndex) {
      songItem.classList.add('song-item--active')
    }
    songItem.innerHTML = `<p>${index + 1}. ${song.title}</p>`

    songItem.addEventListener('click', () => {
      setSongIndex(index)
      loadSong(songs[songIndex])
      playSong()
    })

    songListContainer.appendChild(songItem)
  })
}

function updateActiveSongHighlight() {
  const items = songListContainer
    ? songListContainer.querySelectorAll('.song-item')
    : []
  items.forEach((item, idx) => {
    if (idx === songIndex) {
      item.classList.add('song-item--active')
    } else {
      item.classList.remove('song-item--active')
    }
  })
}

// --- Event listeners ---
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play')

  if (isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})

prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)
shuffleBtn.addEventListener('click', shuffleSong)

audio.addEventListener('timeupdate', updateProgress)
progressContainer.addEventListener('click', setProgress)
audio.addEventListener('ended', nextSong)

// --- Kick things off ---
initPlayer()
