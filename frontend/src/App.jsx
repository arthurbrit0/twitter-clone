import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/login/LoginPage';
import CadastroPage from './pages/auth/cadastro/CadastroPage';
import Sidebar from "./components/common/Sidebar";
import PainelDireito from "./components/common/PainelDireito";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { toast, Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from './components/common/LoadingSpinner'

function App() {

  const { data:authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (res.status === 401) {
          return null; 
        }

        if(data.error) return null;

        if (!res.ok) {
          throw new Error(data.error || "Algo deu errado")
        }

        console.log("authUser:",data)
        return data;

      } catch (error) {
        throw new Error(error);
      }
    },
    retry:false,
  })

  if(isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    )
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login'/> }/>
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />}/>
          <Route path='/cadastro' element={!authUser ? <CadastroPage /> : <Navigate to='/' />}/>
          <Route path='/notificacoes' element={authUser ? <NotificationPage />: <Navigate to='/login'/> } />
          <Route path='/perfil/:usuario' element={authUser ? <ProfilePage /> : <Navigate to='/login'/> }/>
        </Routes>
      {authUser && <PainelDireito />}
      <Toaster />
    </div>
  )
}

export default App
