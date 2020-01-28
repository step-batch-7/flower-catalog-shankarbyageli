const vanishJar = function () {
  const flowerImage = document.querySelector('#gif');
  flowerImage.style.visibility = 'hidden';
  setTimeout(() => {
    flowerImage.style.visibility = 'visible';
  }, 1000);
};
