import { useAuth } from "@/contexts/AuthContext";
import { ICourseProps } from "@/interfaces/Course";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Brain, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface IDocument {
    id: number;
    title: string;
    content: string;
    createdAt: string;
}

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
    const [documents, setDocuments] = useState<IDocument[]>([]);
    const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("documents");

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
                    
                    // Dati di esempio
                    setDocuments([
                        {
                            id: 1,
                            title: "Introduzione al corso",
                            content: "Materiale introduttivo del corso",
                            createdAt: new Date().toISOString()
                        },
                        {
                            id: 2,
                            title: "Lezione 1 - Slides",
                            content: "Slides della prima lezione",
                            createdAt: new Date().toISOString()
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
        const newDocument = {
            id: documents.length + 1,
            title: formData.get('title') as string,
            content: formData.get('content') as string,
            createdAt: new Date().toISOString()
        };

        setDocuments([newDocument, ...documents]);
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-4 p-4">
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
                                    <Button type="submit" className="w-full bg-cyan-800 hover:bg-cyan-900">
                                        Carica
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="space-y-4">
                        {documents.map((doc) => (
                            <Card key={doc.id} className="border border-cyan-800 bg-white rounded-xl">
                                <CardHeader>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-cyan-600" />
                                        <CardTitle className="text-lg text-cyan-700">{doc.title}</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Caricato il {new Date(doc.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-cyan-600">{doc.content}</p>
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