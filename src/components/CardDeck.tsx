import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import PokeCard from "./PokeCard";
import styled from "styled-components";
import { getRequest } from "../API";
import { IpokeCard } from "../interfaces";
import useSearch from "../useSearch";

export default function CardDeck() {
  const [pokemons, setPokemons] = useState<IpokeCard[]>([]);
  const [search, setSearch] = useState<string>("");
  const [paginationOffset, setPaginationOffset] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  //pagination handlers
  const observer = useRef<any>(null);
  const lastCardElement = useCallback(
    (node: any) => {
      if (loading) return;
      if (paginationOffset >= 950) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });
      if (node && observer) {
        observer.current.observe(node);
      }
    },
    [loading]
  );

  //pagination useEffect
  useEffect(() => {
    fetchPokeData();
  }, [paginationOffset]);

  //fetch data frop pokeApi
  const fetchPokeData = async () => {
    const pokemonObjArr: IpokeCard[] = [];
    const data = await getRequest(
      `https://pokeapi.co/api/v2/pokemon?limit=50&offset=${paginationOffset}`
    );
    await Promise.all(
      data.results.map(async (pokemon: any) => {
        const pokemonData: any = await getRequest(pokemon.url);
        const pokemonObj: IpokeCard = {
          id: pokemonData.id,
          image: pokemonData.sprites.front_default,
          name: pokemonData.name,
        };
        pokemonObjArr.push(pokemonObj);
      })
    );
    setPokemons((prevState: IpokeCard[]): IpokeCard[] => {
      return [...prevState, ...pokemonObjArr].sort((a, b) => a.id - b.id);
    });
    setLoading(false);
  };

  const loadMore = () => {
    setLoading(true);
    setPaginationOffset((prevValue: number): number => {
      return prevValue + 50;
    });
  };

  //search handler
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const { pokemonSearchResult, searchLoading } = useSearch(search);

  return (
    <div
      className="app-container"
      style={{ display: "flex", flexDirection: "column", maxWidth: "100vw" }}
    >
      <div
        className="search-continer"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledSearch
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            searchHandler(e);
          }}
        />
        <StyledButton> search </StyledButton>
      </div>
      <Deck className="card-deck-container">
        {pokemonSearchResult ? ( //there is a found pokemon from search
          <PokeCard
            id={pokemonSearchResult.id}
            image={pokemonSearchResult.image}
            name={pokemonSearchResult.name}
          />
        ) : !search ? (
          pokemons?.map(
            (
              pokemon,
              index //search value is empty
            ) => (
              <PokeCard
                id={pokemon.id}
                image={pokemon.image}
                name={pokemon.name}
                key={pokemon.name + index}
              />
            )
          )
        ) : searchLoading ? ( //user typed on search and waiting for response
          <div>loading...</div>
        ) : (
          <div> no results found</div> //no results found from search
        )}
      </Deck>
      {!pokemonSearchResult && //pagination checks:
        pokemons.length > 49 && //results from first API call arrived //todo change to loading state
        paginationOffset < 950 && //no more pokemon to fetch
        !search && <div ref={lastCardElement}>Loading...</div>}
    </div>
  );
}
const Deck = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-auto-rows: auto;
  grid-gap: 2rem;
  padding: 2% 10% 1% 10%;
`;

const StyledSearch = styled.input`
  width: 20%;
  min-width: 200px;
  background-color: #f7f7f9;
  font-size: 1.5rem;
  padding: 10px;
  border-radius: 15px;
  border: 1px blue solid;
`;

const StyledButton = styled.button`
  margin-left: 5px;
  font-size: 1.5rem;
  border-radius: 15px;
  color: white;
  padding: 10px;
  background-color: #2323a5;
`;
