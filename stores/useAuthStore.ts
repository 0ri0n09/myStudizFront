import { defineStore } from "pinia";
import { type User, UserRole } from "~/types/user";
import { toast } from "~/components/ui/toast";

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null);
    const authChecked = ref<boolean>(false);
    const isAdmin = ref<boolean>(false);
    const isLoggedIn = computed(() => !!user.value);

    async function logout() {
        await useApiFetch("auth/logout", { method: "POST" });
        user.value = null
        isAdmin.value = false
        authChecked.value = false
        toast({
                title: 'Déconnexion',
                description: 'Déconnexion effectuée',
                variant: 'success',
            },
        );
        navigateTo("/");
    }

    async function fetchUser() {
        try {
            const { data, error } = await useApiFetch("auth/me");
            if (error.value) {
                user.value = null
            } else if (data.value) {
                user.value = data.value as User
                if (user.value.role === UserRole.ADMIN) {
                    isAdmin.value = true
                }
                authChecked.value = true
            }
        } catch (e) {
            authChecked.value = false
            user.value = null
            isAdmin.value = false
        }
    }

    async function login(credentials: User) {
        const { data, error } = await useApiFetch("auth/signin", {
            method: "POST",
            body: credentials,
        });

        const errorData = error.value
        if (errorData) {
            if (errorData.statusCode === 400) {
                toast({
                    title: "Error",
                    description: error.value,
                    variant: 'destructive',
                    },
                );
            }
            return;
        }

        await fetchUser()

        toast({
                title: "Connexion effectuée",
                description: "Bienvenue, " + user.value.username + '.',
                variant: "success",
        })
        navigateTo('/dashboard')
        return data.value as User
    }

    async function register(credentials: User) {
        const { data, error } = await useApiFetch("auth/signup", {
            method: "POST",
            body: credentials,
        });

        const errorData = error.value;
        if (errorData) {
            if (errorData.statusCode === 400) {
                toast({
                        title: "Error",
                        description: error.value,
                        variant: "destructive"
                    },
                );
            }
            return;
        }

        toast({
            title: "Email de confirmation envoyé",
            description: "Vérifier vos emails pour confirmer votre inscription !",
            variant: "success"
        })
        navigateTo('/')
        return data.value as User
    }

    async function editPassword(payload: {
        password_old: string
        password: string
        password_confirmation: string
    }) {
        const { error } = await useApiFetch('auth/password/edit', {
            method: 'POST',
            body: payload,
        })
        if (error.value) {
            toast({
                title: "Ancien mot de passe non valide",
                //description: error.value.message || 'Erreur lors du changement de mot de passe',
                variant: "destructive"
            })
        } else {
            toast({
                title: "Mot de passe changé avec succès",
                description: '',
                variant: "success"
            })
        }
    }

    async function editUser(payload: User) {
        const { error, data } = await useApiFetch('auth/me/edit', {
            method: 'PATCH',
            body: payload,
        })
        if (error.value) {
            toast({
                title: error.value.statusCode,
                description: error.value.message || 'Erreur lors du changement des informations du profil',
                variant: "destructive"
            })
        } else {
            toast({
                title: "Profil changé avec succès",
                description: '',
                variant: "success"
            })
        }
        return data.value as User
    }

    return { user, register, login, fetchUser, logout, editPassword, editUser, authChecked, isLoggedIn, isAdmin }
});
