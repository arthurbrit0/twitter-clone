import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { toast, Toaster } from 'react-hot-toast';

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";


const CadastroPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		nome_usuario: "",
		nome_completo: "",
		senha: "",
	});
	
	const { mutate:cadastrar, isError, isPending, error} = useMutation({
		mutationFn: async({email, nome_usuario, nome_completo, senha}) => {
			try {
				const res = await fetch("/api/auth/cadastro", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({email, nome_usuario, nome_completo, senha})
				})
	
				const data = await res.json();
				if(!res.ok) throw new Error(data.error || "Falha ao criar a conta");
				console.log(data);
				return data;
	
			} catch (error) {
				console.error(error)
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Usuário registrado com sucesso!")
		},
		onError: (error) => {
			toast.error("Houve um erro no registro do usuário")
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		cadastrar(formData)
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Registre-se</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Usuário'
								name='nome_usuario'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Nome Completo'
								name='nome_completo'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Senha'
							name='senha'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Carregando..." : "Cadastrar"}
					</button>
					{isError && <p className='text-red-500'>Algo deu errado!</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Já tem uma conta?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Login</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default CadastroPage;