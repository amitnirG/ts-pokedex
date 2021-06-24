import React from "react";
import styled from "styled-components";
import { IpokeCard } from "../interfaces";
import { Link } from "react-router-dom";




export default function PokeCard(pokemonData: IpokeCard) {
  return (
    <StyledLink to={`/pokemon/${pokemonData.id}`} className="nav-link">
      <Card >
        <p style={{alignSelf:'flex-start',marginLeft:'5%'}}> {`#${pokemonData.id}`}</p>
        <StyledImg src={pokemonData.image} alt="pokemon" id="card"></StyledImg>
        <Title>{pokemonData.name}</Title>
      </Card>
    </StyledLink>
  );
}

const Card = styled.div`
  display: flex;
  background-color: #f7f7f9;
  flex-direction: column;
  border: 2px solid #e7e7e7;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  color: #020166;
  font-size: 2rem;
  
  &:hover {
    cursor: pointer;
    background-color: #fccbfc8e;
  }
`;

const StyledImg = styled.img`
  /* width: 150px; */
  width:65%;
`;

const StyledLink = styled(Link)`
text-decoration: none;
`;

const Title = styled.p`
  color: 
#020166;
`;