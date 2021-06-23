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
  padding: 5px;
  margin: 5px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  background-color: yellow;
  background-color: ${({ type }) => handleColorType(type)};
`;

export default function PokeSinglePage() {
  const [pokemonData, setPokemonData] = useState<IpokeFullData | null>();
  const { id: pokemonsId } = useParams<{ id?: string }>();

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

  useEffect(() => {
    fectPokemonData();
  }, []);

  if (pokemonData) {
    return (
      <StyledSingleCard>
        <HalfCard className="main-section">
          <div>#{pokemonData.id}</div>
          <StyledImg
            alt="front"
            src={pokemonData.frontImage}
          ></StyledImg>
          <div>{pokemonData.name}</div>
          {pokemonData.types.map((type: PokeType,index:number) => (
            <TypeDiv key={index} type={type}>{type}</TypeDiv>
          ))}
        </HalfCard>
        <HalfCard className="secondery-section">
          <div className="stats">
            <ul>
              <li key='hp'>HP: {pokemonData.stats.hp}</li>
              <li key='att'>Attack: {pokemonData.stats.attack}</li>
              <li key='def'>Defense: {pokemonData.stats.defense}</li>
              <li key='Satt'>Special Attack: {pokemonData.stats.specialAttack}</li>
              <li key='Sdef'>Special Defense: {pokemonData.stats.specialDefense}</li>
              <li key='spd'>Speed: {pokemonData.stats.speed}</li>
            </ul>
          </div>
        </HalfCard>
      </StyledSingleCard>
    );
  } else {
    return <div>loading</div>;
  }
}
