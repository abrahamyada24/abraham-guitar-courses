import { prisma } from "@/lib/prisma"
import { AddLessonDialog } from "@/components/AddLessonDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, X } from "lucide-react"

async function getReport(id: string) {
    return await prisma.report.findUnique({
        where: { id },
        include: {
            student: true,
            entries: { orderBy: { date: 'asc' } }
        },
    })
}

export default async function ReportEditPage({ params }: { params: { id: string } }) {
    const id = params.id
    const report = await getReport(id)

    if (!report) {
        notFound()
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <Link href={`/student/${report.student.id}`}>
                        <Button variant="ghost" size="sm" className="mb-2">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Student
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-blue-900">Edit Report: {report.month} {report.year}</h1>
                    <p className="text-muted-foreground">{report.student.name}</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/public/report/${report.id}`} target="_blank">
                        <Button variant="outline">Preview Public View</Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Lesson Entries</CardTitle>
                    <AddLessonDialog reportId={report.id} />
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Material</TableHead>
                                <TableHead className="text-center">Teacher Sig</TableHead>
                                <TableHead className="text-center">Student Sig</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.entries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No lessons recorded yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                report.entries.map((entry: any) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {entry.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: '2-digit' })}
                                        </TableCell>
                                        <TableCell className="font-medium">{entry.material}</TableCell>
                                        <TableCell className="text-center">
                                            {entry.isTeacherSigned ? <Check className="mx-auto text-green-500 h-4 w-4" /> : <X className="mx-auto text-slate-300 h-4 w-4" />}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {entry.isStudentSigned ? <Check className="mx-auto text-green-500 h-4 w-4" /> : <X className="mx-auto text-slate-300 h-4 w-4" />}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
