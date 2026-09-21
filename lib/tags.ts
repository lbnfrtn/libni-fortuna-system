// Tag conventions (spec §6). Code adds these; GHL workflows listen for them
// and do the communicating. Keep them consistent — the EA never invents tags.

export const tag = {
  lead: (offer: string) => `lead:${offer}`,
  applied: (offer: string) => `applied:${offer}`,
  callBooked: (offer: string) => `call-booked:${offer}`,
  offerMade: (offer: string) => `offer-made:${offer}`,
  paymentPending: (offer: string) => `payment-pending:${offer}`,
  paid: (offer: string) => `paid:${offer}`,
  customer: (offer: string) => `customer:${offer}`,
  waitlist: (offer: string) => `waitlist:${offer}`,
  instalmentDue: () => `instalment-due`,
  instalmentOverdue: () => `instalment-overdue`,
  onboarded: (offer: string) => `onboarded:${offer}`,
  nurture: () => `nurture`,
};
