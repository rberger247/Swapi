import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Character } from '../../models/charachterTypes';
import { CircularProgress, Container, Typography, Box, Card, CardContent, Button, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './CharacterDetails.css';

interface CharacterDetailsProps {
  fetchCharacterById: (id: number) => Promise<Character | null>;
  loading: boolean;
  error: string | null;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ fetchCharacterById, loading, error }) => {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        const characterData = await fetchCharacterById(parseInt(id)); // Fetch character by ID
        setCharacter(characterData);
      }
    };
    fetchDetails();
  }, [id, fetchCharacterById]);

  const getAvatarUrl = (name: string) => {
    return `https://robohash.org/${encodeURIComponent(name)}?set=set3`;
  };

  return (
    <Container className="character-details-container">
      {loading && (
        <Box className="loading-box">
          <CircularProgress color="primary" size={50} />
        </Box>
      )}

      {error && (
        <Typography variant="h6" color="error" className="error-text">
          {error}
        </Typography>
      )}

      {character && !loading && !error && (
        <Card className="character-card">
          <CardContent className="character-content">
            <Avatar
              src={getAvatarUrl(character.name)}
              alt={character.name}
              className="character-avatar"
            />
            <Typography variant="h3" className="character-name">
              {character.name}
            </Typography>

            <Box className="character-info">
              <Box className="info-item">
                <Typography variant="h6" className="info-title">Birth Year:</Typography>
                <Typography variant="body1">{character.birth_year}</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="h6" className="info-title">Gender:</Typography>
                <Typography variant="body1">{character.gender}</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="h6" className="info-title">Height:</Typography>
                <Typography variant="body1">{character.height} cm</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="h6" className="info-title">Mass:</Typography>
                <Typography variant="body1">{character.mass} kg</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="h6" className="info-title">Hair Color:</Typography>
                <Typography variant="body1">{character.hair_color}</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="h6" className="info-title">Eye Color:</Typography>
                <Typography variant="body1">{character.eye_color}</Typography>
              </Box>
              <Box className="info-item">
                <Typography variant="h6" className="info-title">Species:</Typography>
                <Typography variant="body1">
                  {character.species_names.length ? character.species_names.join(', ') : 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Box className="back-button-box">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => window.history.back()}
                className="back-button"
              >
                Back to List
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default CharacterDetails;
