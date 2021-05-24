class PlaybackGenerator {
  constructor() {
    this.body = null;
    this.start = null;
    this.isRecording = false;
    this.playbackActive = false;
    this.recording = [];

    document.addEventListener("DOMContentLoaded", () => {
      this.init();
    });
  }
  //   let body,
  //     start = null,
  //     isRecording = false;
  //   let recording = [];
  //   let mapping = {
  //     //q - p
  //     q: 81,
  //     w: 87,
  //     e: 69,
  //     r: 82,
  //     t: 84,
  //     y: 89,
  //     u: 85,
  //     i: 73,
  //     o: 79,
  //     p: 80,
  //     //a - l
  //     a: 65,
  //     s: 83,
  //     d: 68,
  //     f: 70,
  //     g: 71,
  //     h: 72,
  //     j: 74,
  //     k: 75,
  //     l: 76,
  //     //z - m
  //     z: 90,
  //     x: 88,
  //     c: 67,
  //     v: 86,
  //     b: 66,
  //     n: 78,
  //     m: 77,
  //   };

  startRecording = () => {
    //if recording already return we don't want to double record
    //user accidentially clicks a second time after recording a few
   if (this.isRecording) return;
    this.start = new Date().getTime();
    this.isRecording = true;
    if (this.recording.length) {
      //playback old steps while recording new ones
      this.playback();
      this.updateStatus("Recording w/Playback");
    } else {
      this.updateStatus("Recording");
    }
  };
  stopRecording = () => {
    this.isRecording = false;
    this.updateStatus("Recording Stopped");
    this.sortRecording();
  };
  sortRecording = () => {
    //ensure new entries are put in proper order
    this.recording.sort((a, b) => {
      return a.delay > b.delay ? 1 : -1;
    });
  };

  reset = () => {
    this.isRecording = false;
    this.start = null;
    this.recording = [];
    this.updateStatus("Reset");
  };
  addEntry = ({ ctx, buffer }) => {
    if (!this.isRecording) return;
    let now = new Date().getTime();
    this.recording.push({ ctx, buffer, delay: now - this.start });
  };
  stopPlayback = () => {
    this.playbackActive = false;
  };
  playback = () => {
    this.updateStatus("Playback");
    this.playbackActive = true;
    for (let i = 0; i < this.recording.length; i++) {
      const { ctx, buffer, delay } = this.recording[i];
      setTimeout(() => {
        if (this.playbackActive) {
          this.playsound({ ctx, buffer });
        }
      }, delay);
    }
  };
  playsound = ({ ctx, buffer }) => {
    let source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.loop = false; //params.loop;
    source.start(/*params.time*/);
  };
  //document status
  updateStatus = (status) => {
    let p = document.getElementById("recordingStatus");
    if (!p) {
      p = document.createElement("p");
      p.id = "recordingStatus";
    }

    p.innerText = `Status: ${status}`;
    this.positionElem(p);
    this.body.prepend(p);
  };
  controls = () => {
    let startButton = document.createElement("button");
    startButton.innerText = "Start Recording";
    this.positionElem(startButton);
    let stopButton = document.createElement("button");
    stopButton.innerText = "Stop Recording";
    this.positionElem(stopButton);
    let playbackButton = document.createElement("button");
    playbackButton.innerText = "Playback";
    this.positionElem(playbackButton);
    let stopPlaybackButton = document.createElement("button");
    stopPlaybackButton.innerText = "Stop Playback";
    this.positionElem(stopPlaybackButton);

    let resetButton = document.createElement("button");
    resetButton.innerText = "Reset";
    this.positionElem(resetButton);

    startButton.onclick = () => this.startRecording();
    stopButton.onclick = () => this.stopRecording();
    playbackButton.onclick = () => this.playback();
    stopPlaybackButton.onclick = () => this.stopPlayback();
    resetButton.onclick = () => this.reset();

    this.body.prepend(
      startButton,
      stopButton,
      playbackButton,
      stopPlaybackButton,
      resetButton
    );
  };
  positionElem = (elem) => {
    elem.style.position = "relative";
    elem.style.zIndex = "10000";
  };
  init = () => {
    this.body = document.querySelector("body");
    window.addEventListener("keydown", (e) => {
      if (e.key === "1") {
        this.startRecording();
      } else if (e.key === "2") {
        this.stopRecording();
      } else if (e.key === "5") {
        this.stopRecording();
        this.playback();
      } else if (e.key === "9") {
        this.reset();
      }
    });
    this.controls();
    this.updateStatus("Waiting....");
  };
}
const Playback = new PlaybackGenerator();
