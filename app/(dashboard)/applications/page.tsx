"use client"

import * as React from "react"
import { Filter, GripVertical, MoreHorizontal, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useApplications } from "@/lib/applications-context"
import { Status } from "@/types/types"
import {Show, SignInButton} from "@clerk/nextjs";

const columns: { status: Status; tone: string }[] = [
    { status: "Wishlist", tone: "bg-muted-foreground/40" },
    { status: "Applied", tone: "bg-primary" },
    { status: "Interview", tone: "bg-chart-2" },
    { status: "Offer", tone: "bg-chart-3" },
    { status: "Rejected", tone: "bg-destructive/70" },
]

export default function ApplicationsPage() {
    const { applications, loading, moveApplication, setSelected, setNewOpen } = useApplications()
    const [query, setQuery] = React.useState("")
    const [draggedId, setDraggedId] = React.useState<string | null>(null)

    const filtered = applications.filter((a) =>
        `${a.company} ${a.role} ${a.location}`.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <>
            <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Workspace</span><span>/</span><span className="text-foreground">Applications</span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Applications</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Drag cards between columns to update status.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative min-w-0 flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search applications"
                            className="pl-9"
                            aria-label="Search applications"
                        />
                    </div>
                    <Button variant="outline" size="icon" aria-label="Filter applications"><Filter /></Button>
                </div>
            </div>

            {loading ? (
                <div className="-mx-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
                    <div className="grid min-w-[1100px] grid-cols-5 gap-4">
                        {columns.map(({ status }) => (
                            <div key={status} className="min-h-[300px] rounded-xl bg-muted/35 p-3">
                                <Skeleton className="mb-3 h-5 w-24" />
                                <div className="flex flex-col gap-3">
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                    <Skeleton className="h-24 w-full rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : filtered.length === 0 ? (
                <Card className="shadow-none">
                    <Empty className="py-16">
                        <EmptyHeader>
                            <EmptyMedia variant="icon"><Search /></EmptyMedia>
                            <EmptyTitle>No applications found</EmptyTitle>
                            <EmptyDescription>Try a different search term or add a new application.</EmptyDescription>
                        </EmptyHeader>
                        <Show when="signed-in">
                            <Button onClick={() => setNewOpen(true)} className="hidden gap-2 sm:flex">
                                <Plus data-icon="inline-start" />New application
                            </Button>
                        </Show>
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <Button className="hidden gap-2 sm:flex">
                                    <Plus data-icon="inline-start" />New application
                                </Button>
                            </SignInButton>
                        </Show>
                    </Empty>
                </Card>
            ) : (
                <div className="-mx-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
                    <div className="grid min-w-[1100px] grid-cols-5 gap-4">
                        {columns.map(({ status, tone }) => {
                            const items = filtered.filter((a) => a.status === status)
                            return (
                                <div
                                    key={status}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => draggedId !== null && moveApplication(draggedId, status)}
                                    className="min-h-[300px] rounded-xl bg-muted/35 p-3"
                                >
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-2 rounded-full ${tone}`} />
                                            <h4 className="text-sm font-medium">{status}</h4>
                                            <span className="text-xs text-muted-foreground">{items.length}</span>
                                        </div>
                                        <Button variant="ghost" size="icon-sm" aria-label={`Add to ${status}`} onClick={() => setNewOpen(true)}>
                                            <Plus />
                                        </Button>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {items.map((application) => (
                                            <button
                                                key={application.id}
                                                draggable
                                                onDragStart={() => setDraggedId(application.id)}
                                                onDragEnd={() => setDraggedId(null)}
                                                onClick={() => setSelected(application)}
                                                className="group rounded-lg border border-border/80 bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                                                        {application.color}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <p className="truncate text-sm font-semibold">{application.company}</p>
                                                                <p className="truncate text-xs text-muted-foreground">{application.role}</p>
                                                            </div>
                                                            <MoreHorizontal className="size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                                                        </div>
                                                        <p className="mt-3 truncate text-xs text-muted-foreground">{application.location}</p>
                                                        <div className="mt-3 flex items-center justify-between">
                                                            <span className="text-[11px] text-muted-foreground">{application.date}</span>
                                                            <GripVertical className="size-3.5 text-muted-foreground/50" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </>
    )
}