import { Routes, Route } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import CadastroPage from './pages/auth/cadastro/CadastroPage';
import Sidebar from "./components/common/Sidebar";
import PainelDireito from "./components/common/PainelDireito";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
        <Routes>
          <Route path='/' element={<HomePage />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/cadastro' element={<CadastroPage />}/>
          <Route path='/notificacoes' element={<NotificationPage />}/>
          <Route path='/perfil/:usuario' element={<ProfilePage />}/>
        </Routes>
      <PainelDireito />
    </div>
  )
}

export default App
