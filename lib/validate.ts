import { z } from "zod";

// Input validation for every public/desk endpoint (spec §7.9).

export const leadSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional(),
  offerSlug: z.string().min(1).max(60),
  track: z.enum(["consumer", "corporate", "brand"]).default("consumer"),
  // free-text application/inquiry answers — sensitive, stored in GHL only.
  answers: z.record(z.string(), z.string().max(4000)).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required." }) }),
  source: z.string().max(120).optional(),
  sourceDetail: z.string().max(200).optional(),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  // simple honeypot: must be empty
  company_website: z.string().max(0).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const createOrderSchema = z.object({
  offerSlug: z.string().min(1).max(60),
  planType: z.enum(["full", "instalment", "deposit"]),
  contact: z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(200),
    phone: z.string().max(40).optional(),
    ghlContactId: z.string().max(80).optional(),
  }),
  customAmountPHP: z.number().positive().max(100_000_000).optional(),
  customDescription: z.string().max(300).optional(),
  instalmentCount: z.number().int().min(2).max(12).optional(),
  balanceDueDate: z.string().max(20).optional(),
});
export type CreateOrderBody = z.infer<typeof createOrderSchema>;

export const submitProofSchema = z.object({
  proofUrl: z.string().url().max(500),
});
