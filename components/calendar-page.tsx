'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from "@clerk/nextjs"
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    MapPin,
    Video,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { getCalendarEvents } from "@/lib/actions/job-application.actions"

type Event = {
    id: string
    title: string
    company: string
    role: string
    type: 'Interview' | 'Follow-up' | 'Deadline'
    date: string   // "YYYY-MM-DD"
    time: string
    notes: string
}

// Converts a raw JobApplication doc (with interviewDate) into a calendar Event
function toEvent(doc: any): Event {
    const d = new Date(doc.interviewDate)
    return {
        id: doc._id,
        title: "Interview",
        company: doc.company,
        role: doc.role,
        type: "Interview",
        date: d.toISOString().slice(0, 10),
        time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        notes: doc.notes ?? "",
    }
}

const typeClass = {
    Interview: 'bg-primary/15 text-primary',
    'Follow-up': 'bg-chart-2/15 text-chart-2',
    Deadline: 'bg-chart-4/15 text-chart-4',
}

function daysInMonth(month: Date) {
    const start = new Date(month.getFullYear(), month.getMonth(), 1)
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    const cells: Date[] = []

    for (let i = start.getDay() - 1; i >= 0; i--) {
        cells.push(new Date(month.getFullYear(), month.getMonth(), -i))
    }

    for (let day = 1; day <= end.getDate(); day++) {
        cells.push(new Date(month.getFullYear(), month.getMonth(), day))
    }

    while (cells.length % 7) {
        cells.push(
            new Date(
                month.getFullYear(),
                month.getMonth() + 1,
                cells.length - end.getDate() - start.getDay() + 1
            )
        )
    }

    return cells
}

export default function CalendarPageComponent() {
    const { userId, isLoaded } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [month, setMonth] = useState(new Date())
    const [view, setView] = useState<'Month' | 'Week'>('Month')
    const [selected, setSelected] = useState<Event | null>(null)

    const today = useMemo(() => new Date(), [])

    useEffect(() => {
        if (!isLoaded) return
        if (!userId) {
            setLoading(false)
            return
        }

        const fetchEvents = async () => {
            setLoading(true)
            try {
                const result = await getCalendarEvents(userId)
                if (result.success) {
                    setEvents(result.data.map(toEvent))
                }
            } catch (e) {
                console.error("Failed to fetch calendar events", e)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [isLoaded, userId])

    const cells = useMemo(() => daysInMonth(month), [month])

    const monthEvents = events.filter(
        (event) =>
            new Date(event.date).getMonth() === month.getMonth() &&
            new Date(event.date).getFullYear() === month.getFullYear()
    )

    const upcoming = events
        .filter((event) => new Date(event.date) >= today)
        .slice(0, 4)

    const eventFor = (day: Date) =>
        events.filter((event) => event.date === day.toISOString().slice(0, 10))

    const shiftMonth = (amount: number) =>
        setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1))

    return (
        <>
            <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                    Workspace <ChevronRight className="mx-1 inline size-3" />{' '}
                    <span className="text-foreground">Calendar</span>
                </p>
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Calendar</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Stay on top of the conversations and milestones in your job search.
                    </p>
                </div>
            </div>

            <div className="mt-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                        <ChevronLeft />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => shiftMonth(1)} aria-label="Next month">
                        <ChevronRight />
                    </Button>
                    <Button variant="outline" onClick={() => setMonth(new Date())}>
                        Today
                    </Button>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
                    <Button
                        size="sm"
                        variant={view === 'Month' ? 'secondary' : 'ghost'}
                        onClick={() => setView('Month')}
                    >
                        Month
                    </Button>
                    <Button
                        size="sm"
                        variant={view === 'Week' ? 'secondary' : 'ghost'}
                        onClick={() => setView('Week')}
                    >
                        Week
                    </Button>
                </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/70 px-4 py-4">
                        <CardTitle className="text-base">
                            {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </CardTitle>
                        <div className="flex gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <i className="size-2 rounded-full bg-primary" />
                                Interview
                            </span>
                            <span className="flex items-center gap-1.5">
                                <i className="size-2 rounded-full bg-chart-2" />
                                Follow-up
                            </span>
                            <span className="flex items-center gap-1.5">
                                <i className="size-2 rounded-full bg-chart-4" />
                                Deadline
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="grid grid-cols-7 border-b border-border/70">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div
                                    key={day}
                                    className="px-2 py-3 text-center text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-7">
                                {Array.from({ length: 35 }).map((_, i) => (
                                    <div key={i} className="min-h-28 animate-pulse border-b border-r border-border/60 bg-muted/10" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {view === 'Month' && (
                                    <div className="grid grid-cols-7">
                                        {cells.map((day, index) => {
                                            const dayEvents = eventFor(day)
                                            const isCurrent = day.getMonth() === month.getMonth()
                                            const isToday = day.toDateString() === today.toDateString()

                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => dayEvents[0] && setSelected(dayEvents[0])}
                                                    className={`min-h-28 border-b border-r border-border/60 p-2 transition-colors hover:bg-muted/30 ${
                                                        !isCurrent ? 'bg-muted/10 text-muted-foreground/50' : ''
                                                    }`}
                                                >
                                                    <div
                                                        className={`mb-2 text-xs ${
                                                            isToday
                                                                ? 'grid size-6 place-items-center rounded-full bg-primary font-semibold text-primary-foreground'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {day.getDate()}
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {dayEvents.slice(0, 2).map((event) => (
                                                            <button
                                                                key={event.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setSelected(event)
                                                                }}
                                                                className={`truncate rounded px-1.5 py-1 text-left text-[11px] font-medium ${
                                                                    typeClass[event.type]
                                                                }`}
                                                            >
                                                                {event.title} · {event.company}
                                                            </button>
                                                        ))}
                                                        {dayEvents.length > 2 && (
                                                            <span className="px-1 text-[11px] text-muted-foreground">
                                                                +{dayEvents.length - 2} more
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {monthEvents.length === 0 && (
                                    <Empty className="py-16">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <CalendarDays />
                                            </EmptyMedia>
                                            <EmptyTitle>No events this month</EmptyTitle>
                                            <EmptyDescription>
                                                Your interviews, follow-ups, and deadlines will appear here.
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="text-base">Upcoming this week</CardTitle>
                        <p className="text-sm text-muted-foreground">Your next important moments.</p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-1">
                        {upcoming.length === 0 && !loading && (
                            <p className="px-3 py-2 text-sm text-muted-foreground">No upcoming events.</p>
                        )}
                        {upcoming.map((event) => (
                            <button
                                key={event.id}
                                onClick={() => setSelected(event)}
                                className="flex gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50"
                            >
                                <span
                                    className={`mt-1.5 size-2 shrink-0 rounded-full ${
                                        event.type === 'Interview'
                                            ? 'bg-primary'
                                            : event.type === 'Follow-up'
                                                ? 'bg-chart-2'
                                                : 'bg-chart-4'
                                    }`}
                                />
                                <span className="flex min-w-0 flex-col gap-1">
                                    <span className="font-medium">{event.company}</span>
                                    <span className="truncate text-xs text-muted-foreground">{event.role}</span>
                                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock3 className="size-3" />
                                        {new Date(event.date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                        })}{' '}
                                        · {event.time}
                                    </span>
                                </span>
                            </button>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                    <SheetHeader>
                        <div className="flex items-center gap-2">
                            <Badge className={selected ? typeClass[selected.type] : ''} variant="secondary">
                                {selected?.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {selected &&
                                    new Date(selected.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                            </span>
                        </div>
                        <SheetTitle>{selected?.company}</SheetTitle>
                        <SheetDescription>{selected?.role}</SheetDescription>
                    </SheetHeader>

                    {selected && (
                        <div className="flex flex-col gap-6 px-4 pb-6">
                            <div className="grid gap-3 text-sm">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Clock3 className="size-4" />
                                    {selected.time}
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Video className="size-4" />
                                    Video call
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <MapPin className="size-4" />
                                    Online
                                </div>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <h3 className="font-semibold">Notes</h3>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {selected.notes || "No notes yet."}
                                </p>
                            </div>

                            <div className="rounded-lg border border-border bg-muted/20 p-4">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <FileText className="size-4 text-primary" />
                                    Linked application
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {selected.role} at {selected.company}
                                </p>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}