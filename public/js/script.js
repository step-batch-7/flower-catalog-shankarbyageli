const vanishJar = function () {
  let delay = 1000;
  const flowerImage = document.querySelector('#gif');
  flowerImage.style.visibility = 'hidden';
  setTimeout(() => {
    flowerImage.style.visibility = 'visible';
  }, delay);
};
