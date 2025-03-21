import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Character } from '../../models/charachterTypes';
import { CircularProgress, Container, Typography, Box, Paper, Button, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './CharacterDetails.css'; 

interface CharacterDetailsProps {
  characters: Character[] | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ characters, loading, error }) => {
  const { id } = useParams();
  const character = characters ? characters[parseInt(id || '0')] : null;
  const theme = useTheme();
  const [speciesNames, setSpeciesNames] = useState<string[]>([]);

  const fetchSpeciesNames = async (speciesUrls: string[]) => {
    const speciesPromises = speciesUrls.map(async (url) => {
      const response = await fetch(url);
      const data = await response.json();
      return data.name;
    });
    const names = await Promise.all(speciesPromises);
    setSpeciesNames(names);
  };

  useEffect(() => {
    if (character && character.species && character.species.length) {
      fetchSpeciesNames(character.species);
    }
  }, [character]);

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
        <Paper className="character-paper" style={{ background: theme.palette.background.paper }}>
          <Box className="character-content">
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
                  {speciesNames.length ? speciesNames.join(', ') : 'N/A'}
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
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default CharacterDetails;