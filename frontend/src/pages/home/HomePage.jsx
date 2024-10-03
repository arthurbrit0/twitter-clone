import { useState } from "react";

import Posts from "../../components/common/Posts";
import CriarPost from "./CriarPost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou"); // estado para filtrar os posts por secao que o usuario clica (seguindo e para voce)

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")} // se o usuario clicar no para você, o feedType muda para forYou
					>
						Para você
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")} // se o usuario clicar no seguindo, o feedType muda para following
					>
						Seguindo
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/*  CRIAR POST */}
				<CriarPost /> {/* Inserindo a caixa de criar post na home page */}

				{/* POSTS */}
				<Posts feedType={feedType}/> {/* criando a secao de posts, passando como prop o tipo de feed selecionado pelo usuario */}
			</div>
		</>
	);
};
export default HomePage;