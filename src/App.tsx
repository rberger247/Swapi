import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import CharacterList from './components/characterList/characterList'; 
import CharacterDetails from './components/characterDetails/characterDetails'; 
import { Character } from './models/charachterTypes'; 
import { fetchCharacterById, fetchCharacters } from './services/characterService';

const App = () => {
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllCharacters = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCharacters();
      setCharacters(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCharacters();
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
                onRefresh={fetchAllCharacters}
              />
            }
          />
          <Route
            path="/character/:id"
            element={
              <CharacterDetails
                fetchCharacterById={fetchCharacterById} 
                loading={loading}
                error={error}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
