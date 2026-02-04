import { getStudent } from "@/app/actions"
import { CreateReportDialog } from "@/components/CreateReportDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Share2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ShareButton } from "@/components/ShareButton"

export default async function StudentPage({ params }: { params: { id: string } }) { // Assumes Next.js 14-ish behavior or handled by generic
    const id = params.id
    const student = await getStudent(id)

    if (!student) {
        notFound()
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-900 tracking-tight font-serif" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                            {student.name}
                        </h1>
                        <p className="text-xl text-muted-foreground mt-2">
                            {student.instrument} • {student.grade}
                        </p>
                    </div>
                    <CreateReportDialog studentId={student.id} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {student.reports.length === 0 ? (
                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-lg border border-dashed">
                        <p className="text-muted-foreground">No reports created yet.</p>
                    </div>
                ) : (
                    student.reports.map((report: any) => (
                        <Card key={report.id} className="relative bg-blue-50/50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg font-bold text-blue-800">
                                        Bulan: {report.month}
                                    </CardTitle>
                                    <span className="text-sm font-semibold text-blue-600/80">{report.year}</span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Payment: {report.paymentDate ? report.paymentDate.toLocaleDateString() : 'Not set'}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-blue-200">
                                            <TableHead className="h-8 text-xs font-semibold text-blue-700">Date</TableHead>
                                            <TableHead className="h-8 text-xs font-semibold text-blue-700">Material</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {report.entries.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-xs text-muted-foreground h-24">
                                                    No entries
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            report.entries.map((entry: any) => (
                                                <TableRow key={entry.id} className="border-blue-100">
                                                    <TableCell className="py-2 text-xs">
                                                        {entry.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric' })}
                                                    </TableCell>
                                                    <TableCell className="py-2 text-xs font-medium">{entry.material}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>

                                <div className="mt-4 flex gap-2">
                                    <Link href={`/report/${report.id}/edit`} className="w-full">
                                        <Button variant="outline" size="sm" className="w-full bg-white hover:bg-blue-50">
                                            Edit details
                                        </Button>
                                    </Link>
                                    <ShareButton studentName={student.name} reportId={report.id} />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
