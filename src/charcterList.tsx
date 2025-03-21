import React from 'react';
import { Link } from 'react-router-dom';
import { Character } from './models/charachterTypes';

interface CharacterListProps {
  characters: Character[] | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, loading, error, onRefresh }) => {
  return (
    <div>
      <button onClick={onRefresh} disabled={loading} className="btn-refresh">
        Refresh Data
      </button>

      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}

      {characters && !loading && !error && (
        <ul>
          {characters.map((character, index) => (
            <li key={index} className="character-item">
              <Link to={`/character/${index}`}> {/* Use numeric index here */}
                <h3>{character.name}</h3>
              </Link>
              <p>Birth Year: {character.birth_year}</p>
              <p>Species: {character.species.length ? character.species.join(', ') : 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CharacterList;
