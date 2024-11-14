let webcam;
let detector;

let videoFrame;

let state = 0;
// 0: main page  1: recording page  2: paused page  3: saved page

//=======이미지==========
let btn_pause = [];
let btn_record = [];
let btn_stop = [];
let stateIndicator = [];

let recordingTime = '00:00:00';
let record

ingStartTime = 0;
let pausedStartTime = 0; //Number type variable
let pausedTime = 0; //Number type variable
let totalPausedTime = 0; //Number type variable

let detedtedObjects = [];

function preload() {  
  detector = ml5.objectDetector('cocossd');
  
  videoFrame = loadImage('img/video_preview.png');
  
  btn_pause[0] = loadImage('img/pause_disabled.png');
  btn_pause[1] = loadImage('img/pause_activated.png');
  
  btn_record[0] = loadImage('img/record_stop.png');
  btn_record[1] = loadImage('img/record_recording.png');
  btn_record[2] = loadImage('img/record_paused.png');
  btn_record[3] = loadImage('img/record_saved.png');
  
  btn_stop[0] = loadImage('img/stop_disabled.png');
  btn_stop[1] = loadImage('img/stop_activated.png');
  
  
  stateIndicator[0] = loadImage('img/tapToRecord.png');
  stateIndicator[1] = loadImage('img/state_recording.png');
  stateIndicator[2] = loadImage('img/state_paused.png');
  stateIndicator[3] = loadImage('img/state_saved.png');
}

//========================================
  
function setup() {
  createCanvas(1280, 836); // 캔버스 크기
  webcam = createCapture(VIDEO);
  webcam.size(320, 240);
  webcam.hide();
  
  detector.detect(webcam, gotDetections);
}

function draw() {
  background(0); //백그라운드 검정색 
  
  calculateRecordingTime();
  
  drawVideoPreview(0,0,840,832); //실시간화면 크기
  drawStatusBar(state); //상단바
  drawButtons(state);//Pause, Record, Stop 버튼
  drawCounter(state);
  drawStateIndicator(state);
}

function drawVideoPreview(x, y, w, h){
  image(webcam, x, y, w, h);
  image(videoFrame, x, y, w, h);
}
//==================== 실시간 화면 그리기

function drawStateIndicator(currentState){
  image(stateIndicator[currentState], 900,60,120,24);
}

function drawButtons(currentState){
  let pause_stop_button_number = 0;
  if(currentState == 1){
    pause_stop_button_number = 1;
  }  
  //state == 1 일때만 draw Buttons
  image(btn_pause[pause_stop_button_number], 900, 700, 80, 80);
  image(btn_record[currentState], 1010, 700, 80, 80);
  image(btn_stop[pause_stop_button_number], 1120, 700, 80, 80);
  //버튼 위치
}

//=================== drawStatusBar

function drawStatusBar(currentState){
  fill(255, 51);
  noStroke();
  rect(1060,60,140,40,4);
  rect(1060,120,140,40,4);
  rect(1060,180,146,40,4);
  
  textFont('Inter');
  textSize(22);
  
  let currentTime = ''+nf(hour(),2,0)+':'+nf(minute(),2,0)+':'+nf(second(),2,0);
  let currentDate = ''+year()+'.'+nf(month(),2,0)+'.'+nf(day(),2,0)+'.';
  //숫자 포맷 맞추기
  
  //0일때
  if(currentState == 0){
    fill(255, 255, 255); // 텍스트 색상 설정 (흰색)
    stroke(255,153);
    strokeWeight(1);
    text('Recording Time', 880, 90);
    text('Current Time', 880, 150);
    text('Current Date', 880, 210);
    //ellipse(880,80,16,16);
    fill(255,153);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 1070, 90);
    //recording time
    textAlign(LEFT);
    text(currentTime, 1070, 150);
    textAlign(LEFT);
    text(currentDate, 1070, 210);
    text(currentDate, 1070, 210)
 //1일때 
  }else if(currentState == 1){
   fill(255, 255, 255); // 텍스트 색상 설정 (흰색)
    stroke(255,153);
    strokeWeight(1);
    text('Recording Time', 880, 90);
    text('Current Time', 880, 150);
    text('Current Date', 880, 210);
    //ellipse(16,12,12,12);
    fill(202,38,38);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 1070, 90);
    fill(255);
    textAlign(LEFT);
    text(currentTime, 1070, 150);
    textAlign(LEFT);
    text(currentDate, 1070, 210);
   //2일때 
  }else if(currentState == 2){
    fill(255, 255, 255); // 텍스트 색상 설정 (흰색)
    stroke(255,153);
    strokeWeight(1);
    text('Recording Time', 880, 90);
    text('Current Time', 880, 150);
    text('Current Date', 880, 210);
    //ellipse(16,12,11,11);
    fill(202,38,38);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 1070, 90);
    fill(255,153);
    textAlign(LEFT);
    text(currentTime, 1070, 150);
    textAlign(LEFT);
    text(currentDate, 1070, 210);
  //3일때 
  }else if(currentState == 3){
    fill(255, 255, 255); // 텍스트 색상 설정 (흰색)
    stroke(255,153);
    strokeWeight(1);
    text('Recording Time', 880, 90);
    text('Current Time', 880, 150);
    text('Current Date', 880, 210);
    //ellipse(16,12,11,11);
    fill(255,153);
    noStroke();
    textAlign(LEFT);
    text(recordingTime, 1070, 90);
    textAlign(LEFT);
    text(currentTime, 1070, 150);
    textAlign(LEFT);
    text(currentDate, 1070, 210);
  }
}
//====================봤다
//==============여기 밑에 보러와라
function drawStateIndicator(currentState){
  image(stateIndicator[currentState], 980,660,120,24);
}

//drawCounter 봤다
function drawCounter(currentState){
  fill(255, 51);
  noStroke();
  rect(2,262,60,20,4);
  
  textFont('Inter');
  textSize(14);
  
}

//gotDectections 봤다이건
function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  
  detectedObjects = results;
  detector.detect(webcam, gotDetections);
}

//==========================BUTTON ACTION ADDED=========================================================BUTTON ACTION ADDED===============================

function mouseReleased(){
  if(state == 0){
    if (mouseX >= 1010 && mouseX <= 1010 + 80 && mouseY >= 700 && mouseY <= 700 + 80){ // for Recording BTN
      state = 1; //go to 1.Recording Page from 0.Main Page.
      recordingStartTime = millis();
    }
  }else if(state == 1){
    if (mouseX >= 900 && mouseX <= 900 + 80 && mouseY >= 700 && mouseY <= 700 + 80) { // for Pause BTN
      state = 2; //go to 2.Paused Page from 1.Recording Page.
      pausedStartTime = millis();
    }
    if (mouseX >= 1120 && mouseX <= 1120 + 80 && mouseY >= 700 && mouseY <= 700 + 80){ // for Stop BTN
      state = 3; //go to 3.Saved Page from 1.Recording Page.
      initializeTimes();
    }
  }else if(state == 2){
    if (mouseX >= 1010 && mouseX <= 1010 + 80 && mouseY >= 700 && mouseY <= 700 + 80){ // for Recording BTN
      state = 1; //go to 1.Recording Page from 2.Paused Page.
      totalPausedTime = totalPausedTime + pausedTime;
    }
  }else if(state == 3){
    if(dist(mouseX, mouseY, 160, 319) <= 21){ // for Recording BTN
      state = 0; //go to 0.Main Page from 3.Saved Page.
    }
  }
}


function initializeTimes(){
  recordingStartTime = 0;
  pausedStartTime = 0;
  pausedTime = 0;
  totalPausedTime = 0;
}


function calculateRecordingTime(){
  let cur_time = millis();
  
  if(state == 0){ //0.Main Page
    recordingTime = '00:00:00';
  }else if(state == 1){ //1.Recording Page
    let rec_time = cur_time - recordingStartTime - totalPausedTime;
    let rec_sec = int(rec_time / 1000) % 60;
    let rec_min = int(rec_time / (1000*60)) % 60;
    let rec_hour = int(rec_time / (1000*60*60)) % 60;
    
    recordingTime = ''+nf(rec_hour,2,0)+':'+nf(rec_min,2,0)+':'+nf(rec_sec,2,0);
  }else if(state == 2){ //2.Paused Page
    pausedTime = millis() - pausedStartTime;
  }else if(state == 3){ //3.Saved Page
    recordingTime = '00:00:00';
  }
}

