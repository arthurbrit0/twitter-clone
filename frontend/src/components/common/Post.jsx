import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import LoadingSpinner from "./LoadingSpinner";

// componente de um unico post

const Post = ({ post }) => { // recebe um post, passado como props do componente Posts, vindo do banco de dados
  const [comentario, setComentario] = useState(""); // inicializamos o comentario do post como vazio

  const fetchAuthUser = async () => {
    const res = await fetch('/api/auth/me'); // funcao que pega as informacoes do usuario que está logado
    if (!res.ok) {
      throw new Error('Erro ao buscar usuário autenticado');
    }
    return res.json(); // retorna as informacoes do usuario logado em formato json
  };

  const { data: authUser, isLoading: isAuthLoading, isError: isAuthError, error: authError } = useQuery({
    queryKey: ['authUser'], // useQuery faz uma query no banco de dados, usando como chave authUser, para referenciar mais facil para futuras queries
    queryFn: fetchAuthUser, // usa a funcao de query fetchAutchUser, ou seja, o useQuery vai fazer uma query de busca e vai recuperar os dados do usuario logado
  });

  const queryClient = useQueryClient(); // criando uma instancia do useQueryClient para manipular o cache

  const { mutate: deletarPost, isLoading: isDeleting, isError, error } = useMutation({
    mutationFn: async () => { // usando o mutate para manipular o banco de dados, no caso, deletar um post
      try {
        const res = await fetch(`/api/posts/deletar/${post._id}`, {
          method: "DELETE" // requisicao de um delete no id do post que foi passado como props (no componente Posts, todos os posts vão ser passados como props)
        });                // ou seja, quando a função deletarPost, retornada pelo useMutation, for chamada (vai ser linkada a um botão), ela vai fazer uma requisição de delete do post que foi passado como props

        const data = await res.json(); // guardando a resposta do servidor em formato json

        if (!res.ok) {
          throw new Error(data.error || "Algo deu errado");
        }

        return data;

      } catch (error) {
        throw new Error(error.message || "Erro");
      }
    },
    onSuccess: () => {
      toast.success("Post deletado com sucesso!"); // no caso de sucesso, exibimos um toast com mensagem de sucesso
      queryClient.invalidateQueries('posts'); // alem disso, para atualizar a pagina dinamicamente, invalidamos a querie com chave posts
    },                                        // isso faz com que, quando o programa tente pegar os dados de posts de novo, ele tenha que fazer uma nova querie, atualizando os dados (ja com o post  deletado)
    onError: (error) => {
      console.error('Erro ao deletar post:', error);
      toast.error(`Erro ao deletar post: ${error.message}`);
    },
  });

  const postOwner = post.user; // definindo o dono do post como o usuario que fez o post passado na prop
  const isLiked = false; // isLiked começa como false (default)

  const isMyPost = authUser && authUser._id === post.user._id; // booleano que indica se o usuario logado é o dono do post

  const formattedDate = "1h"; 

  const isCommenting = false;

  const handleDeletarPost = () => {
    deletarPost(); // essa funcao sera linkada ao botao de deletar 
  };

  const handlePostComment = (e) => {
    e.preventDefault();
  };

  const handleLikePost = () => {
	
  };

  if (isAuthLoading) return <div>Carregando usuário...</div>;
  if (isAuthError) return <div className="text-red-500">Erro: {authError.message}</div>;

  return (
    <>
      <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
        <div className='avatar'>
          <Link to={`/perfil/${postOwner.nome_usuario}`} className='w-8 rounded-full overflow-hidden'>
            <img src={postOwner.imagem_perfil || "/avatar-placeholder.png"} alt="Perfil" />
          </Link>
        </div>
        <div className='flex flex-col flex-1'>
          <div className='flex gap-2 items-center'>
            <Link to={`/perfil/${postOwner.nome_usuario}`} className='font-bold'>
              {postOwner.nome_completo}
            </Link>
            <span className='text-gray-700 flex gap-1 text-sm'>
              <Link to={`/perfil/${postOwner.nome_usuario}`}>@{postOwner.nome_usuario}</Link>
              <span>·</span>
              <span>{formattedDate}</span>
            </span>
            {isMyPost && ( // renderizacao condicional : o icone de deletar so vai aparecer pro usuario logado se o post for dele
              <span className='flex justify-end flex-1'> 
                {!isDeleting && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletarPost} />} 
                {isDeleting && ( // botao que, ao clicar, deletara o post atual
                  <LoadingSpinner size='sm' /> // se estiver deletando, vai carregar uma roda de carregamento
                )}
              </span>
            )}
          </div>
          <div className='flex flex-col gap-3 overflow-hidden'>
            <span>{post.texto}</span>
            {post.imagem && ( // renderizacao condicional: se o post tiver uma imagem, vai carregar a img
              <img
                src={post.imagem}
                className='h-80 object-contain rounded-lg border border-gray-700'
                alt='Post'
              />
            )}
          </div>
          <div className='flex justify-between mt-3'>
            <div className='flex gap-4 items-center w-2/3 justify-between'>
              <div
                className='flex gap-1 items-center cursor-pointer group'
                onClick={() => document.getElementById("comentarios_modal" + post._id).showModal()} // quando o usuario clicar no icone de comentarios, aparecera o modal de coments
              > 
                <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' /> 
                <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                  {post.comentarios.length} {/* mostrando a quantidade de comentarios que o post tem */}
                </span>
              </div>

              <dialog id={`comentarios_modal${post._id}`} className='modal border-none outline-none'> 
                <div className='modal-box rounded border border-gray-600'> 
                  <h3 className='font-bold text-lg mb-4'>COMENTÁRIOS</h3>
                  <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                    {post.comentarios.length === 0 && ( // modal para carregar comentarios: se nao tiver comentarios, aparece um txt
                      <p className='text-sm text-slate-500'>
                        Não há comentários ainda 🤔 Seja o primeiro! 😉
                      </p>
                    )}
                    {post.comentarios.map((comentario) => ( // para cada comentario, mostraremos o usuario que postou, seu avatar, usuario e o texto do comentario
                      <div key={comentario._id} className='flex gap-2 items-start'>
                        <div className='avatar'>
                          <div className='w-8 rounded-full'>
                            <img
                              src={comentario.user.profileImg || "/avatar-placeholder.png"}
                              alt="Perfil Comentário"
                            />
                          </div>
                        </div>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-1'>
                            <span className='font-bold'>{comentario.user.fullName}</span>
                            <span className='text-gray-700 text-sm'>
                              @{comentario.user.username}
                            </span>
                          </div>
                          <div className='text-sm'>{comentario.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className='flex gap-2 items-center mt-4 border-t border-gray-600 pt-2'
                    onSubmit={handlePostComment} // quando o usuario enviar o comentario, o handler handlePostComment tratara o envio do texto
                  >
                    <textarea
                      className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800'
                      placeholder='Adicione um comentário...'
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)} // setando o valor de comentario de acordo com o input do usuario no textarea
                    />
                    <button className='btn btn-primary rounded-full btn-sm text-white px-4'>
                      {isCommenting ? (
                        <span className='loading loading-spinner loading-md'></span>
                      ) : (
                        "Post"
                      )}
                    </button>
                  </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                  <button className='outline-none'>fechar</button>
                </form>
              </dialog>
              <div className='flex gap-1 items-center group cursor-pointer'>
                <BiRepost className='w-6 h-6 text-slate-500 group-hover:text-green-500' />
                <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
              </div>
              <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                {!isLiked && (
                  <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />
                )}
                {isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />}

                <span
                  className={`text-sm text-slate-500 group-hover:text-pink-500 ${
                    isLiked ? "text-pink-500" : ""
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>
            </div>
            <div className='flex w-1/3 justify-end gap-2 items-center'>
              <FaRegBookmark className='w-4 h-4 text-slate-500 cursor-pointer' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
