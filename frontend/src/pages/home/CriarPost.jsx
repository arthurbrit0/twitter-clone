import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify'; 

const CriarPost = () => {
  // componente para criar post 
  const [texto, setTexto] = useState(""); // inicializando o texto do post
  const [imagem, setImagem] = useState(null); // inicializando a imagem do post
  const imagemRef = useRef(null); // criando um ref para referenciar o input (que vai estar escondido) para dar upload na imagem

  const fetchAuthUser = async () => {
    const res = await fetch('/api/auth/me'); // funcao que sera usada na query para pegar os dados do usuario logado
    if (!res.ok) {
      throw new Error('Erro ao buscar usuário autenticado');
    }
    return res.json();
  };

  const { data: authUser, isLoading: isAuthLoading, isError: isAuthError, error: authError } = useQuery({
    queryKey: ['authUser'],
    queryFn: fetchAuthUser, // pegando os dados do usuario logado
  });

  const queryClient = useQueryClient(); // criando uma instancia do useQueryClient para manipular o cache

  const { mutate: criarPost, isLoading, isError, error } = useMutation({
    mutationFn: async ({ texto, imagem }) => { // funcao que vai receber o texto e a imagem do post
      try {
        const res = await fetch('/api/posts/criar', { // a funcao criarPost (mutate) fara uma requisicao para criar um post
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ texto, imagem }) // passamos o texto e a imagem do post no corpo da requisicao
        });

        const data = await res.json(); 

        if (!res.ok) {
          throw new Error(data.error || "Algo deu errado");
        }

        return data;

      } catch (error) {
        throw new Error(error.message || "Erro");
      }
    },
    onSuccess: () => {
      setTexto(""); // se o post for postado com sucesso, setaremos o texto e a imagem como vazios
      setImagem(null);
      toast.success("Post criado com sucesso!");
      queryClient.invalidateQueries('posts'); // invalidamos a query para atualizar os posts no componente Posts apos criarmos um post novo
    },
    onError: (error) => {
      console.error('Erro ao criar post:', error);
      toast.error(`Erro ao criar post: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (texto.trim() === "") {
      toast.error("O texto do post não pode estar vazio.");
      return;
    }
    criarPost({ texto, imagem }); // chamando a funcao de criarPost ao clicar no botao para enviar o post, passando o texto e a imagem inseridas
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagem(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isAuthLoading) return <div>Carregando usuário...</div>;
  if (isAuthError) return <div className="text-red-500">Erro: {authError.message}</div>;

  return (
    <div className='flex p-4 items-start gap-4 border-b border-gray-700'>
      <div className='avatar'>
        <div className='w-8 rounded-full'>
          <img src={authUser.imagem_perfil || "/avatar-placeholder.png"} alt="Perfil" />
        </div>
      </div>
      <form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
        <textarea
          className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
          placeholder='O que está acontecendo?'
          value={texto}
          onChange={(e) => setTexto(e.target.value)} // quando o usuario digitar algo, o onChange setara o valor do state texto como o valor do input
        />
        {imagem && ( // se houver uma imagem, renderizaremos a imagem no corpo do texto
          <div className='relative w-72 mx-auto'>
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
              onClick={() => {
                setImagem(null); // x no canto superior direito para tirar a imagem do post
                if (imagemRef.current) {
                  imagemRef.current.value = null;
                }
              }}
            />
            <img src={imagem} className='w-full mx-auto h-72 object-contain rounded' alt="Preview" />
          </div>
        )}

        <div className='flex justify-between border-t py-2 border-t-gray-700'>
          <div className='flex gap-1 items-center'>
            <CiImageOn
              className='fill-primary w-6 h-6 cursor-pointer'
              onClick={() => imagemRef.current && imagemRef.current.click()} // clicamos no input escondido que carrega o arquivo de imagem do usuario
            />
            <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
          </div>
          <input accept='image/*' type='file' hidden ref={imagemRef} onChange={handleImgChange} /> {/* input escondido que tem como funcao carregar as imagens do usuario */}
          <button className='btn btn-primary rounded-full btn-sm text-white px-4' disabled={isLoading}>
            {isLoading ? "Postando..." : "Postar"}
          </button>
        </div>
        {isError && <div className="text-red-500">Algo deu errado: {error.message}</div>}
      </form>
    </div>
  );
};

export default CriarPost;
