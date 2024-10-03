import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from 'react-toastify'; 

const CriarPost = () => {
  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null);
  const imagemRef = useRef(null);

  const fetchAuthUser = async () => {
    const res = await fetch('/api/auth/me'); 
    if (!res.ok) {
      throw new Error('Erro ao buscar usuário autenticado');
    }
    return res.json();
  };

  const { data: authUser, isLoading: isAuthLoading, isError: isAuthError, error: authError } = useQuery({
    queryKey: ['authUser'],
    queryFn: fetchAuthUser,
  });

  const queryClient = useQueryClient();

  const { mutate: criarPost, isLoading, isError, error } = useMutation({
    mutationFn: async ({ texto, imagem }) => {
      try {
        const res = await fetch('/api/posts/criar', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ texto, imagem })
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
      setTexto("");
      setImagem(null);
      toast.success("Post criado com sucesso!");
      queryClient.invalidateQueries('posts'); 
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
    criarPost({ texto, imagem });
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
          onChange={(e) => setTexto(e.target.value)}
        />
        {imagem && (
          <div className='relative w-72 mx-auto'>
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
              onClick={() => {
                setImagem(null);
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
              onClick={() => imagemRef.current && imagemRef.current.click()}
            />
            <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
          </div>
          <input accept='image/*' type='file' hidden ref={imagemRef} onChange={handleImgChange} />
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
