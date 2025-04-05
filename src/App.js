import logo from './logo.svg';
import './App.css';
import { TracksProvider } from './jitsi2/JitsiContext';
import JitsiConference from './jitsi2/VideoConferencePage';

function App() {
  return (
    <div className="App">
      <TracksProvider>
        <JitsiConference />

      </TracksProvider>
     

    </div>
  );
}

export default App;
