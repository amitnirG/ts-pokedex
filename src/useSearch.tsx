import { IpokeCard } from "./interfaces";
import { getRequest } from "./API";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounceSearch";

// export default  useSearch;
interface returnValues {
  pokemonSearchResult: IpokeCard | undefined;
  searchLoading: boolean;
}

export default function useSearch(search: string): returnValues {
  const [pokemonSearchResult, setPokemonSearchResult] = useState<IpokeCard>();
  const [searchLoading, setSearchLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearchLoading(true);
    setPokemonSearchResult(undefined);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      searchOnApi();
      setSearchLoading(false);
    } else {
      setPokemonSearchResult(undefined);
      setSearchLoading(false);
      return;
    }
  }, [debouncedSearch]);

  const searchOnApi = async () => {
    setSearchLoading(true);
    const pokemonData = await getRequest(
      `https://pokeapi.co/api/v2/pokemon/${debouncedSearch}`
    );
    if (typeof pokemonData == "string") {
      setPokemonSearchResult(undefined);

      return;
    }
    const pokemonObj: IpokeCard = {
      id: pokemonData.id,
      image: pokemonData.sprites.front_default,
      name: pokemonData.name,
    };
    setPokemonSearchResult(pokemonObj);
  };

  return { pokemonSearchResult, searchLoading };
}
