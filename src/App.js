import React, { useState, useEffect } from 'react'
import '../../spotify-view/src/css/App.css'
import { SpotifyApiContext } from 'react-spotify-api'
import Cookies from 'js-cookie'

import { SpotifyAuth, Scopes } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'

import spotify_Logo from '../../spotify-view/src/Pictures/Spotify_Logo.png'


import request from 'request'

const App = () => {
  const token = Cookies.get('spotifyAuthToken')

  const [playlistNames, setPlaylistNames] = useState([])
  var playlist_Names = []

  const [playlistNamesAndURL, setPlaylistNamesAndURL] = useState([])
  var playlist_Names_And_URL = []

  const [playlistImages, setPlaylistImages] = useState([])
  var playlist_Images = []

  const [songName, setSongName] = useState("")
  let song_Name 

  const [artistName, setArtistName] = useState("")
  let artist_Name 

  const [tracksInPlaylistsURLs, setTracksInPlaylistsURLs] = useState([]) //API track endpoints for playlists
  var tracks_In_Playlists_URLs = []

  const [allTracks, setAllTracks] = useState([]) // tracks in all of the playlists
  var all_Tracks = []

  var playlist_Lengths = [] // amount of songs in each playlist
  var playlist_Lengths_Added = [] // index of tracks in the all tracks array

  const [realPlaylistsToDisplay, setRealPlaylistsToDisplay] = useState([]) // lists of playlists to display
  var real_Playlists_To_Display = []

  const [realImageToDisplay, setRealImageToDisplay] = useState([]) // playlist images to display 
  var real_Image_To_Display = []

  const [realAlbumCoverToDisplay, setRealAlbumCoverToDisplay] = useState([]) // song album cover to display
  var real_Album_Cover_To_Display = []
    

  // useEffect(() => {
  
  // }, []);

  const handleInput = (event) => {
      song_Name = event.target.value
      setSongName(song_Name)
  }

  const handleArtistInput = (event) => {
    artist_Name = event.target.value
    console.log(artist_Name)
    setArtistName(artist_Name)
  }

  const getPlaylistsByUser = async (token) => {

    //working token  https://api.spotify.com/v1/users/ninarao09/playlists?limit=32
   
    var options = {
      url: "https://api.spotify.com/v1/me/playlists?offset=9&limit=38",
      headers: { 'Authorization': 'Bearer ' + token},
      json: true
    };

    request.get(options, function(error, response, body) {
      console.log(body);
      for(var i=0; i<body.items.length; ++i){
           playlist_Names.push(body.items[i].name)
           playlist_Images.push(body.items[i].images[0].url)
           tracks_In_Playlists_URLs.push(body.items[i].tracks.href)
           playlist_Lengths.push(body.items[i].tracks.total)
           playlist_Names_And_URL.push({
             playlistName: body.items[i].name,
             playlistsURLs: body.items[i].tracks.href,
             imageURL: body.items[i].images[0].url,
           })
      }

    });   
   
   
   
   console.log(playlist_Names)
   
    setTimeout(() => {

    setPlaylistNames(playlist_Names)
    setPlaylistImages(playlist_Images)
    setTracksInPlaylistsURLs(tracks_In_Playlists_URLs)
    setPlaylistNamesAndURL(playlist_Names_And_URL)

    

    //songName can be used here
    //input the song name -> search through all the tracks in every playlist if song exists there the display the playlists
    for(var i=0; i<38; ++i){
      var options = {
        url: tracks_In_Playlists_URLs[i],
        headers: { 'Authorization': 'Bearer ' + token},
        json: true
      };

      let name
      let image
      if(tracks_In_Playlists_URLs[i] === playlist_Names_And_URL[i].playlistsURLs){
          name = playlist_Names_And_URL[i].playlistName
          image = playlist_Names_And_URL[i].imageURL
      }

      request.get(options, function(error, response, body) {
        //console.log(body)
        for(var j=0; j<body.items.length; ++j){
            all_Tracks.push({
              track: body.items[j].track.name,
              playlistName: name,
              image: image,
              albumCover: body.items[j].track.album.images[1],
              artist:  body.items[j].track.artists[0].name
          })
        }
      });
    }
    setAllTracks(all_Tracks)

    //for some reason the all_tracks arrasy is not letting me read the elements
    // jk I have to press twice

    
    setDisplays()
    }, 500);

  }

  const setDisplays = () => {

    console.log(allTracks)
    //I have to press twice for it to work
    
    let index_saved_at = []
    for(var i=0; i<allTracks.length; ++i){
        if(allTracks[i].track === songName && allTracks[i].artist === artistName){
          index_saved_at.push(i)
          real_Playlists_To_Display.push(allTracks[i].playlistName)
          real_Image_To_Display.push(allTracks[i].image)
          real_Album_Cover_To_Display.push(allTracks[i].albumCover)
        }
    }


    real_Album_Cover_To_Display.splice(1, real_Album_Cover_To_Display.length )
    let display = []

    if(real_Album_Cover_To_Display.length !== 0){
      display.push(real_Album_Cover_To_Display[0].url)
      setRealAlbumCoverToDisplay(display)
    }

    console.log(index_saved_at)
    console.log(real_Album_Cover_To_Display)

    setRealPlaylistsToDisplay(real_Playlists_To_Display)
    setRealImageToDisplay(real_Image_To_Display)
    

}
  
  
  
  return (
    <div className='app'>
      {token ? 
      (
        <div>
          <div>
          <SpotifyApiContext.Provider value={token}>
            {/* Your Spotify Code here */}
            <center>
              {/* <p>You are authorized with token: {token}</p> */}
              <br/>
              <div>
                <img src={spotify_Logo} alt="spotify" height='100' width='310' />
                <br/>
              </div>
              <br/>
              <div>
                 {realAlbumCoverToDisplay.map((names) => (
                  <img class="img1" src={names} alt="albumCover" height='175' width='175'/>
                ))}
              </div>
              <br/>
              <input class="input" placeHolder="Song Name" onChange={handleInput} ></input>
              <br/> <br/>
              <input class="input" placeHolder="Artist Name" onChange={handleArtistInput} ></input>
              <br/> <br/>
              <div>
                <button class="button button1" onClick={() => getPlaylistsByUser(token)}>Find Playlists</button>
              </div>
              <br/>
              PLAYLISTS:
              <div>
                 {realPlaylistsToDisplay.map((names, index) => (
                  <p key={index}> {index+1}. {names} </p>
                  
                ))}

                {realImageToDisplay.map((names) => (
                  <img class="img" src={names} alt="spotify" height='200' width='200'/>
                ))}
              </div>
              <br/>

            </center>            
          </SpotifyApiContext.Provider>
          </div>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
          {/* <div class="footer">
           
              <p>STAY CONNECTED</p>
          </div> */}

        </div>
      ) 
      : 
      (
        // Display the login page
        <div>
          <center>
            <h1>Login Page</h1>
            <br/>
            <div>
              <img src={spotify_Logo} alt="spotify" height='100' width='310' />
            </div>
            <SpotifyAuth
              redirectUri='http://localhost:3000/callback'
              clientID='f40c0fc1713d49219c0de5415aa70c8b'
              scopes={['playlist-read-private',  'user-read-email', 'playlist-read-collaborative']} // Scopes.userReadPrivate, 'user-read-email', Scopes.playlistReadPrivate,' playlist-read-private'
            />
          </center>
        </div>
      )}

      



    </div>
  )
}
export default App
