import fetchMock from 'jest-fetch-mock';
import { fetchCharacters } from '../services/characterService';

fetchMock.enableMocks();

describe('characterService', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should fetch characters successfully', async () => {
    const mockData = { results: [{ name: 'Luke Skywalker', birth_year: '19BBY', species: [] }] };
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const characters = await fetchCharacters();
    expect(characters).toEqual(mockData.results);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Failed to fetch characters'));

    await expect(fetchCharacters()).rejects.toThrow('Failed to fetch characters');
  });
});
