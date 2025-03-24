import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../../models/charachterTypes';
import { Button, CircularProgress, Container, Card, CardContent, Typography, Box, Pagination, Avatar, TextField, Switch, FormControlLabel } from '@mui/material';
import './CharacterList.css';

interface CharacterListProps {
  characters: Character[] | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, loading, error, onRefresh }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [speciesData, setSpeciesData] = useState<Map<string, string>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Theme state
  const charactersPerPage = 9;

  // Handle page change for pagination
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Filter characters based on search term
  const filteredCharacters = characters?.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination for characters
  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = filteredCharacters?.slice(indexOfFirstCharacter, indexOfLastCharacter);

  // Get character image from RoboHash
  const getCharacterImage = (name: string) => {
    const baseUrl = "https://robohash.org/";
    return `${baseUrl}${name}.png`;
  };

  //get species data for characters
  useEffect(() => {
    if (characters) {
      const speciesUrls = characters.flatMap((character) => character.species);
      const uniqueSpeciesUrls = Array.from(new Set(speciesUrls));

      uniqueSpeciesUrls.forEach(async (url) => {
        try {
          const response = await fetch(url);
          const species = await response.json();
          setSpeciesData((prev) => new Map(prev).set(url, species.name));
        } catch (err) {
          console.error(`Failed to fetch species data for ${url}:`, err);
        }
      });
    }
  }, [characters]);

  // Apply theme (light or dark) to the body
  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-mode' : 'dark-mode';
  }, [theme]);

  const gridWidth = (250 * 3) + (24 * 2);

  // Toggle between light and dark modes
  const toggleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(event.target.checked ? 'dark' : 'light');
  };

  return (
    <Container className="character-list-container">
<Box className="header-row">
  <Box className="search-box">
    <TextField
      label="Search Characters"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      className="search-input"
    />
  </Box>

  {/* Theme switch */}
  <Box className="switch-container">
    <FormControlLabel
      control={<Switch checked={theme === 'dark'} onChange={toggleTheme} />}
      label="Dark Mode"
      className="switch-label"
    />
  </Box>
</Box>


      {/* Loading Spinner */}
      {loading && (
        <Box className="loading-box">
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Typography variant="h6" color="error" className="error-text">
          {error}
        </Typography>
      )}

      {/* Character List */}
      {characters && !loading && !error && currentCharacters && (
        <>
          <Box className="character-grid">
            {currentCharacters.length > 0 ? (
              currentCharacters.map((character, index) => (
                <Card
                  key={index}
                  component={Link}
                  to={`/character/${characters.indexOf(character)}`}
                  className="clickable-card"
                >
                  <CardContent className="card-content">
                    <Box className="avatar-box">
                      <Avatar
                        alt={character.name}
                        src={getCharacterImage(character.name)}
                        className="character-avatar"
                      />
                    </Box>

                    <Typography variant="h6" className="character-name">
                      {character.name}
                    </Typography>
                    <Typography variant="body2" className="character-info">
                      Birth Year: {character.birth_year}
                    </Typography>
                    <Typography variant="body2" className="character-info">
                      Species: {character.species.length
                        ? character.species.map((url) => speciesData.get(url) || 'Loading...').join(', ')
                        : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="primary" className="click-hint">
                      Click to view details
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" className="no-results">
                No characters found matching "{searchTerm}"
              </Typography>
            )}
          </Box>

          {/* Pagination and Refresh */}
          {filteredCharacters && filteredCharacters.length > 0 && (
            <Box className="pagination-refresh-row" style={{ width: gridWidth }}>
              <Box className="pagination-box">
                <Pagination
                  count={Math.ceil((filteredCharacters.length || 1) / charactersPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
              <Box className="refresh-box">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onRefresh}
                  disabled={loading}
                  className="refresh-button"
                >
                  Refresh Data
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CharacterList;