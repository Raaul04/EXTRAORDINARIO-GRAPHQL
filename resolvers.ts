import { GraphQLError } from "graphql";
import { Character } from "./types.ts";

let personajes: Character[] | null; //Creamos el array personajes

const getAllCharacters = async (): Promise<Character[] | null> => { //Conseguimos una funcion auxiliar parar obtener todo los characteres
  const url = `https://hp-api.onrender.com/api/characters`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new GraphQLError("La respuesta no esta bien");
  }
  const data = await response.json();
  personajes = data.map((p: any)=> ({
    id: p.id.toString(),
    name: p.name,
    alternate_names: p.alternate_names,
    species: p.species,
    gender: p.gender,
    house: p.house || null,
  }));

  return personajes;
};

export const resolvers = {
  Query: {
    getCharacter: async (
      _: unknown,
      args: { id: string },
    ): Promise<Character | null> => {
      const { id } = args;

      if (!id) {
        throw new GraphQLError("No existe ese id");
      }
      const url = `https://hp-api.onrender.com/api/character/${id.toString()}`;

      const response = await fetch(url);

      const data = await response.json();

      return data;
    },

    getCharacters: async (
      _: unknown,
      args: { ids?: string[] },
    ): Promise<Character[]> => {
      const { ids } = args;

      const CharactersSinIds = await getAllCharacters(); //De aqui obtenemos el character sin necesidad de filtrar por id

      if (CharactersSinIds) {
        return CharactersSinIds;
      }

      const urlIds = `https://hp-api.onrender.com/api/characters${ids}`;

      const responseId = await fetch(urlIds);

      if (!responseId.ok) {
        throw new GraphQLError("Error en la respuesta de Ids");
      }

      const Data = await responseId.json();

      return Data;
    },

    Character: {
      id: (parent: Character) => {
        return parent.id.toString();
      },
      house: async (parent: Character) => {
        const AllPersonajes = await getAllCharacters();

        const miembros = AllPersonajes!.filter((p) => p.house === parent.house);

        return {
          name: parent.house,//Aqui el nombre de la casa
          characters: miembros,//Aqui estan los miebros de esa casa
        };
      },
    },

    House: {
      characters: async (parent: { name: string }) => {
        const AllPersonajes = await getAllCharacters();
        return AllPersonajes!.filter((p) => p.name === parent.name);
      },
    },
  },
};
