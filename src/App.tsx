import  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import for v6
import CharacterList from './charcterList';
import CharacterDetails from './CharacterDetails';
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
      setCharacters(data.results); // Store character results in state
    } catch (err: any) {
      setError(err.message); // Handle errors gracefully
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
        <h1>Star Wars Characters</h1>
        <Routes>
          {/* Define routes here */}
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
            element={<CharacterDetails characters={characters} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
