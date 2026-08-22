export interface IJobApplication {
    _id: string;
    clerkId: string;
    company: string;
    role: string;
    location?: string;
    status: "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected";
    type?: string;
    color?: string;
    notes?: string;
    statusDate: Date;
    interviewDate?: Date;
    jobPostingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Status = "Wishlist" | "Applied" | "Interview" | "Offer" | "Rejected"

export interface IContactInteraction {
    _id: string;
    note: string;
    date: Date;
}

export interface IContact {
    _id: string;
    clerkId: string;
    name: string;
    role?: string;
    company?: string;
    email?: string;
    linkedinUrl?: string;
    applicationId?: string;
    notes?: string;
    lastContactedAt: Date;
    interactions: IContactInteraction[];
    createdAt: Date;
    updatedAt: Date;
}