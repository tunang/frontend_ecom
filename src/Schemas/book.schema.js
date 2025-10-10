import { z } from "zod";

// Book Schema
export const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),

  description: z
    .string()
    .max(5000, "Mô tả không được vượt quá 5000 ký tự")
    .optional(),

  price: z
    .string()
    .min(1, "Giá là bắt buộc")
    .refine((val) => !isNaN(parseFloat(val)), "Giá phải là số")
    .refine((val) => parseFloat(val) > 0, "Giá phải lớn hơn 0"),

  stock_quantity: z
    .string()
    .min(1, "Số lượng tồn kho là bắt buộc")
    .refine((val) => !isNaN(parseInt(val)), "Số lượng phải là số nguyên")
    .refine((val) => parseInt(val) >= 0, "Số lượng không được âm"),

  cost_price: z
    .string()
    .refine(
      (val) => val === "" || !isNaN(parseFloat(val)),
      "Giá vốn phải là số"
    )
    .refine(
      (val) => val === "" || parseFloat(val) >= 0,
      "Giá vốn không được âm"
    )
    .optional()
    .or(z.literal("")),

  discount_percentage: z
    .string()
    .refine(
      (val) => val === "" || !isNaN(parseFloat(val)),
      "Phần trăm giảm giá phải là số"
    )
    .refine(
      (val) => val === "" || (parseFloat(val) >= 0 && parseFloat(val) <= 100),
      "Phần trăm giảm giá phải từ 0 đến 100"
    )
    .optional()
    .or(z.literal("")),

  sold_count: z
    .string()
    .refine(
      (val) => val === "" || !isNaN(parseInt(val)),
      "Số lượng đã bán phải là số nguyên"
    )
    .refine(
      (val) => val === "" || parseInt(val) >= 0,
      "Số lượng đã bán không được âm"
    )
    .optional()
    .or(z.literal("")),

  featured: z.boolean().default(false),

  author_ids: z.array(z.number()).min(1, "Vui lòng chọn ít nhất 1 tác giả"),

  category_ids: z.array(z.number()).min(1, "Vui lòng chọn ít nhất 1 danh mục"),
});
