import logo from './logo.svg';
import './App.css';
// import JitsiConference from './Jitsi/VideoConference';
import { TracksProvider } from './jitsi2/JitsiContext';
import JitsiConference from './jitsi2/VideoConferencePage';
import { AlertPage } from './jitsi2/AlertPage';

function App() {
  return (
    <div className="App">
      <TracksProvider>
      <JitsiConference/>
      <AlertPage/>
      </TracksProvider>
      {/* <JitsiConference/> */}
 
   
    </div>
  );
}

export default App;
