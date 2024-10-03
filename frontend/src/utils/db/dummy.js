export const POSTS = [
	{
		_id: "1",
		text: "Construindo uma aplicação web com Next.JS 😍",
		imagem: "/posts/post1.png",
		user: {
			usuario: "johndoe",
			imagem_perfil: "/avatars/cara1.png",
			nome_completo: "John Doe",
		},
		comentarios: [
			{
				_id: "1",
				text: "Nice Tutorial",
				user: {
					usuario: "janedoe",
					imagem_perfil: "/avatars/mina1.png",
					nome_completo: "Jane Doe",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
	},
	{
		_id: "2",
		text: "Como vocês estão? 😊",
		user: {
			usuario: "johndoe",
			imagem_perfil: "/avatars/cara2.png",
			nome_completo: "John Doe",
		},
		comentarios: [
			{
				_id: "1",
				text: "Belo tutorial!",
				user: {
					usuario: "janedoe",
					imagem_perfil: "/avatars/mina2.png",
					nome_completo: "Jane Doe",
				},
			},
		],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
	},
	{
		_id: "3",
		text: "Astronauta gerado por IA 🚀",
		img: "/posts/post2.png",
		user: {
			usuario: "johndoe",
			imagem_perfil: "/avatars/cara3.png",
			nome_completo: "John Doe",
		},
		comentarios: [],
		likes: ["6658s891", "6658s892", "6658s893", "6658s894", "6658s895", "6658s896"],
	},
	{
		_id: "4",
		text: "Estou aprendendo Golang! Alguém tem alguma dica? 🤔",
		img: "/posts/post3.png",
		user: {
			usuario: "johndoe",
			imagem_perfil: "/avatars/cara3.png",
			nome_completo: "John Doe",
		},
		comentarios: [
			{
				_id: "1",
				text: "Nice Tutorial",
				user: {
					usuario: "janedoe",
					imagem_perfil: "/avatars/mina3.png",
					nome_completo: "Jane Doe",
				},
			},
		],
		likes: [
			"6658s891",
			"6658s892",
			"6658s893",
			"6658s894",
			"6658s895",
			"6658s896",
			"6658s897",
			"6658s898",
			"6658s899",
		],
	},
];

export const USERS_FOR_RIGHT_PANEL = [
	{
		_id: "1",
		nome_completo: "John Doe",
		usuario: "johndoe",
		imagem_perfil: "/avatars/cara2.png",
	},
	{
		_id: "2",
		nome_completo: "Jane Doe",
		usuario: "janedoe",
		imagem_perfil: "/avatars/mina1.png",
	},
	{
		_id: "3",
		nome_completo: "Bob Doe",
		usuario: "bobdoe",
		imagem_perfil: "/avatars/cara3.png",
	},
	{
		_id: "4",
		nome_completo: "Daisy Doe",
		usuario: "daisydoe",
		imagem_perfil: "/avatars/mina2.png",
	},
];