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

// Song Titles
const songs = [
  '01 Peacock',
  '02 Lady',
  '04 Vermont',
  '05 Possibilities',
  '06 Actualize',
  '07 Celebration',
  '08 Traveling',
  'Dark World',
  'Loving You Has Taken Over',
]

// Album Covers
const albumCovers = ['squireCribbs']

// random starting song number
const randomNumber = Math.floor(Math.random() * songs.length) + 1
console.log(randomNumber)

// Keep track of song
let songIndex = randomNumber

// Initially load song details into DOM
loadSong(songs[songIndex])

// Update song details
function loadSong(song) {
  title.innerText = song
  let albumCover = ''
  console.log(song)
  audio.src = `music/${song}.m4a`

  //   console.log(albumCover);
  cover.src = `images/squireCribbs.jpg`
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
  songIndex--

  if (songIndex < 0) {
    songIndex = songs.length - 1
  }

  loadSong(songs[songIndex])
  playSong()
}

// Next song
function nextSong() {
  songIndex++

  if (songIndex > songs.length - 1) {
    songIndex = 0
  }

  loadSong(songs[songIndex])
  playSong()
}

// Shuffle song
function shuffleSong() {
  let randomNumber = Math.floor(Math.random() * songs.length) + 1

  songIndex = randomNumber

  if (songIndex > songs.length - 1) {
    songIndex = 0
  }

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

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play')

  if (isPlaying) {
    pauseSong()
  } else {
    playSong()
  }
})

// Change song
prevBtn.addEventListener('click', prevSong)
nextBtn.addEventListener('click', nextSong)
shuffleBtn.addEventListener('click', shuffleSong)

// Time/song update
audio.addEventListener('timeupdate', updateProgress)

// Click on progress bar
progressContainer.addEventListener('click', setProgress)

// Song Ends
audio.addEventListener('ended', nextSong)

const songListContainer = document.getElementById('song-list')

function renderSongList() {
  songListContainer.innerHTML = ''

  songs.forEach((song, index) => {
    const songItem = document.createElement('div')
    songItem.classList.add('song-item')
    songItem.innerHTML = `
      <p>${index + 1}. ${song}</p>
    `

    songItem.addEventListener('click', () => {
      songIndex = index
      loadSong(songs[songIndex])
      playSong()
    })

    songListContainer.appendChild(songItem)
  })
}

renderSongList()
