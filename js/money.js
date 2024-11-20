$(document).ready(function () {
  let width = $(document).width();
  let height = $(document).height();
  const imageHeight = 100;
  let fallingMoney = [];
  let canvasContext = null;
  let interval = null;
  let isRaining = true;

  // Detect if the device is mobile based on screen width
  const isMobile = window.innerWidth <= 768; // Change this threshold if needed
  const numMoney = isMobile ? 50 : 150; // If mobile, set numMoney to 50, otherwise to 150
  const imageScale = isMobile ? 0.5 : 1; // If mobile, scale image to 50%

  // Start rain on page load
  const canvas = $('<canvas class="rain"></canvas>');
  canvas.attr('width', width);
  canvas.attr('height', height);
  canvas.appendTo('body');
  initAnimation(canvas[0]);

  // Toggle rain with the link
  $('.toggle-rain').on('click', function (e) {
    e.preventDefault(); // Prevent link's default behavior

    if (isRaining) {
      endAnimation(canvas[0]);
      $(this).text('Start Rain');
    } else {
      initAnimation(canvas[0]);
      $(this).text('Stop Rain');
    }
    isRaining = !isRaining;
  });

  function initAnimation(canvas) {
    const speedOffset = 10;
    const speedRange = 5;
    const numImages = 6;
    const frameRate = 1000 / 30; // 30 frames per second

    canvasContext = canvas.getContext('2d');
    fallingMoney = [];

    _.range(numMoney).forEach(function (index) {
      const isOdd = index % 2 === 1;
      const direction = isOdd ? 1 : -1;

      const money = {
        image: new Image(),
        x: _.random(width),
        y: _.random(-height, -imageHeight),
        angle: _.random(2 * Math.PI),
        speed: speedOffset + _.random(speedRange),
        currentFrame: 0,
        direction: direction,
      };

      const imageIndex = _.random(numImages);
      money.image.src = 'img/money.png'; // Use your actual image path here
      fallingMoney.push(money);
    });

    interval = setInterval(function () {
      draw(imageScale); // Pass the image scale to the draw function
    }, frameRate);
  }

  function draw(imageScale) {
    clearWindow();

    fallingMoney.forEach(function (money, index) {
      drawRotatedImage(money, imageScale);

      money.currentFrame += 1;
      money.y += money.speed;
      money.angle += money.direction * 0.1;
      const radius = money.direction * (10 + (index % 6));
      money.x += Math.sin((money.currentFrame + index) / (2 * Math.PI)) * radius;

      // Reset money position when it falls out of view
      if (money.y > height) {
        money.y = _.random(-height, -imageHeight);
        money.x = _.random(width);
      }
    });
  }

  function clearWindow() {
    canvasContext.clearRect(0, 0, width, height);
  }

  function drawRotatedImage(money, imageScale) {
    canvasContext.save();
    canvasContext.translate(money.x, money.y);
    canvasContext.rotate(money.angle);
    // Adjust the image size based on the imageScale (for mobile)
    canvasContext.drawImage(money.image, 0, 0, 100 * imageScale, 100 * imageScale * money.image.height / money.image.width);
    canvasContext.restore();
  }

  function endAnimation(canvas) {
    clearInterval(interval);
    canvasContext.clearRect(0, 0, width, height);
  }
});