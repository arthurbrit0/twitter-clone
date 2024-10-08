import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Sidebar = () => {

	const queryClient = useQueryClient(); // criando uma instancia do useQueryClient para manipular o cache

	const { mutate:logout, isPending, isError, error } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch('/api/auth/logout', { // fazemos uma requisicao de logout 
					method: "POST",
				})

				const data = await res.json();

				if (res.status === 401) {
					return null;  
				  }

				if(!res.ok) {
					throw new Error(data.error || "Algo deu errado")
				}

			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ // se o logout for realizado com sucesso, invalidamos a query para ela atualizar o estado atual do user, e redireciona-lo para a pag de login
				queryKey: ['authUser'],
			})
		},
		onError: () => {
			toast.error("Logout falhou")
		}
	}) 

	const {data} = useQuery({queryKey: ['authUser']}) // pegando os dados do usuario logado

	return (
		// sidebar esta dividida em botao para a home, para a pagina de notificacoes e perfil do usuario logado 
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start'>
					<XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
				</Link>
				<ul className='flex flex-col gap-3 mt-4'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
							<span className='text-lg hidden md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notificacoes'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Notificações</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/perfil/${data?.nome_usuario}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
							<span className='text-lg hidden md:block'>Perfil</span>
						</Link>
					</li>
				</ul>
				{data && (
					<Link
						to={`/perfil/${data.nome_usuario}`}
						className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-8 rounded-full'>
								<img src={data?.imagem_perfil || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='text-white font-bold text-sm w-20 truncate'>{data?.nome_completo}</p>
								<p className='text-slate-500 text-sm'>@{data?.nome_usuario}</p>
							</div>
							<BiLogOut className='w-5 h-5 cursor-pointer' // botao para dar logout
								onClick={(e)=> {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;