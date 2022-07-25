import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';

function App() {
  return (
    
      <BrowserRouter>
      <Topbar/>
       <div className="container">
      <Sidebar />
      </div>
      </BrowserRouter>

     
    
  );
}

export default App;
