// Used to call a function on n times by set interval
export class TimedFunctionComponent {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentIterationsLeft: number = 0;
  private timerResolve: (() => void) | null = null;

  async startAndWait(iterations: number, interval: number, tickCallback?: () => void, intialCall: boolean = true): Promise<void> {
    this.stop();

    if (interval < 250) return;
    if (interval > 10000) return;

    if (iterations > 100) return;

    // Immediately invoke callback if prop initialCall
    if (intialCall) {
      if (tickCallback) tickCallback();
      this.currentIterationsLeft = iterations - 1;
    }
    else {
      this.currentIterationsLeft = iterations;
    }

    return new Promise((resolve) => {
      this.timerResolve = resolve;

      this.intervalId = setInterval(() => {
        this.currentIterationsLeft--;
        if (tickCallback) tickCallback();

        if (this.currentIterationsLeft <= 0) {
          this.stop();
        }

      }, interval);
    });
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
    this.currentIterationsLeft = 0;

    if (this.timerResolve) {
      this.timerResolve();
      this.timerResolve = null;
    }
  }
}