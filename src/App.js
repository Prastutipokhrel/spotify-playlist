import React , {Component} from 'react';
import './App.css';
import queryString from 'query-string';

let defaultStyle={
  color: '#fff'
};
let fakeServerData={
    user:{
      name: 'Prastuti',
      playlists:[
        {
          name: 'My Favorites',
          songs:[{name:'The Story',duration:1345},
                {name:'Strawberries and cigarette',duration:1236},
                {name:'Lover',duration:2346}]
        },
        {
          name: 'Discover Weekly',
          songs: [{name:'Fancy you',duration:1234},
                  {name:'How you like that',duration:1256},
                  {name:'More & More',duration:1324}]
        },
        {
          name: "Prafen's favorite ",
          songs:[{name:'Meri Ashiqui',duration:1234},
                {name:'Hamnava',duration:1256},
                {name:'Tum hi ana',duration:1324}]
        }
      ]

    }
};
class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{...defaultStyle, width: "40%", display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle}>
        <img/>
        <input type="text" 
          onChange={event =>
          this.props.onTextChange(event.target.value)}/>
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    let playlist=this.props.playlist
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img src={playlist.imageUrl} style={{width:'100px'}} />
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song =>
           <li>{song.name}</li>
           )} 
          </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
   // let parsed= new URLSearchParams(window.location.search).get('access_token')
    let accessToken=parsed.access_token;

    fetch('https://api.spotify.com/v1/me', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      user: {
        name: data.display_name
      }
    }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(data => this.setState({
      playlists: data.items.map(item => {
        console.log(data.items)
        return {
          name: item.name,
          imageUrl: item.images[0].url, 
          songs: []
        }
    })
    }))
  }

 
  render(){
  let playlistToRender = 
  this.state.user && 
  this.state.playlists 
    ? this.state.playlists.filter(playlist => 
      playlist.name.toLowerCase().includes(
        this.state.filterString.toLowerCase())) 
    : []
  return (
      <div className="App">
        {this.state.user ?
        <div>
          <h1 style={{...defaultStyle, 'font-size': '54px'}}>
            {this.state.user.name}'s Playlists
          </h1>
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          <Filter onTextChange={text => {
              this.setState({filterString: text})
            }}/>
          {playlistToRender.map(playlist => 
            <Playlist playlist={playlist} />
          )}
        </div> : <button onClick={() => window.location="http://localhost:8888/login"}
         style={{padding:'20px','font-size':'30px','margin-top':'20px'}}>Sign in with Spotify </button>
        }
      </div>
    );
  }
}

export default App;