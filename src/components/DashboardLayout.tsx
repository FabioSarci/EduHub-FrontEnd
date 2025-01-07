import React, { useEffect } from 'react'
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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUserContext } from '@/contexts/UserContext'
import { IUser } from '@/interfaces/User'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { credential, user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const { handleUserEdit } = useUserContext();

    const [userLayout, setUserLayout] = useState<IUser>({
        id: user?.id ?? 0,
        name: user?.name ?? "",
        surname: user?.surname ?? "",
        birthdate: user?.birthdate ?? "",
        role: user?.role,
    });

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
        defaultValues: {
            id: userLayout?.id ?? 0,
            name: userLayout?.name ?? "",
            surname: userLayout?.surname ?? "",
            birthdate: userLayout?.birthdate ?? "",
            role: userLayout?.role ?? ""
        }
    });
    
    // Update userLayout whenever input fields change
    useEffect(() => {
        if (userLayout) {
            reset({
                id: userLayout.id,
                name: userLayout.name,
                surname: userLayout.surname,
                birthdate: userLayout.birthdate,
                role: userLayout.role
            });
        }
    }, [userLayout, reset]);

    const onSubmit = async (data: any) => {
        try {
            handleUserEdit(data);
            setIsOpen(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <SidebarProvider>
            <div className="blurred-background">
                <div className="flex h-screen">
                    <Sidebar />
                    <main className="flex-1 content">
                        <div className="p-4 ">
                            <div className="w-full border-b p-2 border-b-cyan-800 flex justify-between text-lg gap-10 my-auto mx-auto items-center">
                                <div className="flex items-center">
                                    <SidebarTrigger className="" />
                                    <h1 className="font-bold tracking-tighter text-cyan-700">
                                        EduHub DashBoard
                                    </h1>
                                </div>
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger>
                                        <Avatar className="rounded-full bg-white/70 border border-cyan-800">
                                            <AvatarImage
                                                src="/placeholder.svg?height=32&width=32"
                                                alt="@johndoe"
                                            />
                                            <AvatarFallback className="flex items-center mx-auto">
                                                {`${user?.name.charAt(0)}${user?.name.charAt(1)}`.toUpperCase()}
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
                                                            {`${user?.name.charAt(0)}${user?.name.charAt(1)}`.toUpperCase()}
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
                                                    <Label htmlFor="name" className="text-right">Name</Label>
                                                    <Input
                                                        id="name"
                                                        className="col-span-3"
                                                        {...register("name", { required: "Name is required" })}
                                                    />
                                                    {errors.name && <p className="text-red-500 text-sm col-span-4 text-right">{errors.name.message}</p>}
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="surname" className="text-right">Surname</Label>
                                                    <Input
                                                        id="surname"
                                                        className="col-span-3"
                                                        {...register("surname", { required: "Surname is required" })}
                                                    />
                                                    {errors.surname && <p className="text-red-500 text-sm col-span-4 text-right">{errors.surname.message}</p>}
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="birthdate" className="text-right">Birthdate</Label>
                                                    <Input
                                                        id="birthdate"
                                                        type="date"
                                                        className="col-span-3"
                                                        {...register("birthdate", { required: "Birthdate is required" })}
                                                    />
                                                    {errors.birthdate && <p className="text-red-500 text-sm col-span-4 text-right">{errors.birthdate.message}</p>}
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="role" className="text-right">Role</Label>
                                                    <Input
                                                        id="role"
                                                        className="col-span-3"
                                                        {...register("role", { required: "Role is required" })}
                                                    />
                                                    {errors.role && <p className="text-red-500 text-sm col-span-4 text-right">{errors.role.message}</p>}
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button className="bg-cyan-800 hover:bg-cyan-900 text-white" type="submit">Save changes</Button>
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

