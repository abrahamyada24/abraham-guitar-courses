import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Check } from "lucide-react"

export const dynamic = 'force-dynamic'

async function getReport(id: string) {
    return await prisma.report.findUnique({
        where: { id },
        include: {
            student: true,
            entries: { orderBy: { date: 'asc' } }
        },
    })
}

export default async function PublicReportPage({ params }: { params: { id: string } }) {
    const report = await getReport(params.id)

    if (!report) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
            <div className="bg-cyan-400 w-full max-w-md rounded-sm shadow-xl overflow-hidden text-slate-900 border-2 border-slate-800 relative">
                {/* Decorative elements to match "cloud" vibe */}
                <div className="absolute top-0 left-0 w-full h-8 bg-cyan-500/20 rounded-b-[50%] transform -translate-y-4"></div>

                {/* Header Section */}
                <div className="text-center pt-8 pb-4 relative z-10">
                    <div className="flex justify-center mb-2">
                        {/* Logo Placeholder */}
                        <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            AY
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold font-serif tracking-wide mb-1" style={{ fontFamily: 'serif' }}>Students</h1>
                    <h2 className="text-4xl font-bold font-serif tracking-wide" style={{ fontFamily: 'serif' }}>Report</h2>
                </div>

                {/* Student Box */}
                <div className="mx-6 mb-6 border-2 border-slate-800 rounded-lg p-3 bg-cyan-300 shadow-[2px_2px_0px_0px_rgba(30,41,59,1)]">
                    <div className="grid grid-cols-[80px_1fr] gap-1 items-center">
                        <span className="text-sm font-semibold">Nama</span>
                        <span className="font-bold text-lg border-b border-dashed border-slate-600">: {report.student.name.toUpperCase()}</span>

                        <span className="text-sm font-semibold">Instrument</span>
                        <span className="font-bold border-b border-dashed border-slate-600">: {report.student.instrument}</span>

                        <span className="text-sm font-semibold">Kelas</span>
                        <span className="font-bold border-b border-dashed border-slate-600">: {report.student.grade}</span>
                    </div>
                </div>

                {/* Month & Payment Info */}
                <div className="px-6 flex justify-between text-xs font-bold mb-1 px-1">
                    <div className="bg-cyan-100 px-2 py-1 rounded border border-slate-800 -rotate-1 mx-4">
                        BULAN: {report.month.toUpperCase()}
                    </div>
                    <div className="bg-cyan-100 px-2 py-1 rounded border border-slate-800 rotate-1 mx-4">
                        PAYMENT: {report.paymentDate ? new Date(report.paymentDate).toLocaleDateString() : '-'}
                    </div>
                </div>

                {/* Grid Table */}
                <div className="mx-2 mb-8 bg-cyan-200 border-2 border-slate-800 rounded overflow-hidden text-xs">
                    <div className="grid grid-cols-[20px_40px_1fr_40px] border-b-2 border-slate-800 bg-cyan-500/50 font-bold text-center">
                        <div className="p-2 border-r border-slate-800">No</div>
                        <div className="p-2 border-r border-slate-800">Tgl</div>
                        <div className="p-2 border-r border-slate-800">Materi</div>
                        <div className="p-2">Sig</div>
                    </div>

                    {/* Rows (Always 4 rows like the card) */}
                    {[0, 1, 2, 3].map((index) => {
                        const entry = report.entries[index]
                        return (
                            <div key={index} className="grid grid-cols-[20px_40px_1fr_40px] border-b border-slate-800 last:border-0 h-12">
                                <div className="p-2 border-r border-slate-800 flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="p-1 border-r border-slate-800 flex items-center justify-center text-[10px] leading-3 text-center break-words">
                                    {entry ? new Date(entry.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric' }) : ''}
                                </div>
                                <div className="p-2 border-r border-slate-800 flex items-center text-left font-serif text-sm">
                                    {entry ? entry.material : ''}
                                </div>
                                <div className="p-1 flex items-center justify-center">
                                    {entry && (entry.isTeacherSigned || entry.isStudentSigned) && (
                                        <div className="text-slate-800 font-cursive italic transform -rotate-12 text-[10px]">
                                            {entry.isTeacherSigned ? 'Signed' : ''}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                <div className="text-center pb-8 text-sm font-bold font-serif">
                    Abraham Yada Guitar Course
                </div>
            </div>
        </div>
    )
}
