import { Character } from '../models/charachterTypes';

const BASE_URL = 'https://swapi.dev/api/people/';

export const fetchCharacters = async (): Promise<Character[]> => {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch characters');
  const data = await response.json();
  return data.results; 
};

const fetchSpeciesName = async (speciesUrl: string): Promise<string> => {
  const response = await fetch(speciesUrl);
  if (!response.ok) throw new Error('Failed to fetch species');
  const data = await response.json();
  return data.name;
};

export const fetchCharacterById = async (id: number): Promise<Character | null> => {
  const response = await fetch(`${BASE_URL}${id + 1}/`); 
  if (!response.ok) {
    return null;
  }
  const character = await response.json();

 //species is an array of urls as one character can have multiple species (hybrid species) so we need to get all the species urls
  const speciesPromises = character.species.map((speciesUrl: string) => fetchSpeciesName(speciesUrl));
// get all species names
  const speciesNames = await Promise.all(speciesPromises);

  return {
    ...character,
    species_names: speciesNames,
  };
};
