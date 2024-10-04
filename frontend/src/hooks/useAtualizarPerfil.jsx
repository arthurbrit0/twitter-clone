import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAtualizarPerfil = () => {

    const queryClient = useQueryClient();

    const {mutateAsync:atualizarPerfil, isPending: isAtualizandoPerfil} = useMutation({
		mutationFn: async (formData) => {
			try {
				const res = await fetch('/api/users/atualizar', {
					method: "POST",
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData),
				})
				const data = await res.json();
				if(!res.ok) {
					throw new Error(data.error || "Algo deu errado")
				}
			} catch (error) {
				throw new Error(error.message)
			}
		},
		onSuccess: () => {
			toast.success("Perfil atualizado com sucesso!");
			Promise.all([
				queryClient.invalidateQueries(['authUser']),
				queryClient.invalidateQueries(['perfilUsuario'])
			])
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})

    return {atualizarPerfil, isAtualizandoPerfil}
}

export default useAtualizarPerfil;