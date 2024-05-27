"use client";
import { useTranslations } from "next-intl";
import { z } from "zod";

export function useZodContract() {
	const t = useTranslations("Contract");
	const ZodContract = z.object({
		name: z.string().min(3, { message: t("Name must be at least 3 characters long") }),
		start_date: z.string().min(3, { message: t("Date is required") }),
		end_date: z.string().min(3, { message: t("Date is required") }),
		// discount: z
		// 	.number()
		// 	.min(0, { message: t("Price-must-be-at-least-0") })
		// 	.max(100, { message: t("Price-must-be-at-most-100") }),
	});
	return ZodContract;
}

export function useZodService() {
	const t = useTranslations("Contract");
	const ZodService = z.object({
		title: z.string().min(3, { message: t("Title must be at least 3 characters long") }),
		family: z.string().min(3, { message: t('family-must-be-at-least-3-characters-long') }),
		buying_price_ht: z.number().min(0, { message: t('amount-must-be-at-least-0') }),
		selling_price_ht: z.number().min(0, { message: t('amount-must-be-at-least-0') }),
		tva: z.number().min(0, { message: t('tva-must-be-at-least-0') }).max(100, { message: t('tva-must-be-at-most-100') }),
		buying_price_ttc: z.number().min(0, { message: t('amount-must-be-at-least-0') }),
		selling_price_ttc: z.number().min(0, { message: t('amount-must-be-at-least-0') }),
		units: z.string().min(1, { message: t("Units must be at least 1") }),
	});
	return ZodService;
}
export function useZodServiceEdit() {
	const t = useTranslations("Contract");
	const ZodService = z.object({
		title: z.string().min(3, { message: t("Title must be at least 3 characters long") }),	
		price_ttc: z.number().min(0, { message: t('amount-must-be-at-least-0') }),
		units: z.string().min(1, { message: t("Units must be at least 1") }),
		tva: z.number().min(0, { message: t('tva-must-be-at-least-0') }).max(100, { message: t('tva-must-be-at-most-100') }),
		purchase_price: z.number().min(0, { message: t('amount-must-be-at-least-0') }),
		selling_price: z.number().min(0, { message: t('amount-must-be-at-least-0') }),
		margin_rate: z.number(),
	});
	return ZodService;
}

export function useZodNameFamily() {
	const t = useTranslations("Contract");
	const ZodService = z.object({
		name: z.string().min(3, { message: t("Title must be at least 3 characters long") }),
	});
	return ZodService;
}