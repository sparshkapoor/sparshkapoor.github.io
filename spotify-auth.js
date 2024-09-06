const clientId = 'ee27bf7f183b4d2da4ca6f842ebc42fc'; // Replace with your Spotify client ID
const clientSecret = '98ee6ca452344a3f910516c4703366c6'; // Replace with your Spotify client secret
const playlistId = '30R4uq61cKRXsRDiC0SIlz'; // Replace with your Spotify playlist ID

async function getAccessToken() {
    const authString = `${clientId}:${clientSecret}`;
    const encodedAuth = btoa(authString);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${encodedAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    console.log('Access Token:', data.access_token);  // Log token to verify
    return data.access_token;
}

async function getPlaylistTracks() {
    const accessToken = await getAccessToken();
    console.log('Using Access Token:', accessToken);  // Log token being used

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    console.log('Playlist Data:', data);  // Log playlist data to ensure it's fetched correctly
    return data.items.map(item => item.track.album.images[0].url);
}

console.log("spotify-auth.js loaded");
