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
