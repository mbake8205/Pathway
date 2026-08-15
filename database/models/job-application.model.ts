import { model, models, Schema } from "mongoose";
import { IJobApplication } from "@/types/types";

const JobApplicationSchema = new Schema<IJobApplication>(
    {
        clerkId: { type: String, required: true, index: true },
        company: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        location: { type: String, trim: true },
        status: {
            type: String,
            enum: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
            required: true,
            default: "Wishlist",
            index: true,
        },
        type: { type: String, trim: true, default: "Full-time" },
        color: { type: String, trim: true },
        notes: { type: String, trim: true },
        statusDate: { type: Date, default: Date.now }, // when status last changed
        interviewDate: { type: Date }, // for Calendar later
        jobPostingUrl: { type: String, trim: true },
    },
    { timestamps: true }
);

JobApplicationSchema.index({ clerkId: 1, status: 1 });

const JobApplication =
    models.JobApplication || model<IJobApplication>("JobApplication", JobApplicationSchema);

export default JobApplication;