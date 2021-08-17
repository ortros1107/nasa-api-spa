import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Eonet from "./Components/Eonet/Eonet";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/eonet">
            <Eonet />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
