import {createMuiTheme, ThemeProvider} from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import {Main} from './main.jsx';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#927ba9',
    }
  },
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <Main />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
