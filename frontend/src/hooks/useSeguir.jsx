import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';

const useSeguir = () => {

    const queryClient = useQueryClient();

    const {mutate:seguir, isPending} = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch (`/api/users/seguir/${userId}`, {
                    method: 'POST',
                })
            
                const data = res.json();
                if(!res.ok){
                    throw new Error(data.message || "Algo deu errado")
    
                }
                return data;
            } catch (error) {
                throw new Error(error.message)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({queryKey: ['authUser']}),
                queryClient.invalidateQueries({queryKey: ['usuariosSugeridos']})
            ])
        },
        onError: () => {
            toast.error(error.message)
        }
    })

    return {seguir, isPending}

}

export default useSeguir;