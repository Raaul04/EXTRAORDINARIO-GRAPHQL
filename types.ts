
export type Character = {
  id: string,
  name: string,
  alternate_names: string[],
  species: string,
  gender: string,
  house: House | null,
};
 

export type House = {
  name: string,
  characters: Character[],
};