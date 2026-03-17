import { modelOptions, prop, Severity } from "@typegoose/typegoose";
import type { Base } from "@typegoose/typegoose/lib/defaultClasses.d.js";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses.js";
import { Types } from "mongoose";

@modelOptions({
  options: { customName: "ticket", allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: true,
  },
})
export class ITicket extends TimeStamps implements Base<string> {
  id: string;

  @prop({ default: () => new Types.ObjectId().toString() })
  _id: string;

  @prop({ required: true })
  coperaRowId!: string;

  @prop({ required: true })
  title!: string;

  @prop({ default: "" })
  details?: string;

  @prop({ required: true })
  userId!: string;
}
