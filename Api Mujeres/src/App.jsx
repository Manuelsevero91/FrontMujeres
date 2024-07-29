import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from './components/inicio';
import Login from './components/login';
import DataList from './components/dataList';
import { UserProvider } from "./components/userContext";
import './styles/inicio.css';
import './styles/dataList.css';
import './styles/barraSuperior.css';
import './styles/login.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dataList" element={<DataList />} />

        </Routes>
      </Router>
    </UserProvider>
  );
}
export default App;