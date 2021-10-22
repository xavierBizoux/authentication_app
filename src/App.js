import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { blue } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles'

import { AuthContext } from './contexts'

import Home from './pages/Home'

const theme = createTheme({
  palette: {
    primary: {
      main: blue[700],
      mainText: "white",
      buttonColor: blue[600]
    }
  },
});

function App() {
  const [authInfo, setAuthInfo] = useState({
    authenticated: false,
    user: "",
    tokenInfo: {}
  })
  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  )
}

export default App
