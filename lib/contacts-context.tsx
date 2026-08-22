"use client"

import * as React from "react"
import { useAuth } from "@clerk/nextjs"
import {
    getContacts,
    createContact,
    logInteraction as logInteractionAction,
    updateContactNotes as updateContactNotesAction,
    deleteContact as deleteContactAction,
} from "@/lib/actions/contact.action"

export type ContactEvent = {
    title: string
    date: string
    detail: string
}

export type Contact = {
    id: string
    name: string
    role: string
    company: string
    email: string
    linkedIn: string
    lastContacted: string
    initials: string
    tone: string
    notes: string
    applicationId?: string
    events: ContactEvent[]
}

const TONES = [
    "bg-blue-500/15 text-blue-300",
    "bg-violet-500/15 text-violet-300",
    "bg-emerald-500/15 text-emerald-300",
    "bg-amber-500/15 text-amber-300",
    "bg-pink-500/15 text-pink-300",
    "bg-cyan-500/15 text-cyan-300",
]

function toContact(doc: any): Contact {
    const initials = doc.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()

    const events: ContactEvent[] = (doc.interactions ?? [])
        .slice()
        .reverse() // newest first
        .map((i: any) => ({
            title: "Interaction logged",
            date: new Date(i.date).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
            }),
            detail: i.note,
        }))

    return {
        id: doc._id,
        name: doc.name,
        role: doc.role ?? "",
        company: doc.company ?? "",
        email: doc.email ?? "",
        linkedIn: doc.linkedinUrl ?? "",
        lastContacted: formatRelativeDate(doc.lastContactedAt),
        initials,
        tone: TONES[Math.abs(hashCode(doc._id)) % TONES.length],
        notes: doc.notes ?? "",
        applicationId: doc.applicationId,
        events,
    }
}

function hashCode(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
    }
    return hash
}

function formatRelativeDate(date: string | Date) {
    const d = new Date(date)
    const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return "Today"
    if (days === 1) return "1 day ago"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`
}

type ContactsContextType = {
    contacts: Contact[]
    loading: boolean
    addContact: (data: {
        name: string
        role?: string
        company?: string
        email?: string
        linkedinUrl?: string
        applicationId?: string
        notes?: string
    }) => Promise<void>
    logInteraction: (contactId: string, note: string) => Promise<void>
    updateContactNotes: (contactId: string, notes: string) => Promise<void>
    deleteContact: (id: string) => Promise<void>
}

const ContactsContext = React.createContext<ContactsContextType | null>(null)

export function ContactsProvider({ children }: { children: React.ReactNode }) {
    const { userId, isLoaded } = useAuth()
    const [contacts, setContacts] = React.useState<Contact[]>([])
    const [loading, setLoading] = React.useState(true)

    const deleteContact = async (id: string) => {
        setContacts((current) => current.filter((c) => c.id !== id)) // optimistic
        await deleteContactAction(id)
    }

    React.useEffect(() => {
        if (!isLoaded) return

        if (!userId) {
            setLoading(false)
            return
        }

        const fetchContacts = async () => {
            setLoading(true)
            try {
                const result = await getContacts(userId)
                console.log("contacts fetch result: ", result)
                if (result.success) {
                    setContacts(result.data.map(toContact))
                }
            } catch (e) {
                console.error("Failed to fetch contacts", e)
            } finally {
                setLoading(false)
            }
        }

        fetchContacts()
    }, [isLoaded, userId])

    const addContact: ContactsContextType["addContact"] = async (data) => {
        if (!userId) return

        const result = await createContact({ clerkId: userId, ...data })
        if (result.success) {
            setContacts((current) => [toContact(result.data), ...current])
        }
    }

    const logInteraction: ContactsContextType["logInteraction"] = async (contactId, note) => {
        const result = await logInteractionAction(contactId, note)
        if (result.success) {
            setContacts((current) =>
                current.map((c) => (c.id === contactId ? toContact(result.data) : c))
            )
        }
    }

    const updateContactNotes: ContactsContextType["updateContactNotes"] = async (contactId, notes) => {
        const result = await updateContactNotesAction(contactId, notes)
        if (result.success) {
            setContacts((current) =>
                current.map((c) => (c.id === contactId ? toContact(result.data) : c))
            )
        }
    }

    return (
        <ContactsContext.Provider value={{ contacts, loading, addContact, logInteraction, updateContactNotes, deleteContact }}>
            {children}
        </ContactsContext.Provider>
    )
}

export function useContacts() {
    const ctx = React.useContext(ContactsContext)
    if (!ctx) throw new Error("useContacts must be used within ContactsProvider")
    return ctx
}