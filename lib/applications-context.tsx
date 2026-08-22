"use client"

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import {
    getApplications,
    createApplication,
    updateApplicationStatus,
    deleteApplication as deleteApplicationAction
} from "@/lib/actions/job-application.actions"
import { Status } from "@/types/types"

export type Application = {
    id: string
    company: string
    role: string
    location: string
    status: Status
    date: string
    type: string
    color: string
    notes: string
}

type ApplicationsContextType = {
    applications: Application[]
    loading: boolean
    moveApplication: (id: string, status: Status, interviewDate?: Date) => void
    selected: Application | null
    setSelected: React.Dispatch<React.SetStateAction<Application | null>>
    newOpen: boolean
    setNewOpen: React.Dispatch<React.SetStateAction<boolean>>
    newUrl: string
    setNewUrl: React.Dispatch<React.SetStateAction<string>>
    newCompany: string
    setNewCompany: React.Dispatch<React.SetStateAction<string>>
    newRole: string
    setNewRole: React.Dispatch<React.SetStateAction<string>>
    addApplication: () => void
    dark: boolean
    setDark: React.Dispatch<React.SetStateAction<boolean>>
    deleteApplication: (id: string) => Promise<void>
}

function toApplication(doc: any): Application {
    return {
        id: doc._id,
        company: doc.company,
        role: doc.role,
        location: doc.location ?? "Location not set",
        status: doc.status,
        date: formatStatusDate(doc.statusDate, doc.status),
        type: doc.type ?? "Full-time",
        color: doc.color ?? doc.company.slice(0, 2).toUpperCase(),
        notes: doc.notes ?? "",
    }
}

function formatStatusDate(date: string | Date, status: Status): string {
    const d = new Date(date)
    const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    switch (status) {
        case "Wishlist": return `Added ${formatted}`
        case "Applied": return `Applied ${formatted}`
        case "Interview": return `Next: ${formatted}`
        case "Offer": return `Received ${formatted}`
        case "Rejected": return `Closed ${formatted}`
        default: return formatted
    }
}

const ApplicationsContext = React.createContext<ApplicationsContextType | null>(null)

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
    const { userId, isLoaded } = useAuth()

    const [applications, setApplications] = React.useState<Application[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selected, setSelected] = React.useState<Application | null>(null)
    const [newOpen, setNewOpen] = React.useState(false)
    const [newCompany, setNewCompany] = React.useState("")
    const [newUrl, setNewUrl] = React.useState("")
    const [newRole, setNewRole] = React.useState("")
    const [dark, setDark] = React.useState(true)

    React.useEffect(() => {
        if (!isLoaded) return

        if (!userId) {
            setLoading(false)
            return
        }
        const fetchApplications = async () => {
            setLoading(true)
            try {
                const result = await getApplications(userId)
                console.log("fetch result:", result)
                if (result.success) {
                    setApplications(result.data.map(toApplication))
                }
            } catch (e) {
                console.error("Failed to fetch applications", e)
            } finally {
                setLoading(false)
            }
        }

        fetchApplications()
    }, [isLoaded, userId])

    React.useEffect(() => {
        document.documentElement.classList.toggle("dark", dark)
        document.documentElement.classList.toggle("light", !dark)
    }, [dark])

    const moveApplication = async (id: string, status: Status, interviewDate?: Date) => {
        setApplications((current) =>
            current.map((item) => (item.id === id ? { ...item, status } : item))
        )
        await updateApplicationStatus(id, status, interviewDate)
    }

    const addApplication = async () => {
        if (!newCompany.trim() || !newRole.trim() || !userId) return

        const result = await createApplication({
            clerkId: userId,
            company: newCompany.trim(),
            role: newRole.trim(),
            url: newUrl.trim()
        })

        if (result.success) {
            setApplications((current) => [toApplication(result.data), ...current])
        }

        setNewCompany("")
        setNewRole("")
        setNewUrl("")
        setNewOpen(false)
    }

    const deleteApplication = async (id: string) => {
        setApplications((current) => current.filter((item) => item.id !== id)) // optimistic
        await deleteApplicationAction(id)
    }
    return (
        <ApplicationsContext.Provider
            value={{
                applications, loading, moveApplication,
                selected, setSelected,
                newOpen, setNewOpen,
                newCompany, setNewCompany,
                newRole, setNewRole,
                addApplication,
                dark, setDark,
                deleteApplication
            }}
        >
            {children}
        </ApplicationsContext.Provider>
    )
}

export function useApplications() {
    const ctx = React.useContext(ApplicationsContext)
    if (!ctx) throw new Error("useApplications must be used within ApplicationsProvider")
    return ctx
}