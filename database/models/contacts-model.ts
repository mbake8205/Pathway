import { model, models, Schema } from "mongoose";
import { IContact } from "@/types/types";

const InteractionSchema = new Schema(
    {
            note: { type: String, required: true, trim: true },
            date: { type: Date, default: Date.now },
    },
    { _id: true } // each interaction gets its own _id, useful as a React key
);

const ContactSchema = new Schema<IContact>(
    {
            clerkId: { type: String, required: true, index: true },
            name: { type: String, required: true, trim: true },
            role: { type: String, trim: true },
            company: { type: String, trim: true },
            email: { type: String, trim: true },
            linkedinUrl: { type: String, trim: true },
            applicationId: { type: Schema.Types.ObjectId, ref: "JobApplication" },
            notes: { type: String, trim: true },
            lastContactedAt: { type: Date, default: Date.now },
            interactions: { type: [InteractionSchema], default: [] },
    },
    { timestamps: true }
);

ContactSchema.index({ clerkId: 1 });

const Contact = models.Contact || model<IContact>("Contact", ContactSchema);

export default Contact;