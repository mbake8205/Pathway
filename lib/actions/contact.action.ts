'use server'

import { connectToDatabase } from "@/database/mongoose";
import { serializeData } from "@/lib/utils";
import Contact from "@/database/models/contacts-model";

export const getContacts = async (clerkId: string) => {
    try {
        await connectToDatabase();

        const contacts = await Contact.find({ clerkId })
            .sort({ createdAt: -1 })
            .lean();

        return {
            success: true as const,
            data: serializeData(contacts),
        };
    } catch (e) {
        console.error("Error fetching contacts", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const createContact = async (data: {
    clerkId: string;
    name: string;
    role?: string;
    company?: string;
    email?: string;
    linkedinUrl?: string;
    applicationId?: string;
    notes?: string;
}) => {
    try {
        await connectToDatabase();

        const contact = await Contact.create({
            ...data,
            lastContactedAt: new Date(),
        });
    
        return {
            success: true as const,
            data: serializeData(contact),
        };
    } catch (e) {
        console.error("Error creating contact", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const updateContactNotes = async (contactId: string, notes: string) => {
    try {
        await connectToDatabase();

        const updated = await Contact.findByIdAndUpdate(
            contactId,
            { notes },
            { new: true }
        ).lean();

        if (!updated) {
            return { success: false as const, error: "Contact not found" };
        }

        return {
            success: true as const,
            data: serializeData(updated),
        };
    } catch (e) {
        console.error("Error updating contact notes", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const logInteraction = async (contactId: string, note: string) => {
    try {
        await connectToDatabase();

        const updated = await Contact.findByIdAndUpdate(
            contactId,
            {
                $push: { interactions: { note, date: new Date() } },
                lastContactedAt: new Date(),
            },
            { new: true }
        ).lean();

        if (!updated) {
            return { success: false as const, error: "Contact not found" };
        }

        return {
            success: true as const,
            data: serializeData(updated),
        };
    } catch (e) {
        console.error("Error logging interaction", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};

export const deleteContact = async (contactId: string) => {
    try {
        await connectToDatabase();

        const deleted = await Contact.findByIdAndDelete(contactId);

        if (!deleted) {
            return { success: false as const, error: "Contact not found" };
        }

        return { success: true as const };
    } catch (e) {
        console.error("Error deleting contact", e);
        return {
            success: false as const,
            error: e instanceof Error ? e.message : String(e),
        };
    }
};