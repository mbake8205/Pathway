'use client'

import React, { useMemo, useState } from 'react'
import {
    Check,
    ChevronRight,
    Clock3,
    ExternalLink,
    Grid2X2,
    Link,
    Mail,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Search,
    Users,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useContacts, type Contact } from "@/lib/contacts-context"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function ContactCard({
                         contact,
                         onOpen,
                         onDelete
                     }: {
    contact: Contact
    onOpen: () => void
    onDelete: () => void
}) {
    return (
        <Card
            className="group cursor-pointer border-border/80 bg-card/80 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            onClick={onOpen}
        >
            <CardContent className="flex flex-col gap-5 p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="size-11">
                            <AvatarFallback className={contact.tone}>{contact.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold tracking-tight">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">{contact.role}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal />
                                </Button>
                            }
                        />
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                        <span className="size-2 rounded-full bg-primary/80" />
                        {contact.company}
                    </div>
                    <Badge variant="secondary" className="max-w-[52%] truncate font-normal">
                        {contact.applicationId}
                    </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                    <a
                        href={`mailto:${contact.email}`}
                        aria-label={`Email ${contact.name}`}
                        onClick={(event) => event.stopPropagation()}
                        className="transition-colors hover:text-foreground"
                        >
                        <Mail className="size-4" />
                    </a>
                    <a
                    href={`https://${contact.linkedIn}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`LinkedIn profile for ${contact.name}`}
                    onClick={(event) => event.stopPropagation()}
                    className="transition-colors hover:text-foreground"
                    >
                    <Link className="size-4" />
                </a>
            </div>
            <span className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5" />
                {contact.lastContacted}
                    </span>
        </div>
</CardContent>
</Card>
)
}

export default function ContactsPage() {
    const { contacts, loading, addContact, logInteraction, updateContactNotes, deleteContact } = useContacts()
    const [query, setQuery] = useState('')
    const [selected, setSelected] = useState<(typeof contacts)[number] | null>(null)
    const [newOpen, setNewOpen] = useState(false)
    const [logOpen, setLogOpen] = useState(false)
    const [interaction, setInteraction] = useState('')
    const [newName, setNewName] = useState('')
    const [newRole, setNewRole] = useState('')
    const [newCompany, setNewCompany] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [newLinkedin, setNewLinkedin] = useState('')
    const [newNotes, setNewNotes] = useState('')
    const [notesDraft, setNotesDraft] = useState('')

    React.useEffect(() => {
        if (selected) {
            setNotesDraft(selected.notes)
        }
    }, [selected?.id])

    React.useEffect(() => {
        if (selected) {
            const updated = contacts.find((c) => c.id === selected.id)
            if (updated) setSelected(updated)
        }
    }, [contacts])

    const filtered = useMemo(
        () =>
            contacts.filter((contact) =>
                `${contact.name} ${contact.company} ${contact.role}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
            ),
        [query, contacts]
    )

    return (
        <>
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                    Workspace <ChevronRight className="mx-1 inline size-3" />{' '}
                    <span className="text-foreground">Contacts</span>
                </p>
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Contacts</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Build relationships that move your job search forward.
                        </p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search contacts..."
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{filtered.length}</span> contacts
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                        <Grid2X2 data-icon="inline-start" />
                        Grid view
                    </Button>
                    <Button onClick={() => setNewOpen(true)} className="gap-2">
                        <Plus data-icon="inline-start" />
                        New Contact
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 animate-pulse rounded-xl bg-muted/40" />
                    ))}
                </div>
            ) : filtered.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((contact) => (
                        <ContactCard
                            key={contact.id}
                            contact={contact}
                            onOpen={() => setSelected(contact)}
                            onDelete={() => deleteContact(contact.id)}
                        />
                    ))}
                </div>
            ) : (
                <Empty className="min-h-[360px] rounded-xl border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Users />
                        </EmptyMedia>
                        <EmptyTitle>No contacts found</EmptyTitle>
                        <EmptyDescription>
                            Try a different search or add a new person to your network.
                        </EmptyDescription>
                    </EmptyHeader>
                    <Button onClick={() => setNewOpen(true)}>
                        <Plus data-icon="inline-start" />
                        New Contact
                    </Button>
                </Empty>
            )}

            <p className="pt-4 text-center text-xs text-muted-foreground">
                Keep showing up. Every conversation is a step forward.
            </p>
        </div>

        <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
            <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <div className="flex items-center gap-3">
                        <Avatar className="size-12">
                            <AvatarFallback className={selected?.tone}>{selected?.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <SheetTitle>{selected?.name}</SheetTitle>
                            <SheetDescription>
                                {selected?.role} at {selected?.company}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {selected && (
                    <div className="flex flex-col gap-6 px-4 pb-6">
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{selected.applicationId}</Badge>
                            <Badge variant="outline">Last contacted {selected.lastContacted}</Badge>
                        </div>

                        <div className="grid gap-2 text-sm">

                            <a href={`mailto:${selected.email}`}
                            className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                            >
                            <Mail className="size-4" />
                            {selected.email}
                            <ExternalLink className="ml-auto size-3.5" />
                        </a>
                    <a
                        href={`https://${selected.linkedIn}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                        >
                        <Link className="size-4" />
                        {selected.linkedIn}
                        <ExternalLink className="ml-auto size-3.5" />
                    </a>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2">
                    <Label>Notes</Label>
                    <Textarea value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} className="min-h-28 resize-none" />
                        <Button
                            size="sm"
                            variant="outline"
                            className="self-end"
                            disabled={notesDraft === selected?.notes}
                            onClick={async () => {
                                if (selected) {
                                    await updateContactNotes(selected.id, notesDraft)
                                }
                            }}
                        >
                            Save notes
                        </Button>
        </div>

        <div className="flex items-center justify-between">
            <h3 className="font-semibold">Interaction history</h3>
            <Button size="sm" onClick={() => setLogOpen(true)}>
                <MessageCircle data-icon="inline-start" />
                Log interaction
            </Button>
        </div>

        <div className="flex flex-col gap-5">
            {selected.events.map((event) => (
                <div key={event.title} className="relative flex gap-3">
                    <div className="relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                        <Check className="size-3.5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <p className="pt-1 text-sm leading-6 text-muted-foreground">
                            {event.detail}
                        </p>
                    </div>
                </div>
            ))}
        </div>
        </div>
)}
</SheetContent>
</Sheet>

    <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Add a new contact</DialogTitle>
                <DialogDescription>
                    Save someone who can help you make your next career move.
                </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                           value={newName}
                           onChange={(e) => setNewName(e.target.value)}
                           placeholder="e.g. Alex Morgan" />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select>
                        <SelectTrigger id="role">
                            <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
                            <SelectItem value="hiring-manager">Hiring Manager</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                        id="company"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        placeholder="e.g. Acme Inc."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="alex@company.com"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                        id="linkedin"
                        value={newLinkedin}
                        onChange={(e) => setNewLinkedin(e.target.value)}
                        placeholder="linkedin.com/in/..."
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Linked application</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select application" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="product-designer">Product Designer at Linear</SelectItem>
                            <SelectItem value="senior-designer">Senior Product Designer at Stripe</SelectItem>
                            <SelectItem value="staff-designer">Staff Product Designer at Notion</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        value={newNotes}
                        onChange={(e) => setNewNotes(e.target.value)}
                        placeholder="Add context for your next conversation..."
                        className="min-h-24 resize-none"
                    />
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setNewOpen(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={async () => {
                        await addContact({
                            name: newName,
                            role: newRole,
                            company: newCompany,
                            email: newEmail,
                            linkedinUrl: newLinkedin,
                            notes: newNotes,
                        })
                        setNewName('')
                        setNewRole('')
                        setNewCompany('')
                        setNewEmail('')
                        setNewLinkedin('')
                        setNewNotes('')
                        setNewOpen(false)
                    }}
                    disabled={!newName.trim()}
                >
                    Save contact
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

    <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Log interaction</DialogTitle>
                <DialogDescription>
                    Capture a quick note about your latest conversation with {selected?.name}.
                </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-2 py-2">
                <Label htmlFor="interaction">What happened?</Label>
                <Textarea
                    id="interaction"
                    value={interaction}
                    onChange={(event) => setInteraction(event.target.value)}
                    placeholder="e.g. Sent a follow-up email..."
                    className="min-h-28 resize-none"
                />
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setLogOpen(false)}>
                    Cancel
                </Button>
                <Button
                    onClick={async () => {
                        if (selected && interaction.trim()) {
                            await logInteraction(selected.id, interaction.trim())
                        }
                        setInteraction('')
                        setLogOpen(false)
                    }}
                    disabled={!interaction.trim()}
                >
                    Save interaction
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</>
)
}