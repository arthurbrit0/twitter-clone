import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from 'react-hot-toast';

const LoginPage = () => {
	const [formData, setFormData] = useState({ // inicializando os dados do formulario seguindo os campos do backend
		nome_usuario: "",
		senha: "",
	});

	const queryClient = useQueryClient(); // instanciando useQueryClient para manipular o cache

	const {mutate:login, isPending, isError, error} = useMutation({
		mutationFn: async ({nome_usuario, senha}) => { // usando o useMutation para criar uma funcao de logar. ela recebe o nome do usuario e a senha e envia no corpo da requisicao
			try {
				const res = await fetch('/api/auth/login', { // fazendo a requisicao de login
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({nome_usuario, senha}) // passando os dados do formData para a requisicao
				})

				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Algo deu errado");
				} 
				return data;

			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			 queryClient.invalidateQueries({ // invalidando a query para ela ser refeita e atualizar o estado do authUser na pagina Home
				queryKey: ['authUser'],
			 })
		}
	})

	const handleSubmit = (e) => {
		e.preventDefault();
		login(formData); // quando o formulario de login for enviado, ele vai chamar a funcao para logar o usuario
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value }); // mesma coisa do registro: criamos inputs com name igual aos campos do form data, 
	}; 																  // para atualizar o formData de acordo com os valores dos inputs

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}> {/* Quando o formulario for enviado, chamara a funcao de logar */}
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Vamos lá.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='Usuário'
							name='nome_usuario'
							onChange={handleInputChange} // input de usuario
							value={formData.nome_usuario}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Senha'
							name='senha'
							onChange={handleInputChange} // input de senha
							value={formData.senha}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>Login</button>
					{isError && <p className='text-red-500'>Algo deu errado</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>Ainda não tem uma conta?</p>
					<Link to='/cadastro'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Cadastro</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;