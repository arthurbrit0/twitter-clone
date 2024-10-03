import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return '/api/posts/todos';
      case "following":
        return '/api/posts/seguindo';
      default:
        return '/api/posts/todos';
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
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
    refetch();
  }, [feedType, refetch]);

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
          {data.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;
