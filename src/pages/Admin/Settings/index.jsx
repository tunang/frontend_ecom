import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, DollarSign, Percent, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SettingService from "@/services/setting.service";

const AdminSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    tax_rate: "",
    shipping_cost: "",
  });

  // Fetch settings khi component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await SettingService.admin.getSettings();
      if (response.data) {
        setSettings({
          tax_rate: response.data.tax_rate || "",
          shipping_cost: response.data.shipping_cost || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Cannot load settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Chỉ cho phép số và dấu chấm
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const taxRate = parseFloat(settings.tax_rate);
    const shippingCost = parseFloat(settings.shipping_cost);

    if (isNaN(taxRate) || taxRate < 0 || taxRate > 1) {
      toast.error("Tax rate must be between 0 and 1 (0.08 = 8%)");
      return false;
    }

    if (isNaN(shippingCost) || shippingCost < 0) {
      toast.error("Shipping cost must be a positive number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);

      const data = {
        tax_rate: parseFloat(settings.tax_rate),
        shipping_cost: parseFloat(settings.shipping_cost),
      };

      await SettingService.admin.updateSettings(data);
      toast.success("Update settings successfully!");
      
      // Refresh settings để lấy dữ liệu mới nhất
      await fetchSettings();
    } catch (error) {
      console.error("Error updating settings:", error);
      const errorMessage = error.response?.data?.errors?.[0] || "Update settings failed";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System settings</h1>
        <p className="text-gray-600">Manage system configuration</p>
      </div>

      {/* Settings Form */}
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-amber-600" />
              Payment configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tax Rate */}
                <div className="space-y-2">
                  <Label htmlFor="tax_rate" className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-amber-600" />
                    Tax rate (Tax Rate)
                  </Label>
                  <Input
                    id="tax_rate"
                    name="tax_rate"
                    type="text"
                    placeholder="0.08"
                    value={settings.tax_rate}
                    onChange={handleChange}
                    required
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500">
                    Enter a value between 0 and 1. For example: 0.08 for 8%, 0.1 for 10%
                  </p>
                  {settings.tax_rate && (
                    <p className="text-sm font-medium text-amber-600">
                      = {(parseFloat(settings.tax_rate) * 100).toFixed(2)}%
                    </p>
                  )}
                </div>

                {/* Shipping Cost */}
                <div className="space-y-2">
                  <Label htmlFor="shipping_cost" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    Shipping cost (Shipping Cost)
                  </Label>
                  <Input
                    id="shipping_cost"
                    name="shipping_cost"
                    type="text"
                    placeholder="7.5"
                    value={settings.shipping_cost}
                    onChange={handleChange}
                    required
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500">
                    Enter the shipping cost (USD). For example: 5, 7.5, 10
                  </p>
                  {settings.shipping_cost && (
                    <p className="text-sm font-medium text-amber-600">
                      = ${parseFloat(settings.shipping_cost).toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save settings
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchSettings}
                    disabled={isSaving || isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Note:</h4>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Tax rate will be applied to all orders</li>
              <li>Shipping cost is a fixed cost for each order</li>
              <li>Changing settings will apply immediately to new orders</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;

