"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ArrowUpRight, Bell, BriefcaseBusiness, CalendarDays, ChevronDown,
    CircleHelp, FileText, LayoutDashboard, Moon, Plus, Search, Settings,
    Sparkles, Sun, Target, Users,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { ApplicationsProvider, useApplications } from "@/lib/applications-context"
import {useClerk, useUser, SignInButton, SignUpButton, Show} from "@clerk/nextjs";
import {ContactsProvider} from "@/lib/contacts-context";


const navItems = [
    { label: "Overview", href: "/overview", icon: LayoutDashboard },
    { label: "Applications", href: "/applications", icon: BriefcaseBusiness },
    { label: "Calendar", href: "/calendar", icon: CalendarDays },
    { label: "Contacts", href: "/contacts", icon: Users },
]

function Sidebar() {
    const pathname = usePathname()
    const { applications } = useApplications()
    const { user } = useUser()
    const { signOut, openUserProfile } = useClerk()

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
            <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Target className="size-4" />
                </div>
                <span className="font-semibold tracking-tight">Pathway</span>
            </div>
            <div className="flex flex-1 flex-col justify-between p-3">
                <nav className="flex flex-col gap-1" aria-label="Main navigation">
                    <p className="px-3 pb-2 pt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Workspace</p>
                    {navItems.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${
                                pathname === href
                                    ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground"
                            }`}
                        >
                            <Icon className="size-4" />
                            {label}
                            {label === "Applications" && (
                                <Badge variant="secondary" className="ml-auto">{applications.length}</Badge>
                            )}
                        </Link>
                    ))}
                    <Separator className="my-4" />
                    <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Personal</p>
                    <div onClick={() => openUserProfile()} className="flex h-10 items-center gap-3 rounded-lg cursor-pointer px-3 text-sm text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground">
                        <Settings className="size-4" />Settings
                    </div>
                    <Link href="/help" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground">
                        <CircleHelp className="size-4" />Help center
                    </Link>
                </nav>
                <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                        <Sparkles className="size-4 text-primary" />Weekly goal
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">You&apos;re 4 applications away from your goal.</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-3/5 rounded-full bg-primary" />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">6 / 10</span> applications
                    </p>
                </div>
            </div>
            <div className="border-t border-sidebar-border p-3">
                <Show when="signed-in">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={<button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-sidebar-accent" />}>
                            <Avatar className="size-8">
                                <AvatarFallback className="bg-primary/15 text-xs text-primary">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">{user?.fullName}</p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>
                            <ChevronDown className="size-4 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => openUserProfile()}>Profile settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </Show>

                <Show when="signed-out">
                    <div className="flex flex-col gap-2">
                        <SignInButton mode="modal">
                            <Button variant="outline" size="sm" className="w-full">Sign in</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button size="sm" className="w-full">Sign up</Button>
                        </SignUpButton>
                    </div>
                </Show>
            </div>
        </aside>
    )
}

function Header() {
    const pathname = usePathname()
    const { dark, setDark, setNewOpen } = useApplications()
    const { user } = useUser()
    const activeLabel = navItems.find((n) => n.href === pathname)?.label ?? "Overview"

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
    })

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur md:px-8">
            <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground md:hidden">
                    <Target className="size-4" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{today}</p>
                    <h1 className="text-lg font-semibold tracking-tight md:text-xl">Good morning, {user?.firstName ?? ""}</h1>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <Tooltip>
                    <TooltipTrigger render={
                        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark((v) => !v)}>
                            {dark ? <Sun /> : <Moon />}
                        </Button>
                    } />
                    <TooltipContent>Toggle theme</TooltipContent>
                </Tooltip>

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
            </div>
        </header>
    )
}

function GlobalDialogs() {
    const {
        selected, setSelected,
        newOpen, setNewOpen,
        newCompany, setNewCompany,
        newRole, setNewRole,
        newUrl, setNewUrl,
        addApplication,
    } = useApplications()

    return (
        <>
            <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                    <SheetHeader className="border-b border-border">
                        <div className="mb-2 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 font-semibold text-primary">
                                {selected?.color}
                            </div>
                            <div>
                                <SheetTitle>{selected?.company}</SheetTitle>
                                <SheetDescription>{selected?.role}</SheetDescription>
                            </div>
                        </div>
                        <Badge variant="secondary" className="w-fit">{selected?.status}</Badge>
                    </SheetHeader>
                    {selected && (
                        <div className="flex flex-col gap-6 p-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="mt-1 text-sm font-medium">{selected.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Type</p>
                                    <p className="mt-1 text-sm font-medium">{selected.type}</p>
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-sm font-medium">Notes</p>
                                <div className="rounded-lg bg-muted/50 p-3 text-sm leading-6 text-muted-foreground">{selected.notes}</div>
                            </div>
                            <div>
                                <p className="mb-3 text-sm font-medium">Timeline</p>
                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-3">
                                        <div className="mt-1 size-2 rounded-full bg-primary" />
                                        <div>
                                            <p className="text-sm font-medium">{selected.date}</p>
                                            <p className="text-xs text-muted-foreground">Application status updated</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-1 size-2 rounded-full bg-muted-foreground/40" />
                                        <div>
                                            <p className="text-sm font-medium">Added to Pathway</p>
                                            <p className="text-xs text-muted-foreground">Keep your notes and next steps here</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex flex-wrap gap-2">
                                <Button className="gap-2"><ArrowUpRight data-icon="inline-start" />Open job posting</Button>
                                <Button variant="outline" className="gap-2"><FileText data-icon="inline-start" />Add note</Button>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={newOpen} onOpenChange={setNewOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add an application</DialogTitle>
                        <DialogDescription>Start tracking a new opportunity in your wishlist.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-2">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="company" className="text-sm font-medium">Company</label>
                            <Input id="company" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="e.g. Acme Inc." />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="role" className="text-sm font-medium">Role</label>
                            <Input id="role" value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="e.g. Product Designer" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="Job-URl" className="text-sm font-medium">Job-Url</label>
                            <Input id="Job-URl" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Application URL" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
                        <Button onClick={addApplication} disabled={!newCompany.trim() || !newRole.trim()}>Add application</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ApplicationsProvider>
            <ContactsProvider>
                <TooltipProvider>
                    <div className="min-h-screen bg-background text-foreground">
                        <Sidebar />
                        <main className="md:pl-64">
                        <Header />
                        <div className="mx-auto max-w-[1600px] p-4 md:p-8">{children}</div>
                        </main>
                    <   GlobalDialogs />
                        </div>
                </TooltipProvider>
            </ContactsProvider>
        </ApplicationsProvider>
    )
}