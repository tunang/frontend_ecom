import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Tag, Percent, DollarSign, Calendar } from "lucide-react";
import { toast } from "sonner";
import CouponService from "@/services/coupon.service";

const CouponForm = ({ open, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent_off", // percent_off or amount_off
    discountValue: "",
    duration: "once", // once or forever
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      toast.error("Please enter coupon code");
      return false;
    }

    if (!formData.discountValue || parseFloat(formData.discountValue) <= 0) {
      toast.error("Discount value must be greater than 0");
      return false;
    }

    if (
      formData.discountType === "percent_off" &&
      parseFloat(formData.discountValue) > 100
    ) {
      toast.error("Discount percentage cannot exceed 100%");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const data = {
        code: formData.code.trim().toUpperCase(),
        duration: formData.duration,
      };

      // Thêm percent_off hoặc amount_off dựa vào discountType
      if (formData.discountType === "percent_off") {
        data.percent_off = parseFloat(formData.discountValue);
      } else {
        data.amount_off = parseFloat(formData.discountValue);
      }

      await CouponService.admin.createCoupon(data);
      toast.success("Coupon created successfully!");

      // Reset form
      setFormData({
        code: "",
        discountType: "percent_off",
        discountValue: "",
        duration: "once",
      });

      onSuccess();
    } catch (error) {
      console.error("Error creating coupon:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Failed to create coupon";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (newOpen) => {
    if (!newOpen) {
      // Reset form when closing
      setFormData({
        code: "",
        discountType: "percent_off",
        discountValue: "",
        duration: "once",
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Tag className="w-6 h-6 text-amber-600" />
            Create New Coupon
          </DialogTitle>
          <DialogDescription>
            Create a new discount code for customers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              Coupon code
            </Label>
            <Input
              id="code"
              name="code"
              type="text"
              placeholder="E.g: FALLPROMO"
              value={formData.code}
              onChange={handleInputChange}
              required
              className="uppercase"
            />
            <p className="text-sm text-gray-500">
              Code will be automatically converted to uppercase
            </p>
          </div>

          {/* Discount Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-600" />
              Discount type
            </Label>
            <Select
              value={formData.discountType}
              onValueChange={(value) => handleChange("discountType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent_off">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Percentage (%)
                  </div>
                </SelectItem>
                <SelectItem value="amount_off">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Fixed amount ($)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <Label htmlFor="discountValue" className="flex items-center gap-2">
              {formData.discountType === "percent_off" ? (
                <Percent className="w-4 h-4 text-amber-600" />
              ) : (
                <DollarSign className="w-4 h-4 text-amber-600" />
              )}
              Discount value
            </Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              step="0.01"
              min="0"
              max={formData.discountType === "percent_off" ? "100" : undefined}
              placeholder={
                formData.discountType === "percent_off"
                  ? "E.g: 15"
                  : "E.g: 10.00"
              }
              value={formData.discountValue}
              onChange={handleInputChange}
              required
            />
            <p className="text-sm text-gray-500">
              {formData.discountType === "percent_off"
                ? "Enter discount percentage (0-100)"
                : "Enter discount amount (USD)"}
            </p>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              Duration
            </Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => handleChange("duration", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {formData.duration === "once"
                ? "Coupon can only be used once per customer"
                : "Coupon can be used multiple times"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4 mr-2" />
                  Create coupon
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CouponForm;
