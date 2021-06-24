import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { IpokeFullData, PokeType } from "../interfaces";
import { getRequest } from "../API";

const StyledSingleCard = styled.div`
  font-size: 1.3rem;
  display: grid;
  grid-template-columns: 200px auto;
  background-color: #f7f7f9;
  flex-direction: column;
  border: 2px solid #e7e7e7;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  color: #2323a5;
  padding: 5%;
  margin: 5%;
  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const HalfCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #2323a5;
`;

const StyledImg = styled.img`
  width: 20rem;
  &:hover {
    transform: rotate(360deg);
    transition: 0.7s;
  }
`;

const handleColorType = (pokemonType: PokeType) => {
  switch (pokemonType) {
    case "water":
      return "#03a9f3";
    case "fire":
      return "#f56342";
    case "grass":
      return "#289919";
    case "poison":
      return "#7f1999";
    default:
      return "#d3cd7e";
  }
};

const TypeDiv = styled.span<{ type: PokeType }>`
  display: flex;
  padding: 10px;
  margin: 5px;
  color:white;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: yellow;
  background-color: ${({ type }) => handleColorType(type)};
`;

export default function PokeSinglePage() {
  const [pokemonData, setPokemonData] = useState<IpokeFullData | null>();
  const { id: pokemonsId } = useParams<{ id?: string }>();
  
  useEffect(() => {
    fectPokemonData();
  }, []);

  //fetching and arraging relavent data
  const fectPokemonData = async () => {
    const data = await getRequest(
      `https://pokeapi.co/api/v2/pokemon/${pokemonsId}`
    );
    const pokemonObj: IpokeFullData = {
      id: data.id,
      frontImage: data.sprites.front_default,
      backImage: data.sprites.back_default,
      name: data.name,
      types: data.types.map((type:any):PokeType => {
        return type.type.name;
      }),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      },
    };
    setPokemonData(pokemonObj);
  };


  if (pokemonData) {
    return (
      <StyledSingleCard>
        <HalfCard className="main-section">
          <p style={{alignSelf:'flex-start'}}>#{pokemonData.id}</p>
          <StyledImg
            alt="front"
            src={pokemonData.frontImage}
          ></StyledImg>
          <p>{pokemonData.name}</p>
          <div style={{display:'flex'}}>
          {pokemonData.types.map((type: PokeType,index:number) => (
            <TypeDiv key={index} type={type}>{type}</TypeDiv>
            ))}
            </div>
        </HalfCard>
        <HalfCard className="secondery-section">
          <div className="stats">
            <h3>Stats</h3>
              <p key='hp'>HP: {pokemonData.stats.hp}</p>
              <p key='att'>Attack: {pokemonData.stats.attack}</p>
              <p key='def'>Defense: {pokemonData.stats.defense}</p>
              <p key='Satt'>Special Attack: {pokemonData.stats.specialAttack}</p>
              <p key='Sdef'>Special Defense: {pokemonData.stats.specialDefense}</p>
              <p key='spd'>Speed: {pokemonData.stats.speed}</p>  
          </div>
        </HalfCard>
      </StyledSingleCard>
    );
  } else {
    return <div>loading</div>;
  }
}
