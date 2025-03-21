import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import CharacterList from './components/characterList/characterList'; 
import CharacterDetails from './components/characterDetails/characterDetails'; 
import { Character } from './models/charachterTypes'; 

const App = () => {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://swapi.dev/api/people/');
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();

      // Fetch species names separately
      const charactersWithSpecies = await Promise.all(
        data.results.map(async (character: any) => {
          if (character.species.length > 0) {
            const speciesResponse = await fetch(character.species[0]);
            const speciesData = await speciesResponse.json();
            return { ...character, species_names: [speciesData.name] };
          }
          return { ...character, species_names: ['N/A'] };
        })
      );

      setCharacters(charactersWithSpecies);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <CharacterList
                characters={characters}
                loading={loading}
                error={error}
                onRefresh={fetchCharacters}
              />
            }
          />
          <Route
            path="/character/:id"
            element={
              <CharacterDetails
                characters={characters}
                loading={loading}
                error={error}
                onRefresh={fetchCharacters}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
