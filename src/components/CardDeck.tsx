import React from "react";
import { useEffect, useState,useRef,useCallback } from "react";
import PokeCard from "./PokeCard";
import styled from "styled-components";
import { getRequest } from "../API";
import { IpokeCard } from "../interfaces";



export default function CardDeck() {
  const [pokemons, setPokemons] = useState<IpokeCard[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<IpokeCard[]>([]);
  const [search, setSearch] = useState<string>('');
  const [paginationOffset,setPaginationOffset] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const throttleClick = useCallback((fnc,delay) => {throttle(fnc, delay)} ,[]);
  
  
  //pagination handlers
  const observer = useRef<any>(null);
  const lastCardElement = useCallback((node:any)=>{
    if(loading) return;
    if(paginationOffset>=950) return;
    if(observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting){
        console.log('u can see me');
        loadMore();
      }
    })
    if(node&&observer) {
      observer.current.observe(node)
    }
  },[loading])
  
  useEffect(() => {
    fetchPokeData();
  }, [paginationOffset]);
  
  //responsible for the search
  useEffect(() => {
    filterPokemons();
  }, [pokemons]);
  
  
  //fetch data frop pokeApi
  const fetchPokeData = async () => {
    const pokemonObjArr:IpokeCard[]=[] ;
    const data = await getRequest(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${paginationOffset}`);
    await Promise.all(data.results.map(async (pokemon: any) => {
      const pokemonData: any = await getRequest(pokemon.url);
      const pokemonObj: IpokeCard = {
        id: pokemonData.id,
        image: pokemonData.sprites.front_default,
        name: pokemonData.name,
      };
      pokemonObjArr.push(pokemonObj)
    }));
    setPokemons((prevState:IpokeCard[]):IpokeCard[] => {
      return [...prevState,...pokemonObjArr].sort((a, b) => a.id - b.id)
    })
    };
    
    const searchOnApi = async () => {
      if(search===''){
        setFilteredPokemons(pokemons)
        return;
      }
      const pokemonData = await getRequest(`https://pokeapi.co/api/v2/pokemon/${search}`);
      if(typeof pokemonData == 'string'){
        setFilteredPokemons([]);
        return;
      }
      const pokemonObj: IpokeCard = {
        id: pokemonData.id,
        image: pokemonData.sprites.front_default,
        name: pokemonData.name,
      };
      setFilteredPokemons([pokemonObj])
    }
    
    let timeout:any ;
    const throttle = (fnc:()=>void, limit:number) => {
      if (!timeout) {
        fnc();
          timeout = setTimeout(function() {
          timeout = undefined;
        }, limit);
  }
};

  const loadMore = () => {
  setPaginationOffset((prevValue:number):number => {
    return prevValue+50;
  })
}
  //sets a filtered arr of pokemons by search
  const filterPokemons = async () => {
        setFilteredPokemons(
      pokemons.filter((pokemon:IpokeCard):boolean => {
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
  
  return (
    <div className='app-container' style={{display:'flex',flexDirection:'column',maxWidth:'100vw'}}>
      <div className="search-continer" style={{ display: "flex", justifyContent:"center",alignItems:"center" }}>
        <StyledSearch
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            searchHandler(e);
          }}
        />
        <StyledButton onClick={()=>{throttleClick(searchOnApi,500)}}> search </StyledButton>
   
      </div>
      <Deck className="card-deck-container">
       {
       filteredPokemons?.map((pokemon, index) => (
        <PokeCard
         id={pokemon.id}
         image={pokemon.image}
         name={pokemon.name}
         key={pokemon.name + index}
         />
       ))
        }
      </Deck>
      {filteredPokemons.length>49&&paginationOffset<950&&
      <div ref={lastCardElement}>Loading...</div>
      }
      {/* <button  onClick={loadMore} style={{fontSize:"50px",margin:'20px 0 50px 45%'}}> load more</button> */}
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
width:20%;
min-width: 200px;
background-color: #f7f7f9;
font-size:1.5rem;
  padding: 10px;
  border-radius: 15px;
  border: 1px blue solid;
`;

const StyledButton=styled.button`
margin-left: 5px;
font-size: 1.5rem;
border-radius:15px;
color:white;
padding:10px;
background-color:#2323a5`;
