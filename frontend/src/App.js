import { BrowserRouter,Route,Routes } from 'react-router-dom';
import './App.css';
import User from './components/pages/user/User';
import UserList from './components/pages/userList/UserList';
import Sidebar from './components/sidebar/Sidebar';
import Topbar from './components/topbar/Topbar';

function App() {
  return (
    
      <BrowserRouter>
      <Topbar/>
       <div className="container">
      <Sidebar />
      <Routes>
      <Route path="/user/:userId" element={<User />} />
      <Route path="/users" element={<UserList />} />
      </Routes>
      </div>
      </BrowserRouter>

     
    
  );
}

export default App;
