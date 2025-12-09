export class TimerComponent {
  timeLeft = $state(0);
  onTimeOut: () => void;

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(seconds: number, onTimeOut: () => void) {
    this.timeLeft = seconds;
    this.onTimeOut = onTimeOut;
  }

  start() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.stop();
        this.onTimeOut();
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
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