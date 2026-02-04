'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createStudent(data: { name: string; instrument: string; grade: string }) {
    const student = await prisma.student.create({
        data: {
            name: data.name,
            instrument: data.instrument,
            grade: data.grade,
        },
    })
    revalidatePath('/')
    return student
}

export async function getStudents() {
    return await prisma.student.findMany({
        orderBy: { updatedAt: 'desc' },
    })
}

export async function getStudent(id: string) {
    return await prisma.student.findUnique({
        where: { id },
        include: {
            reports: {
                include: { entries: { orderBy: { date: 'asc' } } },
                orderBy: { createdAt: 'desc' }
            }
        },
    })
}

export async function createReport(studentId: string, month: string, year: number) {
    // Check if report exists? For now just create
    const report = await prisma.report.create({
        data: {
            studentId,
            month,
            year,
        },
    })
    revalidatePath(`/student/${studentId}`)
    return report
}

export async function addReportEntry(reportId: string, data: { date: Date; material: string }) {
    const entry = await prisma.reportEntry.create({
        data: {
            reportId,
            date: data.date,
            material: data.material,
        },
    })
    revalidatePath('/')
    return entry
}
