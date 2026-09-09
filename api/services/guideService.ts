import { randomUUID } from "node:crypto";
import { guideRepository } from "../repositories/guideRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { generateGuidePdf } from "./guidePdf.js";
import type {
  Guide,
  GuideInput,
  GuideRecipient,
  GuideParcel,
  CourierType,
} from "../models/types.js";
import { COURIER_TYPES } from "../models/types.js";

const GUIDE_COST = 30;

const COURIER_PREFIX: Record<CourierType, string> = {
  cargo_expreso: "CE",
  forza: "FZ",
  guatex: "GX",
  mock: "MOCK",
};

function buildTrackingNumber(courier: CourierType): string {
  const prefix = COURIER_PREFIX[courier] ?? "MOCK";
  const year = new Date().getFullYear();
  const random = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `${prefix}-${year}-${random}`;
}

export async function createGuide(userId: string, input: GuideInput): Promise<Guide> {
  const recipient: GuideRecipient = { ...input.recipient };
  const parcel: GuideParcel = { ...input.parcel };

  const guide: Guide = {
    id: randomUUID(),
    userId,
    trackingNumber: buildTrackingNumber(input.courier),
    courier: input.courier,
    courierId: input.courierId ?? 1,
    recipient,
    parcel,
    status: "created",
    cost: GUIDE_COST,
    pdf: Buffer.alloc(0),
    createdAt: new Date().toISOString(),
    isCancelled: false,
  };

  const pdf = generateGuidePdf(guide);
  guide.pdf = pdf;

  await userRepository.updateBalance(userId, -GUIDE_COST);
  return guideRepository.create(guide);
}

export async function getGuide(id: string): Promise<Guide | undefined> {
  return guideRepository.findById(id);
}

export async function listGuides(userId: string): Promise<Guide[]> {
  return guideRepository.findByUser(userId);
}

export async function cancelGuide(
  id: string,
  userId: string,
): Promise<Guide | undefined> {
  const guide = await guideRepository.findById(id);
  if (!guide || guide.userId !== userId) return undefined;
  if (guide.isCancelled) return guide;
  guide.isCancelled = true;
  guide.status = "cancelled";
  return guideRepository.update(guide);
}

export async function deleteGuide(
  id: string,
  userId: string,
): Promise<boolean> {
  return guideRepository.deleteById(id, userId);
}

export function isValidCourier(courier: string): courier is CourierType {
  return COURIER_TYPES.includes(courier as CourierType);
}