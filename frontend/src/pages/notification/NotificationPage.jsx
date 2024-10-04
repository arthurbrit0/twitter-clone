import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';

const NotificationPage = () => {

	const queryClient = useQueryClient();
	
	const { data:notificacoes, isLoading } = useQuery({
		queryKey: ['notificacoes'],
		queryFn: async () => {

			try {
				
				const res = await fetch('/api/notificacoes');
	
				const data = await res.json();
	
				if(!res.ok) {
					throw new Error(data.error || "Algo deu errado")
				}
	
				return data;
				
			} catch (error) {
				throw new Error(error.message)
			}
		}
	})

	const { mutate: deletarNotificacoes } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch('/api/notificacoes', {
					method: 'DELETE',
					credentials: 'include'
				})

				const data = await res.json()

				if(!res.ok) {
					throw new Error(data.error || "Algo deu errado.")
				}
				return data;

			} catch (error) {
				throw new Error(error.message)
			}
		},
		onSuccess: () => {
			toast.success("Notificações deletadas com sucesso!"),
			queryClient.invalidateQueries(['notificacoes'])
		} ,
		onError: (error) => {
			toast.error(error.message)
		}
	})
	

	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notificações</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deletarNotificacoes}>Deletar todas as notificações</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notificacoes?.length === 0 && <div className='text-center p-4 font-bold'>Sem notificações 🤔</div>}
				{notificacoes?.map((notificacao) => (
					<div className='border-b border-gray-700' key={notificacao._id}>
						<div className='flex gap-2 p-4'>
							{notificacao.tipo === "seguir" && <FaUser className='w-7 h-7 text-primary' />}
							{notificacao.tipo === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/perfil/${notificacao.de.nome_usuario}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notificacao.para.imagem_perfil || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notificacao.para.nome_usuario}</span>{" "}
									{notificacao.tipo === "seguir" ? "seguiu você." : "curtiu seu post."}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;