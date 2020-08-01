import React , {Component} from 'react';
import './App.css';
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
        <img />
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
    setTimeout(() => {
      this.setState({serverData: fakeServerData});
    }, 1000);
  }
  render() {
    let playlistToRender =this.state.serverData.user ? this.state.serverData.user.playlists.filter(playlist =>
      playlist.name.toString().toLowerCase().includes
      (this.state.filterString)
      ): []
    return (
      <div className="App">
        {this.state.serverData.user ?
        <div>
          <h1 style={{...defaultStyle, 'font-size': '54px'}}>
            {this.state.serverData.user.name}'s Playlists
          </h1>
          <PlaylistCounter playlists={playlistToRender}/>
          <HoursCounter playlists={playlistToRender}/>
          <Filter onTextChange={text =>
           {this.setState({filterString:text})}}/>
          {playlistToRender.map(playlist =>
            <Playlist playlist ={playlist}/>
          )}
        </div> : <h1 style={defaultStyle}>Loading...</h1>
        }
      </div>
    );
  }
}

export default App;