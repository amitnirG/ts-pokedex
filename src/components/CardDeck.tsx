import React from "react";
import { useEffect, useState } from "react";
import PokeCard from "./PokeCard";
import styled from "styled-components";
import { getRequest } from "../API";
import { IpokeFullData } from "../interfaces";

const Deck = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: auto;
  grid-gap: 1.5rem;
  padding: 5%;
`;
const StyledSearch = styled.input`
  margin: 0px auto 0px auto;
  padding: 10px;
`;

export default function CardDeck() {
  const [pokemons, setPokemons] = useState<IpokeFullData[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<IpokeFullData[]>([]);
  const [search, setSearch] = useState<string>('');

  //fetch data frop pokeApi
  const fetchPokeData = async () => {
    const pokemonObjArr:IpokeFullData[] = []
    const data = await getRequest(`https://pokeapi.co/api/v2/pokemon?limit=50`);
    await Promise.all(data.results.map(async (pokemon: any) => {
      const pokemonData: any = await getRequest(pokemon.url);
      const pokemonObj: IpokeFullData = {
        id: pokemonData.id,
        frontImage: pokemonData.sprites.front_default,
        backImage: pokemonData.sprites.back_default,
        name: pokemonData.name,
        types: pokemonData.types,
        stats: {
          hp: pokemonData.stats[0].base_stat,
          attack: pokemonData.stats[1].base_stat,
          defense: pokemonData.stats[2].base_stat,
          specialAttack: pokemonData.stats[3].base_stat,
          specialDefense: pokemonData.stats[4].base_stat,
          speed: pokemonData.stats[5].base_stat,
        },
      };
      pokemonObjArr.push(pokemonObj)
    }));
    setPokemons(pokemonObjArr.sort((a, b) => a.id - b.id))   //araging the pokemons by id order
  };

  //sets a filtered arr of pokemons by search
  const filterPokemons = () => {
    setFilteredPokemons(
      pokemons.filter((pokemon:IpokeFullData):boolean => {
        if (pokemon.name.includes(search) || pokemon.id.toString() === search){
          return true;
        }
          return false;
      })
    );
  };

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchPokeData();
  }, []);
// console.log(filteredPokemons);

  //responsible for the search
  useEffect(() => {
    filterPokemons();
  }, [search, pokemons]);

  return (
    <>
      <div className="search-continer" style={{ display: "flex" }}>
        <StyledSearch
          type="text"
          placeholder="search pokemons"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            searchHandler(e);
          }}
        />
      </div>
      <Deck className="card-deck-container">
        {filteredPokemons?.map((pokemon, index) => (
          <PokeCard
            id={pokemon.id}
            image={pokemon.frontImage}
            name={pokemon.name}
            key={pokemon.name + index}
          />
        ))}
      </Deck>
    </>
  );
}
