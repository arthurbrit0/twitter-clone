import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";

// componente do painel direito com usuarios sugeridos

const PainelDireito = () => {
	const isLoading = false;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Usuários sugeridos</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && ( // caso esteja carregando, vai carregar componentes de carregamento do painel direito
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading && // caso não esteja carregando, vai mapear cada usuario do banco de dados na seguinte funcao
						USERS_FOR_RIGHT_PANEL?.map((user) => (
							<Link
								to={`/perfil/${user.nome_usuario}`} // criar um link para os perfis do usuario
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.imagem_perfil || "/avatar-placeholder.png"} /> 
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.nome_completo}
										</span>
										<span className='text-sm text-slate-500'>@{user.usuario}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => e.preventDefault()}
									>
										Seguir
									</button>
								</div>
							</Link> // no final, teremos cards com o avatar, usuario e nome, sendo tudo clicavel e redirecionavel para o perfil do user
						))}
				</div>
			</div>
		</div>
	);
};
export default PainelDireito;