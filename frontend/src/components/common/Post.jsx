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

const Post = ({ post }) => {
  const [comentario, setComentario] = useState("");

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

  const { mutate: deletarPost, isLoading: isDeleting, isError, error } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/deletar/${post._id}`, {
          method: "DELETE"
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
      toast.success("Post deletado com sucesso!");
      queryClient.invalidateQueries('posts');
    },
    onError: (error) => {
      console.error('Erro ao deletar post:', error);
      toast.error(`Erro ao deletar post: ${error.message}`);
    },
  });

  const postOwner = post.user;
  const isLiked = false; 

  const isMyPost = authUser && authUser._id === post.user._id;

  const formattedDate = "1h"; 

  const isCommenting = false;

  const handleDeletarPost = () => {
    deletarPost();
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
            {isMyPost && (
              <span className='flex justify-end flex-1'>
                {!isDeleting && <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletarPost} />}
                {isDeleting && (
                  <LoadingSpinner size='sm' />
                )}
              </span>
            )}
          </div>
          <div className='flex flex-col gap-3 overflow-hidden'>
            <span>{post.texto}</span>
            {post.imagem && (
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
                onClick={() => document.getElementById("comentarios_modal" + post._id).showModal()}
              >
                <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
                <span className='text-sm text-slate-500 group-hover:text-sky-400'>
                  {post.comentarios.length}
                </span>
              </div>

              <dialog id={`comentarios_modal${post._id}`} className='modal border-none outline-none'>
                <div className='modal-box rounded border border-gray-600'>
                  <h3 className='font-bold text-lg mb-4'>COMENTÁRIOS</h3>
                  <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                    {post.comentarios.length === 0 && (
                      <p className='text-sm text-slate-500'>
                        Não há comentários ainda 🤔 Seja o primeiro! 😉
                      </p>
                    )}
                    {post.comentarios.map((comentario) => (
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
                    onSubmit={handlePostComment}
                  >
                    <textarea
                      className='textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800'
                      placeholder='Adicione um comentário...'
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
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
