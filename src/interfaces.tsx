export type PokeType =
  | "grass"
  | "normal"
  | "fire"
  | "poison"
  | "water"
  | "bug"
  | "flying";

export interface IpokeCard {
  name: string;
  id: number;
  image: string;
}

export interface IpokeFullData {
  id: number;
  frontImage: string;
  backImage: string;
  name: string;
  types: PokeType[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}
