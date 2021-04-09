import { observer } from "mobx-react-lite";
import { main_store } from "./main";
import {
  Button,
  LinearProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import "./main.css";
import useKeypress from "react-use-keypress";

const ProgressComponent = observer(() => {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "auto 70px", gap: "20px" }}
    >
      <LinearProgress
        style={{ height: "25px", borderRadius: "5px" }}
        variant="determinate"
        value={(100 * main_store.checkpoint) / main_store.quote_text.length}
      />
      <Typography color="textSecondary" variant="h6" style={{ width: "700px" }}>
        {main_store.wpm} wpm
      </Typography>
    </div>
  );
});

const QuoteComponent = observer(() => {
  const correct_text = main_store.quote_text.slice(0, main_store.checkpoint);
  const active_correct_text = main_store.quote_text.slice(
    main_store.checkpoint,
    main_store.checkpoint + main_store.mistake_index
  );
  const active_incorrect_text = main_store.quote_text.slice(
    main_store.checkpoint + main_store.mistake_index,
    main_store.checkpoint + main_store.input_word.length
  );

  const next_word_offset =
    main_store.quote_text
      .slice(main_store.checkpoint + main_store.input_word.length)
      .indexOf(" ") !== -1
      ? main_store.quote_text
          .slice(main_store.checkpoint + main_store.input_word.length)
          .indexOf(" ")
      : main_store.quote_text.length -
        main_store.checkpoint -
        main_store.input_word.length;

  const active_pending_text = main_store.quote_text.slice(
    main_store.checkpoint + main_store.input_word.length,
    main_store.checkpoint + main_store.input_word.length + next_word_offset
  );
  const pending_text = main_store.quote_text.slice(
    main_store.checkpoint + main_store.input_word.length + next_word_offset
  );

  return (
    <Typography variant="h5" gutterBottom>
      <span className="correct">{correct_text}</span>
      <span className="active-correct">{active_correct_text}</span>
      <span className="active-incorrect">{active_incorrect_text}</span>
      <span className="active-pending">{active_pending_text}</span>
      <span className="pending">{pending_text}</span>
    </Typography>
  );
});

const PlayAgainComponent = () => {
  const back_to_main_menu = () => (main_store.quote_text = "");
  useKeypress(["s", "m"], (event) => {
    if (event.key === "s") main_store.new_game();
    if (event.key === "m") back_to_main_menu();
  });
  return (
    <center style={{ display: "grid", placeItems: "center" }}>
      <Button
        style={{ width: "200px", marginTop: "20px" }}
        variant="contained"
        color="primary"
        onClick={() => main_store.new_game()}
      >
        Fly again (s)
      </Button>
      <Button
        style={{ width: "200px", marginTop: "20px" }}
        variant="contained"
        color="primary"
        onClick={() => back_to_main_menu()}
      >
        Main Menu (m)
      </Button>
    </center>
  );
};

const CountdownComponent = observer(() => {
  return (
    <center>
      {main_store.checkpoint === main_store.quote_text.length ? (
        <Typography variant="h5" color="textSecondary">
          Nice! You did {main_store.wpm} wpm
        </Typography>
      ) : main_store.countdown > 0 ? (
        <Typography variant="h5" color="textSecondary">
          Wait {main_store.countdown}
        </Typography>
      ) : (
        <Typography variant="h5" color="textSecondary">
          Begin!
        </Typography>
      )}
    </center>
  );
});
const TextInputComponent = observer(() => (
  <TextField
    label="Type here"
    variant="outlined"
    size="small"
    fullWidth
    autoFocus
    error={main_store.mistake_index < main_store.input_word.length}
    onChange={(e) => main_store.set_input_word(e.target.value)}
    value={main_store.input_word}
  />
));
const MenuComponent = observer(() => {
  useKeypress("s", () => {
    main_store.new_game();
  });
  return (
    <div>
      <Typography>Welcome to type a joke</Typography>
      <br />
      <Button
        style={{ width: "200px" }}
        variant="contained"
        color="primary"
        onClick={() => main_store.new_game()}
      >
        New Game (s)
      </Button>
    </div>
  );
});
export const Main = observer(() => {
  return main_store.quote_text.length > 0 ? (
    <div className="container">
      <CountdownComponent></CountdownComponent>
      {main_store.checkpoint !== main_store.quote_text.length ? (
        <>
          <ProgressComponent></ProgressComponent>
          <QuoteComponent></QuoteComponent>
          <TextInputComponent></TextInputComponent>
        </>
      ) : (
        <PlayAgainComponent />
      )}
    </div>
  ) : (
    <MenuComponent></MenuComponent>
  );
});
