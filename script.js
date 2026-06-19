(function() {
  'use strict';

  // Mobile menu toggle logic
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen.toString());
      });

      links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          links.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });

  // Secret Game (SEO Breaker) Context
  let canvas = null;
  let ctx = null;
  let gameInterval = null;

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 400;

  let ballX = 0;
  let ballY = 0;
  let ballSpeedX = 0;
  let ballSpeedY = 0;
  const ballRadius = 6;
  const paddleWidth = 75;
  const paddleHeight = 10;
  let paddleX = 0;
  const brickRows = 7;
  const brickCols = 12;
  const brickWidth = 30;
  const brickHeight = 10;
  const brickPadding = 2;
  const brickOffsetTop = 40;
  const brickOffsetLeft = 9;
  let bricks = [];

  const layoutPattern = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
    [1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1], 
    [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

  const seoBugNames = [
    'Broken Link', 'Slow CSS', 'Alt Text Missing', 'Duplicate Meta',
    'Redirect Loop', 'Large Image', 'Unused JS', 'Poor Mobile UX'
  ];

  let score = 0;
  let hiscore = 0;
  let lives = 3;
  let level = 1;
  let gameActive = false;
  let lastFrameTime = 0;

  let rightPressed = false;
  let leftPressed = false;
  let controlsBound = false;

  function initBricks() {
    bricks = [];
    for (let r = 0; r < brickRows; r++) {
      bricks[r] = [];
      for (let c = 0; c < brickCols; c++) {
        const active = layoutPattern[r][c] === 1;
        const bugName = seoBugNames[Math.floor(Math.random() * seoBugNames.length)];
        bricks[r][c] = {
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          status: active ? 1 : 0,
          name: bugName,
          points: 5,
          color: "#f97316"
        };
      }
    }
  }

  function resetBall() {
    if (!canvas) return;
    ballX = GAME_WIDTH / 2;
    ballY = GAME_HEIGHT - 30;
    ballSpeedX = (Math.random() - 0.5) * 300;
    ballSpeedY = -300 - (level * 30); 
  }

  function resetGame() {
    score = 0;
    lives = 3;
    level = 1;
    paddleX = (GAME_WIDTH - paddleWidth) / 2;
    resetBall();
    initBricks();
    updateScoreUI();
    const statusText = document.getElementById('game-status-text');
    if (statusText) statusText.textContent = '❤️ ❤️ ❤️';
  }

  function updateScoreUI() {
    const scoreVal = document.getElementById('game-score');
    const hiscoreVal = document.getElementById('game-hiscore');
    const rankVal = document.getElementById('game-rank');
    const statusText = document.getElementById('game-status-text');

    if (scoreVal) scoreVal.textContent = score;
    if (hiscoreVal) hiscoreVal.textContent = hiscore;
    
    const rank = Math.max(1, 100 - Math.floor(score / 2));
    if (rankVal) rankVal.textContent = '#' + rank;
    
    if (rank === 1 && statusText) {
      statusText.textContent = '🏆 Rank #1 on Google achieved!';
    }
  }

  function checkWin() {
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickCols; c++) {
        if (layoutPattern[r][c] === 1 && bricks[r][c].status === 1) {
          return false;
        }
      }
    }
    return true;
  }

  function winLevel() {
    gameActive = false;
    stopControlListeners();
    const overlay = document.getElementById('game-overlay-screen');
    const overlayTitle = document.getElementById('game-overlay-title');
    const overlayDesc = document.getElementById('game-overlay-desc');
    const startBtn = document.getElementById('game-start-btn');
    const statusText = document.getElementById('game-status-text');
    
    level++;
    if (overlayTitle) overlayTitle.textContent = 'PAGE OPTIMIZED!';
    if (overlayDesc) {
      overlayDesc.innerHTML = `Cleared all SEO Blocks!<br>Domain Authority (DA): <strong>${score}</strong><br>Moving to Rank Boost Level <strong>${level}</strong>!`;
    }
    if (startBtn) startBtn.textContent = 'Start Level ' + level;
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
    }
    
    if (statusText) statusText.textContent = 'Google PageSpeed score: 100/100!';
  }

  function gameOver() {
    gameActive = false;
    stopControlListeners();
    
    const overlay = document.getElementById('game-overlay-screen');
    const overlayTitle = document.getElementById('game-overlay-title');
    const overlayDesc = document.getElementById('game-overlay-desc');
    const startBtn = document.getElementById('game-start-btn');
    const statusText = document.getElementById('game-status-text');
    
    if (overlayTitle) overlayTitle.textContent = 'ALGORITHM PENALTY';
    if (overlayDesc) {
      overlayDesc.innerHTML = `SEO score crashed!<br>Domain Authority (DA): <strong>${score}</strong><br>Final Google Rank: <strong>#${Math.max(1, 100 - Math.floor(score / 2))}</strong>`;
    }
    if (startBtn) startBtn.textContent = 'Re-index Site';
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
    }
    
    if (statusText) statusText.textContent = 'Penalty applied. Try re-indexing.';
  }

  function collisionDetection() {
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickCols; c++) {
        let b = bricks[r][c];
        if (b.status === 1) {
          if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
            ballSpeedY = -ballSpeedY;
            b.status = 0;
            score += b.points;
            
            const statusText = document.getElementById('game-status-text');
            if (statusText) statusText.textContent = `Fixed: "${b.name}"! +${b.points} DA`;
            
            if (score > hiscore) {
              hiscore = score;
              localStorage.setItem('seo_hiscore', hiscore.toString());
            }
            
            updateScoreUI();
            
            if (checkWin()) {
              winLevel();
              return;
            }
          }
        }
      }
    }
  }

  function drawBricks() {
    for (let r = 0; r < brickRows; r++) {
      for (let c = 0; c < brickCols; c++) {
        let b = bricks[r][c];
        if (b.status === 1) {
          ctx.fillStyle = b.color;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(b.x, b.y, brickWidth, brickHeight, 3);
          } else {
            ctx.rect(b.x, b.y, brickWidth, brickHeight);
          }
          ctx.fill();
        }
      }
    }
  }

  function drawBall() {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPaddle() {
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    const paddleTopY = GAME_HEIGHT - paddleHeight - 10;
    if (ctx.roundRect) {
      ctx.roundRect(paddleX, paddleTopY, paddleWidth, paddleHeight, 5);
    } else {
      ctx.rect(paddleX, paddleTopY, paddleWidth, paddleHeight);
    }
    ctx.fill();
  }

  function drawGame() {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    drawBricks();
    drawBall();
    drawPaddle();
  }

  function gameTick(timestamp) {
    if (!gameActive) return;
    
    gameInterval = requestAnimationFrame(gameTick);
    
    const dt = Math.min((timestamp - lastFrameTime) / 1000, 0.1);
    lastFrameTime = timestamp;

    const paddleSpeed = 450;
    if (rightPressed && paddleX < GAME_WIDTH - paddleWidth) {
      paddleX += paddleSpeed * dt;
    }
    if (leftPressed && paddleX > 0) {
      paddleX -= paddleSpeed * dt;
    }
    
    ballX += ballSpeedX * dt;
    ballY += ballSpeedY * dt;
    
    if (ballX + ballSpeedX * dt > GAME_WIDTH - ballRadius || ballX + ballSpeedX * dt < ballRadius) {
      ballSpeedX = -ballSpeedX;
    }
    
    if (ballY + ballSpeedY * dt < ballRadius) {
      ballSpeedY = -ballSpeedY;
    }
    
    const paddleTopY = GAME_HEIGHT - paddleHeight - 10;
    if (ballY + ballSpeedY * dt > paddleTopY - ballRadius && ballY < paddleTopY) {
      if (ballX > paddleX && ballX < paddleX + paddleWidth) {
        const currentSpeed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);
        const hitPos = ballX - (paddleX + paddleWidth / 2);
        const hitPercent = hitPos / (paddleWidth / 2);
        const maxAngle = 60 * Math.PI / 180;
        const bounceAngle = hitPercent * maxAngle;
        
        ballSpeedX = currentSpeed * Math.sin(bounceAngle);
        ballSpeedY = -currentSpeed * Math.cos(bounceAngle);
      }
    }
    
    if (ballY + ballSpeedY * dt > GAME_HEIGHT - ballRadius) {
      lives--;
      const statusText = document.getElementById('game-status-text');
      if (lives <= 0) {
        gameOver();
        return;
      } else {
        resetBall();
        if (statusText) statusText.textContent = '❤️ '.repeat(lives);
      }
    }
    
    collisionDetection();
    
    drawGame();
  }

  function setupCanvasResolution() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;
    ctx.scale(dpr, dpr);
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      rightPressed = true;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      leftPressed = true;
    }
    if (gameActive && (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault();
    }
  }

  function handleKeyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      rightPressed = false;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      leftPressed = false;
    }
  }

  function handleMouseMove(e) {
    if (!gameActive || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * GAME_WIDTH;
    paddleX = mouseX - paddleWidth / 2;
    
    if (paddleX < 0) paddleX = 0;
    if (paddleX > GAME_WIDTH - paddleWidth) paddleX = GAME_WIDTH - paddleWidth;
  }

  function handleTouchMove(e) {
    if (!gameActive || !canvas) return;
    if (e.target === canvas || canvas.contains(e.target)) {
      e.preventDefault();
    }
    const rect = canvas.getBoundingClientRect();
    const touchX = ((e.changedTouches[0].clientX - rect.left) / rect.width) * GAME_WIDTH;
    paddleX = touchX - paddleWidth / 2;
    
    if (paddleX < 0) paddleX = 0;
    if (paddleX > GAME_WIDTH - paddleWidth) paddleX = GAME_WIDTH - paddleWidth;
  }

  function startControlListeners() {
    if (controlsBound) return;
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    controlsBound = true;
  }

  function stopControlListeners() {
    if (!controlsBound) return;
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleTouchMove);
    controlsBound = false;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const gameModal = document.getElementById('game-modal');
    const closeBtn = document.querySelector('.game-close-btn');
    const backdrop = document.querySelector('.game-modal-backdrop');
    const startBtn = document.getElementById('game-start-btn');

    if (!gameModal) return;

    function openGame() {
      gameModal.classList.add('active');
      gameModal.setAttribute('aria-hidden', 'false');
      
      canvas = document.getElementById('game-canvas');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      setupCanvasResolution();
      startControlListeners();
      
      hiscore = parseInt(localStorage.getItem('seo_hiscore') || '0', 10);
      
      const overlay = document.getElementById('game-overlay-screen');
      const overlayTitle = document.getElementById('game-overlay-title');
      const overlayDesc = document.getElementById('game-overlay-desc');
      
      if (overlayTitle) overlayTitle.textContent = 'INSERT COIN';
      if (overlayDesc) {
        overlayDesc.innerHTML = 'Use Arrow keys / WASD or drag on screen to control your Search Crawler. Break the unoptimized SEO blocks!';
      }
      if (startBtn) startBtn.textContent = 'Start Game';
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';
      }
      
      resetGame();
      drawGame();
    }

    function closeGame() {
      gameActive = false;
      cancelAnimationFrame(gameInterval);
      stopControlListeners();
      gameModal.classList.remove('active');
      gameModal.setAttribute('aria-hidden', 'true');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeGame);
    if (backdrop) backdrop.addEventListener('click', closeGame);

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && gameModal.classList.contains('active')) {
        closeGame();
      }
    });

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        const overlay = document.getElementById('game-overlay-screen');
        if (overlay) {
          overlay.style.opacity = '0';
          overlay.style.pointerEvents = 'none';
        }
        
        const overlayTitleEl = document.getElementById('game-overlay-title');
        const overlayTitle = overlayTitleEl ? overlayTitleEl.textContent : '';
        const statusText = document.getElementById('game-status-text');

        if (overlayTitle === 'PAGE OPTIMIZED!') {
          paddleX = (GAME_WIDTH - paddleWidth) / 2;
          resetBall();
          initBricks();
          updateScoreUI();
          if (statusText) statusText.textContent = '❤️ '.repeat(lives);
          startControlListeners();
        } else {
          resetGame();
          startControlListeners();
        }
        
        gameActive = true;
        lastFrameTime = performance.now();
        gameInterval = requestAnimationFrame(gameTick);
      });
    }

    let clickCount = 0;
    let lastClickTime = 0;

    function handleEggClick(e) {
      const now = Date.now();
      if (now - lastClickTime > 2500) {
        clickCount = 0;
      }
      clickCount++;
      lastClickTime = now;
      
      if (clickCount >= 3) {
        clickCount = 0;
        openGame();
      } else {
        const target = e.currentTarget;
        if (target) {
          target.style.transform = 'scale(0.9) rotate(-10deg)';
          setTimeout(() => {
            target.style.transform = 'none';
          }, 150);
        }
      }
    }

    const logoDot = document.getElementById('logo-dot');
    const avatarEgg = document.getElementById('avatar-egg');

    if (logoDot) {
      logoDot.style.display = 'inline-block';
      logoDot.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      logoDot.addEventListener('click', handleEggClick);
    }

    if (avatarEgg) {
      avatarEgg.style.transition = 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      avatarEgg.addEventListener('click', handleEggClick);
    }

    window.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        openGame();
      }
    });
  });
})();
