// midiService.svelte.ts

import { absoluteSemitoneToNote, type Note } from "$lib/helpers/notehelpers";

type MidiMessage = {
  type: 'noteOn' | 'noteOff' | 'other';
  notes: Note[];
  attackType: AttackType
};

type AttackType = "single" | "chord" | null;

type MidiCallback = (msg: MidiMessage) => void;

class MidiService {
  isReady = $state(false);
  isDeviceConnected = $state(false);
  error = $state<string | null>(null);

  private access: any = null;
  private subscribers = new Set<MidiCallback>();

  private inputBuffer: number[] = [];
  private bufferTimer: any = null;
  private readonly CHORD_DETECTION_DELAY_MS = 40;

  private attachListeners() {
    for (const input of this.access.inputs.values()) {
      input.onmidimessage = this.handleMessage.bind(this);
    }
  }

  private handleMessage(event: any) {
    if (this.subscribers.size === 0) return;

    const [status, data1, data2] = event.data;
    // 0xF0 (240) is the mask for the command (e.g. 144 = NoteOn)
    // 0x0F (15) is the mask for the channel (0-15)
    const command = status & 0xF0;
    const velocity = data2;
    const note = data1;

    let type: MidiMessage['type'] = 'other';
    if (command === 144 && velocity > 0) type = 'noteOn';
    else if (command === 128 || (command === 144 && velocity === 0)) type = 'noteOff';

    if (type !== 'noteOn') {
      const message: MidiMessage = { type, notes: [absoluteSemitoneToNote(note)], attackType: null };
      this.subscribers.forEach(callback => callback(message));
    }
    else if (type === 'noteOn') {
      this.processAttack(note);
    }
  }

  private processAttack(note: number) {
    this.inputBuffer.push(note);

    if (this.bufferTimer) {
      clearTimeout(this.bufferTimer);
    }

    this.bufferTimer = setTimeout(() => {
      this.finalizeAttack();
    }, this.CHORD_DETECTION_DELAY_MS);
  }

  private finalizeAttack() {
    const notes = [...this.inputBuffer].sort((a, b) => a - b);
    const notesObj: Note[] = notes.map(e => absoluteSemitoneToNote(e));
    const type = notes.length > 1 ? 'chord' : 'single';

    const message: MidiMessage = { type: "noteOn", notes: notesObj, attackType: type };
    this.subscribers.forEach(callback => callback(message));

    this.inputBuffer = [];
    this.bufferTimer = null;
  }

  private updateConnectionState() {
    if (!this.access) return;

    const inputCount = this.access.inputs.size;

    this.isDeviceConnected = inputCount > 0;
  }

  async init() {
    if (this.access) return;

    if (!navigator.requestMIDIAccess) {
      this.error = "Web MIDI API not supported in this browser.";
      return;
    }

    try {
      this.access = await navigator.requestMIDIAccess({ sysex: false });
      this.isReady = true;
      this.error = null;

      this.attachListeners();
      this.access.onstatechange = (e: any) => {
        this.updateConnectionState();

        if (e.port.type === 'input' && e.port.state === 'connected') {
          this.attachListeners();
        }
      };

    } catch (err: any) {
      console.error("MIDI Access Error:", err);

      if (err.name === 'SecurityError' || err.name === 'NotAllowedError') {
        this.error = "MIDI Permission Denied. Please allow MIDI access in your address bar.";
      } else {
        this.error = "MIDI Connection Failed: " + (err.message || "Unknown Error");
      }
    }
  }

  subscribe(callback: MidiCallback) {
    this.subscribers.add(callback);

    return () => {
      this.subscribers.delete(callback);
    };
  }

  async refreshDevices() {
    if (!this.isReady) {
      await this.init();
    }
    else {
      this.updateConnectionState();
      this.attachListeners();
    }
  }
}

export const midiService = new MidiService();