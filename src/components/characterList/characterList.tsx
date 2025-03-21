import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Character } from '../../models/charachterTypes';
import { Button, CircularProgress, Container, Card, CardContent, Typography, Box, Pagination, Avatar } from '@mui/material';
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
  const charactersPerPage = 9;

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = characters?.slice(indexOfFirstCharacter, indexOfLastCharacter);

  const getCharacterImage = (name: string) => {
    const baseUrl = "https://robohash.org/";
    return `${baseUrl}${name}.png`;
  };

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

  const gridWidth = (250 * 3) + (24 * 2);

  return (
    <Container className="character-list-container">
      <Typography variant="h4" className="title">
        Star Wars Characters
      </Typography>

      {loading && (
        <Box className="loading-box">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography variant="h6" color="error" className="error-text">
          {error}
        </Typography>
      )}

      {characters && !loading && !error && currentCharacters && (
        <>
          <Box className="character-grid">
            {currentCharacters.map((character, index) => (
              <Card
                key={index}
                component={Link}
                to={`/character/${index + indexOfFirstCharacter}`}
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
            ))}
          </Box>

          <Box className="pagination-refresh-row" style={{ width: gridWidth }}>
            <Box className="pagination-box">
              <Pagination
                count={Math.ceil((characters.length || 1) / charactersPerPage)}
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
        </>
      )}
    </Container>
  );
};

export default CharacterList;