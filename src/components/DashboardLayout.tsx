import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar } from './ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from './ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import { IUser } from '@/interfaces/User'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { credential, user, getUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (date: string | undefined) => {
        if (!date) return "";
        return new Date(date).toISOString().split('T')[0];
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm<IUser>({
        defaultValues: {
            id: user?.id,
            name: user?.name || "",
            surname: user?.surname || "",
            birthdate: formatDate(user?.birthdate),
            role: user?.role
        }
    });
    
    useEffect(() => {
        if (!isOpen || user) {
            reset({
                id: user?.id,
                name: user?.name || "",
                surname: user?.surname || "",
                birthdate: formatDate(user?.birthdate),
                role: user?.role
            });
        }
    }, [user, reset, isOpen]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            reset();
        }
    };

    const onSubmit = async (data: IUser) => {
        setIsLoading(true);
        const token = localStorage.getItem("ACCESS_TOKEN");
        
        try {
            await axios.put(`http://localhost:7001/user/edit`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            if (token) {
                await getUser(token, false);
            }
            
            toast({
                title: "Profilo aggiornato",
                description: "Le modifiche sono state salvate con successo.",
            });
            
            setIsOpen(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Errore",
                description: "Si è verificato un errore durante l'aggiornamento del profilo.",
            });
            console.error('Error updating user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SidebarProvider>
            <div className="blurred-background min-h-screen">
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 content">
                        <div className="p-4">
                            <div className="w-full border-b p-2 border-b-cyan-800 flex justify-between text-lg gap-10 my-auto mx-auto items-center">
                                <div className="flex items-center">
                                    <SidebarTrigger className="" />
                                    <h1 className="font-bold tracking-tighter text-cyan-700">
                                        EduHub DashBoard
                                    </h1>
                                </div>
                                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                                    <DialogTrigger>
                                        <Avatar className="rounded-full bg-white/70 border border-cyan-800">
                                            <AvatarImage
                                                src="/placeholder.svg?height=32&width=32"
                                                alt="@johndoe"
                                            />
                                            <AvatarFallback className="flex items-center mx-auto">
                                                {`${user?.name.charAt(0)}${user?.surname.charAt(0)}`.toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] bg-white border border-cyan-800 rounded-lg">
                                        <DialogHeader className="border-b border-b-cyan-800 flex flex-col pb-2">
                                            <DialogTitle>
                                                <h1 className="text-xl font-bold">EduHub</h1>
                                            </DialogTitle>
                                            <DialogDescription>
                                                <div className="flex gap-2">
                                                    <Avatar className="rounded-full bg-white/70 border border-cyan-800">
                                                        <AvatarImage
                                                            src="/placeholder.svg?height=32&width=32"
                                                            alt="@johndoe"
                                                        />
                                                        <AvatarFallback className="flex items-center mx-auto">
                                                            {`${user?.name.charAt(0)}${user?.surname.charAt(0)}`.toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h1>{user?.name} {user?.surname}</h1>
                                                        <p>{credential?.email}</p>
                                                    </div>
                                                </div>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">Nome</Label>
                                                    <Input
                                                        id="name"
                                                        className="col-span-3"
                                                        {...register("name", { required: "Il nome è obbligatorio" })}
                                                    />
                                                    {errors.name && <p className="text-red-500 text-sm col-span-4 text-right">{errors.name.message}</p>}
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="surname" className="text-right">Cognome</Label>
                                                    <Input
                                                        id="surname"
                                                        className="col-span-3"
                                                        {...register("surname", { required: "Il cognome è obbligatorio" })}
                                                    />
                                                    {errors.surname && <p className="text-red-500 text-sm col-span-4 text-right">{errors.surname.message}</p>}
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="birthdate" className="text-right">Data di nascita</Label>
                                                    <Input
                                                        id="birthdate"
                                                        type="date"
                                                        className="col-span-3"
                                                        {...register("birthdate", { required: "La data di nascita è obbligatoria" })}
                                                    />
                                                    {errors.birthdate && <p className="text-red-500 text-sm col-span-4 text-right">{errors.birthdate.message}</p>}
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button 
                                                    type="submit" 
                                                    className="bg-cyan-800 hover:bg-cyan-900 text-white"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? "Salvataggio..." : "Salva modifiche"}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

