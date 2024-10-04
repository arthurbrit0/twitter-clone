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

  const { data:authUser, isLoading } = useQuery({ // usando o useQuery para fazer uma query no banco de dados para buscar o usuario logado (authUser)
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

  if(isLoading) { // se o usuario ainda estiver sendo buscado no banco, carregaremos um spinner de loading
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    )
  }

  return (
    <div className="flex max-w-6xl mx-auto"> {/* Definindo as rotas da aplicação */}
      {authUser && <Sidebar />} {/* renderizacao condicional: so carregamos a sidebar, que é um componente comum, se o usuario estiver logado */}
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login'/> }/> {/* Protegemos todas as rotas com o authUser. se ele estiver logado, ou seja, se a funcao */}
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />}/> {/* de fetch retornar um usuario, ele podera acessar as rotas da aplicacoa */}
          <Route path='/cadastro' element={!authUser ? <CadastroPage /> : <Navigate to='/' />}/> {/* Se o usuario não estiver logado, e tentar acecssar a home, ele é direcionado para a pag de login */}
          <Route path='/notificacoes' element={authUser ? <NotificationPage />: <Navigate to='/login'/> } /> {/* Se o usuário já estiver logado e tentar acessar o login ou o cadastro, ele é direcionado para ahome */}
          <Route path='/perfil/:nomeDoUsuario' element={authUser ? <ProfilePage /> : <Navigate to='/login'/> }/>
        </Routes>
      {authUser && <PainelDireito />}
      <Toaster />
    </div>
  )
}

export default App
