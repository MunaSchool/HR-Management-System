import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type HolidayCalendarDocument = HydratedDocument<HolidayCalendar>;

@Schema({ collection: 'holiday_calendars', timestamps: true, versionKey: false })
export class HolidayCalendar {
  @Prop({ required: true })
  name: string; // e.g. "Egypt 2025" or "Company Calendar 2025"

  // List of holidays with name + type for clarity
  @Prop({
    type: [
      {
        date: { type: Date, required: true },
        name: { type: String, required: true },
        type: { type: String, enum: ['NATIONAL', 'COMPANY'], default: 'NATIONAL' },
      },
    ],
    default: [],
  })
  holidays: { date: Date; name: string; type?: string }[];

  // Leave-blocked periods (for financial closure, audits, etc.)
  @Prop({
    type: [
      {
        from: { type: Date, required: true },
        to: { type: Date, required: true },
        reason: { type: String, trim: true },
      },
    ],
    default: [],
  })
  blockedPeriods: { from: Date; to: Date; reason?: string }[];
}

export const HolidayCalendarSchema = SchemaFactory.createForClass(HolidayCalendar);
