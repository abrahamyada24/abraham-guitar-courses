"use client"

import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"

export function ShareButton({ studentName, reportId }: { studentName: string, reportId: string }) {
    const handleShare = () => {
        const text = `Here is the student report for ${studentName}`
        // Use window.location.origin to get the current domain (localhost or vercel)
        const url = `${window.location.origin}/public/report/${reportId}`
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`
        window.open(waUrl, '_blank')
    }

    return (
        <Button size="sm" variant="secondary" onClick={handleShare} className="bg-green-100 text-green-700 hover:bg-green-200 w-full sm:w-auto">
            <Share2 className="h-4 w-4 mr-2" /> WhatsApp
        </Button>
    )
}
