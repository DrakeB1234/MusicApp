export class TimerComponent {
  timeLeft = $state(0);
  onTimeOut: () => void;

  private interval: any;

  constructor(seconds: number, onTimeOut: () => void) {
    this.timeLeft = seconds;
    this.onTimeOut = onTimeOut;
  }

  start() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.stop();
        this.onTimeOut();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  addTime(seconds: number) {
    this.timeLeft += seconds;
  }

  formatTime(): string {
    const seconds = Math.floor(Math.max(0, this.timeLeft));

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const paddedSeconds = remainingSeconds < 10
      ? '0' + remainingSeconds
      : remainingSeconds.toString();

    return `${minutes}:${paddedSeconds}`;
  }
}