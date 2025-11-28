let seeSpriteSheet, walkSpriteSheet, shootSpriteSheet, sleepSpriteSheet;
let seeAnimation = [], walkAnimation = [], shootAnimation = [], sleepAnimation = [];

const seeFrameCount = 8; // 'see.png' 的圖片總數
const walkFrameCount = 4; // 'walk.png' 的圖片總數
const shootFrameCount = 5; // 'shoot.png' 的圖片總數
const sleepFrameCount = 12; // 'sleep.png' 的圖片總數

let seeFrameWidth, walkFrameWidth, shootFrameWidth, sleepFrameWidth;
let charX, charY; // 角色的位置
let speed = 3; // 角色的移動速度
let facingRight = true; // 角色面向的方向，預設向右

let isShooting = false; // 是否正在播放射擊動畫
let shootFrame = 0; // 目前射擊動畫的畫格
const shootAnimationSpeed = 8; // 射擊動畫速度，數字越小越快

let isSleeping = false; // 是否正在播放睡眠動畫
let sleepPlayFrame = 0; // 睡眠動畫已播放的畫格數


function preload() {
  // 預先載入圖片精靈檔案
  seeSpriteSheet = loadImage('1/see/see.png');
  walkSpriteSheet = loadImage('1/walk/walk.png');
  shootSpriteSheet = loadImage('1/shoot/shoot.png');
  sleepSpriteSheet = loadImage('1/sleep/sleep.png');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 初始化角色位置在畫布中央
  charX = width / 2;
  charY = height / 2;

  // --- 處理 'see' 動畫 ---
  seeFrameWidth = seeSpriteSheet.width / seeFrameCount;
  for (let i = 0; i < seeFrameCount; i++) {
    let frame = seeSpriteSheet.get(i * seeFrameWidth, 0, seeFrameWidth, seeSpriteSheet.height);
    seeAnimation.push(frame);
  }

  // --- 處理 'walk' 動畫 ---
  walkFrameWidth = walkSpriteSheet.width / walkFrameCount;
  for (let i = 0; i < walkFrameCount; i++) {
    let frame = walkSpriteSheet.get(i * walkFrameWidth, 0, walkFrameWidth, walkSpriteSheet.height);
    walkAnimation.push(frame);
  }

  // --- 處理 'shoot' 動畫 ---
  shootFrameWidth = shootSpriteSheet.width / shootFrameCount;
  for (let i = 0; i < shootFrameCount; i++) {
    let frame = shootSpriteSheet.get(i * shootFrameWidth, 0, shootFrameWidth, shootSpriteSheet.height);
    shootAnimation.push(frame);
  }

  // --- 處理 'sleep' 動畫 ---
  sleepFrameWidth = sleepSpriteSheet.width / sleepFrameCount;
  for (let i = 0; i < sleepFrameCount; i++) {
    let frame = sleepSpriteSheet.get(i * sleepFrameWidth, 0, sleepFrameWidth, sleepSpriteSheet.height);
    sleepAnimation.push(frame);
  }
}

function keyPressed() {
  // 當按下空白鍵且不在射擊狀態時，開始射擊動畫
  if (keyCode === 32 && !isShooting) {
    isShooting = true;
    shootFrame = 0; // 從第一格開始
  }
}

function draw() {
  // 設定背景顏色
  background('#e6ccb2');

  if (isShooting) {
    // --- 播放射擊動畫 ---
    playShootAnimation();

  } else if (isSleeping) {
    // --- 播放睡眠動畫 ---
    playSleepAnimation();

  } else {
    // --- 處理移動和閒置狀態 ---
    handleMovementAndIdle();
  }
}

function handleMovementAndIdle() {
    // 檢查方向鍵
    if (keyIsDown(RIGHT_ARROW)) {
    // 按下右鍵：向右移動
    charX += speed;
    facingRight = true;
    let currentFrame = floor(frameCount / 12) % walkAnimation.length;
    image(walkAnimation[currentFrame], charX - walkFrameWidth / 2, charY - walkSpriteSheet.height / 2);

  } else if (keyIsDown(LEFT_ARROW)) {
    // 按下左鍵：向左移動並翻轉圖片
    charX -= speed;
    facingRight = false;
    let currentFrame = floor(frameCount / 12) % walkAnimation.length;
    
    push(); // 儲存目前的繪圖設定
    translate(charX + walkFrameWidth / 2, charY - walkSpriteSheet.height / 2); // 將原點移動到圖片的右上角
    scale(-1, 1); // 水平翻轉座標系
    image(walkAnimation[currentFrame], 0, 0); // 在新的原點繪製圖片
    pop(); // 恢復原本的繪圖設定

  } else if (keyIsDown(DOWN_ARROW)) {
    // 按下下鍵：開始睡眠動畫
    isSleeping = true;
    sleepPlayFrame = 0; // 重置播放計數

  } else {
    // 沒有按鍵：播放觀望動畫，並保持最後的方向
    let currentFrame = floor(frameCount / 12) % seeAnimation.length;
    if (facingRight) {
      image(seeAnimation[currentFrame], charX - seeFrameWidth / 2, charY - seeSpriteSheet.height / 2);
    } else {
      push();
      translate(charX + seeFrameWidth / 2, charY - seeSpriteSheet.height / 2);
      scale(-1, 1);
      image(seeAnimation[currentFrame], 0, 0);
      pop();
    }
  }
}

function playShootAnimation() {
  // 根據 shootFrame 決定要顯示哪一格
  let currentFrameIndex = floor(shootFrame);
  let currentImg = shootAnimation[currentFrameIndex];

  // 讓角色在播放動畫時輕微上下移動
  let yOffset = 0;
  if (currentFrameIndex < 2) yOffset = -5; // 向上
  else if (currentFrameIndex > 2) yOffset = 5; // 向下

  // 根據角色面向的方向來繪製
  if (facingRight) {
    image(currentImg, charX - shootFrameWidth / 2, charY - shootSpriteSheet.height / 2 + yOffset);
  } else {
    push();
    translate(charX + shootFrameWidth / 2, charY - shootSpriteSheet.height / 2 + yOffset);
    scale(-1, 1);
    image(currentImg, 0, 0);
    pop();
  }

  // 更新射擊動畫的畫格
  shootFrame += 1 / shootAnimationSpeed;

  // 如果動畫播放完畢，則結束射擊狀態
  if (shootFrame >= shootFrameCount) {
    isShooting = false;
  }
}

function playSleepAnimation() {
  // 根據已播放的畫格數來決定要顯示 sleepAnimation 中的哪一格 (循環播放)
  let currentFrameIndex = floor(sleepPlayFrame);
  let currentImg = sleepAnimation[currentFrameIndex];

  // 讓角色在播放動畫時輕微上下移動
  let yOffset = sin(frameCount * 0.2) * 5;

  // 根據角色面向的方向來繪製
  if (facingRight) {
    image(currentImg, charX - sleepFrameWidth / 2, charY - sleepSpriteSheet.height / 2 + yOffset);
  } else {
    push();
    translate(charX + sleepFrameWidth / 2, charY - sleepSpriteSheet.height / 2 + yOffset);
    scale(-1, 1);
    image(currentImg, 0, 0);
    pop();
  }

  // 更新已播放的畫格數，調整數值以控制動畫速度
  sleepPlayFrame += 0.2;

  // 如果動畫播放完畢 (達到12個畫格)，則結束睡眠狀態
  // 當沒有按下向上鍵時，恢復顯示SeeSheet -> 這裡的邏輯是播放完12個畫格後就恢復
  if (sleepPlayFrame >= 12) {
    isSleeping = false;
  }
}
