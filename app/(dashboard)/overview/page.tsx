"use client"

import * as React from "react"
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, Check, ChevronDown, Clock3, Mail } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useApplications } from "@/lib/applications-context"

const chartData = [
    { day: "Mon", applications: 2 }, { day: "Tue", applications: 4 }, { day: "Wed", applications: 3 },
    { day: "Thu", applications: 7 }, { day: "Fri", applications: 5 }, { day: "Sat", applications: 2 }, { day: "Sun", applications: 4 },
]
const chartConfig = { applications: { label: "Applications", color: "var(--color-primary)" } } satisfies ChartConfig

export default function OverviewPage() {
    const { applications, loading } = useApplications()

    return (
        <>
            <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Workspace</span><span>/</span><span className="text-foreground">Overview</span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Your job search at a glance</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Keep momentum on your next career move.</p>
                </div>
            </div>

            {loading ? (
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="shadow-none">
                            <CardContent className="p-5">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="mt-3 h-8 w-16" />
                                <Skeleton className="mt-2 h-3 w-20" />
                            </CardContent>
                        </Card>
                    ))}
                </section>
            ) : (
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Application summary">
                    {[
                        { label: "Total applications", value: applications.length, detail: "+3 this week", icon: BriefcaseBusiness },
                        { label: "Interviews", value: applications.filter((a) => a.status === "Interview").length, detail: "2 upcoming", icon: CalendarDays },
                        { label: "Response rate", value: "32%", detail: "+8% from last month", icon: ArrowUpRight },
                        { label: "Days active", value: "18", detail: "Keep it going", icon: Clock3 },
                    ].map(({ label, value, detail, icon: Icon }) => (
                        <Card key={label} className="shadow-none">
                            <CardContent className="flex items-start justify-between p-5">
                                <div>
                                    <p className="text-sm text-muted-foreground">{label}</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
                                    <p className="mt-1 text-xs text-primary">{detail}</p>
                                </div>
                                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <Icon className="size-4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}

            <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
                <Card className="min-w-0 shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-base">Application activity</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">Your applications this week</p>
                        </div>
                        <Button variant="outline" size="sm" className="hidden gap-2 sm:flex">
                            <CalendarDays data-icon="inline-start" />This week<ChevronDown data-icon="inline-end" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[220px] w-full">
                            <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="applications" fill="var(--color-applications)" radius={5} maxBarSize={34} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle className="text-base">Recent activity</CardTitle>
                        <p className="text-sm text-muted-foreground">A quick look at what&apos;s happening</p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-5">
                        {[
                            { icon: Check, title: "Application sent", text: "Linear · Product Designer", time: "2h ago" },
                            { icon: Mail, title: "Follow-up reminder", text: "Stripe · Senior Product Designer", time: "Yesterday" },
                            { icon: CalendarDays, title: "Interview scheduled", text: "Raycast · Product Designer", time: "Jun 21" },
                        ].map(({ icon: Icon, title, text, time }) => (
                            <div key={title} className="flex gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Icon className="size-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium">{title}</p>
                                    <p className="truncate text-xs text-muted-foreground">{text}</p>
                                </div>
                                <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </>
    )
}