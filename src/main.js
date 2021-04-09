import axios from "axios";
import { makeAutoObservable } from "mobx";

class MainStore {
  constructor() {
    makeAutoObservable(this);
  }

  quote_text = "";
  input_word = "";
  checkpoint = 0;
  wpm = 0;
  wpm_interval = undefined;
  mistake_index = 0;
  game_starting_time = Infinity;
  countdown = undefined;

  set_input_word = (input_word) => {
   if (this.countdown > 0) return;
    this.input_word = input_word;

    // Go to next word if required
    const last_character_typed = input_word[input_word.length - 1];
    const next_word = this.quote_text.slice(
      this.checkpoint,
      this.checkpoint + input_word.length
    );
    if (last_character_typed === " " && input_word === next_word) {
      this.input_word = "";
      this.checkpoint = this.checkpoint + input_word.length;
    }

    // Compute if there is a mistake
    let mistake_index = this.input_word.length;
    for (let i = 0; i < input_word.split("").length; i++) {
      const char = input_word.split("")[i];
      if (char !== next_word[i]) {
        mistake_index = i;
        break;
      }
    }
    this.mistake_index = mistake_index;

    // Compute if the game is won
    if (this.checkpoint + this.mistake_index === this.quote_text.length) {
      this.checkpoint = this.quote_text.length;
      clearInterval(this.wpm_interval);
    }
  };

  calculate_wpm = () => {
    const words = (this.checkpoint + this.input_word.length) / 5;
    const minutes = (performance.now() - this.game_starting_time) / 60000;
    this.wpm = Math.round(words / minutes);
  };
  get_quote = async () => {
   const response = await axios.get('https://official-joke-api.appspot.com/random_joke')

   const {setup, punchline} = response.data
   const sanitize = str => str.replace('’', '\'').trim()
    return `${sanitize(setup)} ${sanitize(punchline)}`
  };
  new_game = async () => {
    this.wpm = 0;
    this.wpm_interval = setInterval(this.calculate_wpm, 1000);
    this.countdown = 3;
    this.input_word = "";
    this.mistake_index = 0;
    this.checkpoint = 0;
    this.quote_text = await this.get_quote();
    const countdown = setInterval(() => {
      this.countdown = this.countdown - 1;
      if (this.countdown === 0) {
        this.game_starting_time = performance.now();
        clearInterval(countdown);
      }
    }, 1000);
  };
}

export const main_store = new MainStore();
window.main_store = main_store;
