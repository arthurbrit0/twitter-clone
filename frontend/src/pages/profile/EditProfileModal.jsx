import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAtualizarPerfil from "../../hooks/useAtualizarPerfil";

const EditProfileModal = ({authUser}) => {
	const [formData, setFormData] = useState({
		nome_completo: "",
		nome_usuario: "",
		email: "",
		bio: "",
		link: "",
		nova_senha: "",
		senha: "",
	});

	const queryClient = useQueryClient();

	// transformar em custom hook

	const {atualizarPerfil, isAtualizandoPerfil } = useAtualizarPerfil()

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if(authUser) {
			setFormData({
				nome_completo: authUser.nome_completo,
				nome_usuario: authUser.nome_usuario,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				senha: "",
				nova_senha: ""
			})
		}
	},[authUser])

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Editar Perfil
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Atualizar Perfil</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							atualizarPerfil(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Nome Completo'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.nome_completo}
								name='nome_completo'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Usuario'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.nome_usuario}
								name='nome_usuario'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Senha Atual'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.senha}
								name='senha'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='Nova Senha'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.nova_senha}
								name='nova_senha'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isAtualizandoPerfil ? "Atualizando" : "Atualizar"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>fechar</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;