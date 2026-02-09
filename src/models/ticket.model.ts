import { Schema, model, Document } from "mongoose";

export interface ITicket extends Document {
  priority: string;
  status: string;
  address: string;
  assignedTo: string;//employee
  client: string; //which is the same as the subscribed user into out ISP
  description: string;
}

const ticketSchema = new Schema<ITicket>(
    {
        priority: { type: String, enum: ["low", "medium", "high"], lowercase: true, trim: true, default: "low" },
        status: { type: String, enum: ["open", "in progress", "pending", "closed"], lowercase: true, trim: true, default: "open" },
        address: { type: String, required: true, trim: true},
        assignedTo: { type: String, trim: true, default: ""},
        client: { type: String, required: true,  trim: true},
        description: { type: String, trim: true, minlength: 10,}, 
    },
    { timestamps: true }

);


export default model<ITicket>("tickets", ticketSchema);
