import React from "react";
import "./App.css";
import styled from "styled-components";
import CardDeck from "./components/CardDeck";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PokeSinglePage from "./components/PokeSinglePage";

const Title = styled.img`
  margin: 10px;
  width: 25%;
  height: auto;
`;

function App() {
  return (
    <Router>
      <div className="App">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Title
            alt="headline"
            src="https://cdn2.bulbagarden.net/upload/archive/4/4b/20100413180610%21Pok%C3%A9dex_logo.png"
          ></Title>
        </Link>
      </div>
      <Switch>
        <Route exact path="/" component={CardDeck} />
        <Route path="/pokemon/:id" component={PokeSinglePage} />
      </Switch>
    </Router>
  );
}

export default App;
