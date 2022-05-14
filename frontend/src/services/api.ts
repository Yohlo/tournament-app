const basicFetch = async (url: string) => {
  const result = await fetch(url);
  if (result.status !== 200) {
    throw new Error(`bad status = ${result.status}`);
  }
  const json = await result.json();
  return json;
};

export const searchSpotifyAsync = async (text: string) => (
  basicFetch(`${process.env.REACT_APP_SERVER_URL}/api/music/?search=${text}`));

export const getSpotifyTrackAsync = async (id: string) => (
  basicFetch(`${process.env.REACT_APP_SERVER_URL}/api/music/track?id=${id}`));
