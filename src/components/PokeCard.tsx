import React from "react";
import styled from "styled-components";
import { IpokeCard } from "../interfaces";
import { Link } from "react-router-dom";

const Card = styled.div`
  display: flex;
  background-color: #f7f7f9;
  flex-direction: column;
  border: 2px solid #e7e7e7;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  color: #2323a5;
  &:hover {
    cursor: pointer;
    background-color: #fccbfc8e;
  }
`;

const StyledImg = styled.img`
  width: 150px;
`;

const Title = styled.h3`
  color: #2323a5;
`;
export default function PokeCard(pokemonData: IpokeCard) {
  return (
    <Link to={`/pokemon/${pokemonData.id}`} className="nav-link">
      <Card >
        <p>{`#${pokemonData.id}`}</p>
        <StyledImg src={pokemonData.image} alt="pokemon" id="card"></StyledImg>
        <Title>{pokemonData.name}</Title>
      </Card>
    </Link>
  );
}
