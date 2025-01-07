import { useAuth } from "@/contexts/AuthContext";
import { ICourseProps } from "@/interfaces/Course";
import { IFile } from "@/interfaces/Document";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Brain, FileText, Upload, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface IQuiz {
    id: number;
    title: string;
    description: string;
    dueDate?: string;
    createdAt: string;
}

const CoursePage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState<ICourseProps>();
    const [files, setFiles] = useState<IFile[]>([]);
    const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    useEffect(() => {
        const fetchCourseDetails = async () => {
            const token = localStorage.getItem("ACCESS_TOKEN");
            if (token && id) {
                try {
                    const response = await axios.get(`http://localhost:7001/course/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setCourse(response.data);
                    
                    // Qui dovresti fare una chiamata API per ottenere i file del corso
                    setFiles([
                        {
                            id: 1,
                            filename: "introduzione.pdf",
                            title: "Introduzione al corso",
                            content: "Materiale introduttivo del corso",
                            path: "/files/intro.pdf",
                            userId: 1,
                            courseId: Number(id),
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        }
                    ]);

                    setQuizzes([
                        {
                            id: 1,
                            title: "Quiz di valutazione iniziale",
                            description: "Verifica delle conoscenze preliminari",
                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                            createdAt: new Date().toISOString()
                        },
                        {
                            id: 2,
                            title: "Test intermedio",
                            description: "Verifica di metà corso",
                            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                            createdAt: new Date().toISOString()
                        }
                    ]);
                } catch (err) {
                    console.error("Error fetching course:", err);
                }
            }
        };

        fetchCourseDetails();
    }, [id]);

    const handleDocumentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (token && id) {
            try {
                const fileFormData = new FormData();
                fileFormData.append('title', formData.get('title') as string);
                fileFormData.append('content', formData.get('content') as string);
                fileFormData.append('courseId', id.toString());
                if (selectedFiles[0]) {
                    fileFormData.append('file', selectedFiles[0]);
                }

                const response = await axios.post<IFile>(`http://localhost:7001/file`, {
                    title: formData.get('title'),
                    content: formData.get('content'),
                    courseId: parseInt(id),
                    file: selectedFiles[0]
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setFiles([response.data, ...files]);
                setSelectedFiles([]);
                setIsDialogOpen(false);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    return (
        <div className="space-y-2 p-4">
            {/* Back Button */}
            <Button 
                variant="ghost" 
                className="flex items-center text-cyan-800 hover:text-cyan-900 h-8 px-2"
                onClick={() => navigate('/dashboard')}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>

            {/* Course Info Card */}
            <Card className="border border-cyan-800 bg-cyan-800 rounded-xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-white">
                        {course?.subject}
                    </CardTitle>
                    <CardDescription>
                        <p className="text-white">{course?.coursename}</p>
                        <p className="text-sm text-white">{course?.section}</p>
                    </CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger 
                        value="documents"
                        className="data-[state=active]:bg-cyan-800 data-[state=active]:text-white"
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Documenti
                    </TabsTrigger>
                    <TabsTrigger 
                        value="quizzes"
                        className="data-[state=active]:bg-cyan-800 data-[state=active]:text-white"
                    >
                        <Brain className="mr-2 h-4 w-4" />
                        Quiz
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-cyan-700">Documenti del corso</h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-cyan-800 hover:bg-cyan-900">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Nuovo Documento
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                                <DialogHeader>
                                    <DialogTitle>Carica nuovo documento</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleDocumentSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titolo</Label>
                                        <Input id="title" name="title" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Contenuto</Label>
                                        <Textarea id="content" name="content" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="files">Allegati</Label>
                                        <div className="border-2 border-dashed border-cyan-800 rounded-lg p-4">
                                            <Input
                                                id="files"
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            <label 
                                                htmlFor="files" 
                                                className="flex flex-col items-center justify-center cursor-pointer"
                                            >
                                                <Upload className="h-8 w-8 text-cyan-800 mb-2" />
                                                <span className="text-sm text-cyan-800">
                                                    {selectedFiles.length > 0 
                                                        ? `${selectedFiles.length} file selezionati` 
                                                        : 'Clicca per caricare i file'}
                                                </span>
                                            </label>
                                        </div>
                                        {selectedFiles.length > 0 && (
                                            <div className="mt-2">
                                                <p className="text-sm font-medium mb-2">File selezionati:</p>
                                                <ul className="text-sm space-y-1">
                                                    {selectedFiles.map((file, index) => (
                                                        <li key={index} className="text-cyan-600">
                                                            {file.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <Button type="submit" className="w-full bg-cyan-800 hover:bg-cyan-900">
                                        Pubblica
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-4">
                        {files.map((file) => (
                            <Card key={file.id} className="border border-cyan-800 bg-white rounded-xl">
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-cyan-600" />
                                        <CardTitle className="text-lg text-cyan-700">{file.title}</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Caricato il {new Date(file.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-cyan-600 mb-4">{file.content}</p>
                                    <Button
                                        variant="outline"
                                        className="text-xs"
                                        onClick={() => window.open(file.path, '_blank')}
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        {file.filename}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="quizzes" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-cyan-700">Quiz disponibili</h2>
                    </div>

                    <div className="space-y-4">
                        {quizzes.map((quiz) => (
                            <Card key={quiz.id} className="border border-cyan-800 bg-white rounded-xl">
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <Brain className="h-5 w-5 text-cyan-600" />
                                        <CardTitle className="text-lg text-cyan-700">{quiz.title}</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Creato il {new Date(quiz.createdAt).toLocaleDateString()}
                                        {quiz.dueDate && (
                                            <>
                                                <Separator className="my-2" />
                                                Scadenza: {new Date(quiz.dueDate).toLocaleDateString()}
                                            </>
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-cyan-600 mb-4">{quiz.description}</p>
                                    <Button className="bg-cyan-800 hover:bg-cyan-900">
                                        Inizia Quiz
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CoursePage;