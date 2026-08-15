'use server'

import { connectToDatabase } from "@/database/mongoose";
import { serializeData } from "@/lib/utils";
import JobApplication from "@/database/models/job-application.model";
import { Status } from "@/types/types"
import { auth } from "@clerk/nextjs/server"

export const getApplications = async (clerkId: string) => {
    try {
        await connectToDatabase();

        const applications = await JobApplication.find({ clerkId })
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true as const,   // <-- literal true
            data: serializeData(applications),
        };
    } catch (e) {
        console.error("Error fetching applications", e);
        return {
            success: false as const,   // <-- literal false
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const createApplication = async (data: {
    clerkId: string;
    company: string;
    role: string;
    location?: string;
    type?: string;
    notes?: string;
}) => {
    try {
        await connectToDatabase();

        const color = data.company.slice(0, 2).toUpperCase();

        const application = await JobApplication.create({
            ...data,
            status: "Wishlist",
            color,
            statusDate: new Date(),
        });

        return {
            success: true as const,
            data: serializeData(application),
        };
    } catch (e) {
        console.error("Error creating application", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const updateApplicationStatus = async (
    applicationId: string,
    status: Status
) => {
    try {
        await connectToDatabase();

        const updated = await JobApplication.findByIdAndUpdate(
            applicationId,
            { status, statusDate: new Date() },
            { new: true } // return the updated doc, not the old one
        ).lean();

        if (!updated) {
            return { success: false as const, error: "Application not found" };
        }

        return {
            success: true as const,
            data: serializeData(updated),
        };
    } catch (e) {
        console.error("Error updating application status", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const updateApplicationNotes = async (
    applicationId: string,
    notes: string
) => {
    try {
        await connectToDatabase();

        const updated = await JobApplication.findByIdAndUpdate(
            applicationId,
            { notes },
            { new: true }
        ).lean();

        if (!updated) {
            return { success: false as const, error: "Application not found" };
        }

        return {
            success: true as const,
            data: serializeData(updated),
        };
    } catch (e) {
        console.error("Error updating notes", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const deleteApplication = async (applicationId: string) => {
    try {
        await connectToDatabase();

        const deleted = await JobApplication.findByIdAndDelete(applicationId);

        if (!deleted) {
            return { success: false as const, error: "Application not found" };
        }

        return { success: true as const };
    } catch (e) {
        console.error("Error deleting application", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};