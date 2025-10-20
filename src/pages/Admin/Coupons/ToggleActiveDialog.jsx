import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import CouponService from "@/services/coupon.service";

const ToggleActiveDialog = ({ open, coupon, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!coupon) return null;

  const newActiveStatus = !coupon.active;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      await CouponService.admin.updateCoupon(coupon.id, {
        active: newActiveStatus,
      });

      toast.success(
        newActiveStatus
          ? "Coupon activated successfully!"
          : "Coupon deactivated successfully!"
      );

      onSuccess();
    } catch (error) {
      console.error("Error toggling coupon:", error);
      const errorMessage =
        error.response?.data?.errors?.[0] || "Failed to update coupon";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {newActiveStatus ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                Activate Coupon
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-600" />
                Deactivate Coupon
              </>
            )}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {newActiveStatus ? (
              <span>
                Are you sure you want to <strong>activate</strong> this coupon?
              </span>
            ) : (
              <span>
                Are you sure you want to <strong>deactivate</strong> this coupon?
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Coupon Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Coupon code:</span>
            <span className="font-mono font-semibold text-gray-900">
              {coupon.code}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Discount:</span>
            <span className="font-medium text-gray-900">
              {coupon.percent_off
                ? `${coupon.percent_off}%`
                : `$${parseFloat(coupon.amount_off).toFixed(2)}`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current status:</span>
            {coupon.active ? (
              <span className="text-green-600 font-medium">Active</span>
            ) : (
              <span className="text-red-600 font-medium">Inactive</span>
            )}
          </div>
        </div>

        {/* Warning */}
        <div
          className={`flex items-start gap-3 p-3 rounded-lg ${
            newActiveStatus
              ? "bg-green-50 border border-green-200"
              : "bg-amber-50 border border-amber-200"
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              newActiveStatus ? "text-green-600" : "text-amber-600"
            }`}
          />
          <div className="flex-1">
            <p
              className={`text-sm ${
                newActiveStatus ? "text-green-800" : "text-amber-800"
              }`}
            >
              {newActiveStatus ? (
                <>
                  Once activated, this coupon can be used by customers.
                </>
              ) : (
                <>
                  Once deactivated, this coupon cannot be used anymore. You can
                  reactivate it later.
                </>
              )}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={
              newActiveStatus
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : newActiveStatus ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Activate
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-2" />
                Deactivate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ToggleActiveDialog;
