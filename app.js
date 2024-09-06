document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded");

  // Scroll event listener for the banner opacity
  window.addEventListener('scroll', function () {
      if (window.scrollY > 0) {
          document.body.classList.add('scrolled');
      } else {
          document.body.classList.remove('scrolled');
      }
  });

  const albumGrid = document.getElementById('album-grid');
  if (!albumGrid) {
      console.error("Album grid not found!");
      return;
  }

  const playlistId = '30R4uq61cKRXsRDiC0SIlz'; // Replace with your playlist ID

  // Calculate how many albums fit on one page without scrolling
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const albumSize = 130; // Album size 130x130
  const maxColumns = Math.floor(screenWidth / (albumSize + 10)); // 10px margin
  const maxRows = Math.floor(screenHeight / (albumSize + 10));
  const maxAlbums = maxColumns * maxRows;

  // Fetch and display album covers
  getPlaylistTracks(playlistId).then(albumCovers => {
      console.log("Album covers fetched:", albumCovers);
      if (albumCovers.length === 0) {
          console.error("No album covers found.");
          return;
      }

      // To store the flip intervals for each album, to ensure that all albums flip eventually
      const flipIntervals = [];

      albumCovers.slice(0, maxAlbums).forEach((cover, index) => {
          const albumDiv = document.createElement('div');
          albumDiv.classList.add('album-container');

          const flipCard = document.createElement('div');
          flipCard.classList.add('flip-card');
          albumDiv.appendChild(flipCard);

          const frontCard = document.createElement('div');
          frontCard.classList.add('flip-card-inner', 'flip-card-front');
          const frontImg = document.createElement('img');
          frontImg.src = cover;
          frontImg.style.width = "100%";
          frontImg.style.height = "100%";
          frontCard.appendChild(frontImg);

          const backCard = document.createElement('div');
          backCard.classList.add('flip-card-inner', 'flip-card-back');
          const backImg = document.createElement('img');
          backImg.src = getRandomAlbumCover(albumCovers); // Random album for the back
          backImg.style.width = "100%";
          backImg.style.height = "100%";
          backCard.appendChild(backImg);

          flipCard.appendChild(frontCard);
          flipCard.appendChild(backCard);

          albumGrid.appendChild(albumDiv);

          // Initial flip delay to ensure randomized flipping
          const initialFlipDelay = Math.random() * 5000; // Random initial delay up to 5 seconds

          // Start flipping a few albums at page load
          setTimeout(() => {
              flipCard.classList.add('flipped');
              setTimeout(() => flipCard.classList.remove('flipped'), 10000); // Stay flipped for 10 seconds
              startContinuousFlip(); // Begin continuous flipping after the first flip
          }, initialFlipDelay);

          // Ensure each album flip continues at randomized intervals and eventually flips
          function startContinuousFlip() {
              // Randomized flip delay between 10-20 seconds
              const flipDelay = Math.random() * (20000 - 10000) + 10000;

              // Recursive flipping
              const flipInterval = setTimeout(() => {
                  flipCard.classList.add('flipped'); // Flip the card
                  const newBackImg = getRandomAlbumCover(albumCovers); // Pick a new random album for each flip
                  if (flipCard.classList.contains('flipped')) {
                      backImg.src = newBackImg; // Change the back image to a new album
                  } else {
                      frontImg.src = newBackImg; // Change the front image to a new album
                  }
                  setTimeout(() => flipCard.classList.remove('flipped'), 10000); // Stay flipped for 10 seconds
                  startContinuousFlip(); // Recursive call to keep flipping
              }, flipDelay);

              flipIntervals.push(flipInterval); // Store the interval to ensure the flip is tracked
          }
      });

      // Ensure that if a particular album hasn’t flipped in a while, it gets flipped
      setInterval(() => {
          flipIntervals.forEach((interval, index) => {
              if (Math.random() < 0.05) { // 5% chance per interval check to trigger a flip
                  clearTimeout(interval); // Clear the existing timeout to trigger the next flip
                  startContinuousFlip();
              }
          });
      }, 10000); // Check every 10 seconds
  });
});

function getRandomAlbumCover(covers) {
  const randomIndex = Math.floor(Math.random() * covers.length);
  return covers[randomIndex];
}
