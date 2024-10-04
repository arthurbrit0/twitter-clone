import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, nome_usuario, userId }) => { // Posts recebe feedType como prop, que vem do componente Home

  const getPostEndpoint = () => { // selecionando o post do endpoint para os casos das secoes para voce e seguindo
    switch (feedType) {
      case "forYou":
        return '/api/posts/todos';
      case "following":
        return '/api/posts/seguindo';
      case "posts":
        return `/api/posts/user/${nome_usuario}`;
      case "likes":
        return `/api/posts/likes/${userId}`
      default:
        return '/api/posts/todos';
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts'], // definindo a query posts
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT); // requisitaremos os posts de acordo com a secao que o usuario se encontra (para voce ou seguindo)
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Algo deu errado");
        }

        return data;

      } catch (error) {
        throw new Error(error.message || "Erro");
      }
    }
  });

  useEffect(() => {
    refetch(); // para cada vez que a secao do feed for atualizada, a query sera requisitada novamente
  }, [feedType, refetch, nome_usuario]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className='flex flex-col justify-center'>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {(!isLoading && !isRefetching) && data?.length === 0 && <p className='text-center my-4'>Sem posts por aqui. Até! 👻</p>}
      {!isLoading && !isRefetching && data && (
        <div>
          {data.map((post) => ( // para cada post da secao, enviaremos ao componente Post o post da secao como props, para que ele seja renderizado la
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
