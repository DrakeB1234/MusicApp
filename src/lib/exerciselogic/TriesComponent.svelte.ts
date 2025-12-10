export class TriesComponent {
  private startingTries;
  private triesLeft = $state(0);
  private onTriesOut: () => void;

  constructor(tries: number, onTriesOut: () => void) {
    this.startingTries = tries;
    this.triesLeft = tries;
    this.onTriesOut = onTriesOut;
  }

  get triesLeftCount() {
    return this.triesLeft;
  }

  decrementTries() {
    this.triesLeft--;
    if (this.triesLeft <= 0) {
      this.onTriesOut();
    }
  }

  resetTries() {
    this.triesLeft = this.startingTries;
  }
}