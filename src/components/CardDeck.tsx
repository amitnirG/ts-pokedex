import React from "react";
import { useEffect, useState,useRef,useCallback } from "react";
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
font-size:3rem;
  /* margin: 0px auto 0px auto; */
  padding: 10px;
`;

export default function CardDeck() {
  const [pokemons, setPokemons] = useState<IpokeFullData[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<IpokeFullData[]>([]);
  const [search, setSearch] = useState<string>('');
  const [paginationOffset,setPaginationOffset] = useState<number>(0);
  

  //fetch data frop pokeApi
  const fetchPokeData = async () => {
    const pokemonObjArr:IpokeFullData[]=[] ;
    const data = await getRequest(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${paginationOffset}`);
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
    // setPokemons(pokemonObjArr.sort((a, b) => a.id - b.id))   //araging the pokemons by id order     
    setPokemons((prevState:IpokeFullData[]):IpokeFullData[] => {
      return [...prevState,...pokemonObjArr].sort((a, b) => a.id - b.id)
    })
    // setPokemons((prevState:IpokeFullData[]):IpokeFullData[] => {
      // @ts-ignore
      // return [...prevState,pokemonObjArr];
    // })   //araging the pokemons by id order
  };

  const searchOnApi = async () => {
    if(search===''){
      setFilteredPokemons(pokemons)
      return;
    }
    const pokemonData = await getRequest(
      `https://pokeapi.co/api/v2/pokemon/${search}`
    );
    if(typeof pokemonData == 'string'){
      setFilteredPokemons([]);
      return;
    }
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
    setFilteredPokemons([pokemonObj])
    
  }

const loadMore = () => {
  setPaginationOffset((prevValue:number):number => {
    return prevValue+50;
  })
}
  //sets a filtered arr of pokemons by search
  const filterPokemons = async () => {
        setFilteredPokemons(
      pokemons.filter((pokemon:IpokeFullData):boolean => {
        if (pokemon.name.includes(search) || pokemon.id.toString() === search){
          return true;
        }
          return false;
      })
    );
  };

  //search handler
  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    fetchPokeData();
  }, [paginationOffset]);

  //responsible for the search
  useEffect(() => {
    filterPokemons();
  }, [ pokemons]);

  console.log(filteredPokemons);
  
  return (
    <>
      <div className="search-continer" style={{ display: "flex", justifyContent:"center",alignItems:"center" }}>
        <StyledSearch
          type="text"
          placeholder="search pokemons"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            searchHandler(e);
          }}
        />
        <button onClick={searchOnApi} style={{fontSize:'3rem',marginLeft:'10px',padding:'10px'}}> search on api</button>
   
      </div>
      <Deck className="card-deck-container">
       {(filteredPokemons)?
       filteredPokemons.map((pokemon, index) => (
         <PokeCard
         id={pokemon.id}
         image={pokemon.frontImage}
         name={pokemon.name}
         key={pokemon.name + index}
         />
         ))
         :
         <div>no pokemons found</div>
        }
      </Deck>
      <button onClick={loadMore} style={{fontSize:"50px",margin:'20px 0 50px 45%'}}> load more</button>
    </>
  );
}
