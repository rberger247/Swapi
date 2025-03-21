import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Character } from "./models/charachterTypes";

interface CharacterDetailsProps {
  characters: Character[] | null;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({ characters }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    if (!id || !characters) return;

    const characterId = parseInt(id);
    const selectedCharacter = characters[characterId];

    if (selectedCharacter) {
      setCharacter(selectedCharacter);
    } else {
      setCharacter(null);
    }
  }, [id, characters]);

  if (character === null) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-red-500">
        Character not found
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg transform transition duration-300 hover:scale-105">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">{character?.name}</h2>
      <ul className="text-gray-700 dark:text-gray-300 space-y-2">
        <li><strong>Height:</strong> {character?.height} cm</li>
        <li><strong>Mass:</strong> {character?.mass} kg</li>
        <li><strong>Hair Color:</strong> {character?.hair_color}</li>
        {/* <li><strong>Skin Color:</strong> {character?.skin_color}</li>
        <li><strong>Eye Color:</strong> {character?.eye_color}</li> */}
        <li><strong>Birth Year:</strong> {character?.birth_year}</li>
        {/* <li><strong>Gender:</strong> {character?.gender}</li> */}
      </ul>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Back
      </button>
    </div>
  </div>
  );
};

export default CharacterDetails;