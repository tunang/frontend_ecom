import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
        <p className="text-gray-600">Cấu hình hệ thống</p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-12 text-center">
          <Settings className="w-16 h-16 mx-auto mb-4 text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Cài đặt</h3>
          <p className="text-gray-600">Chức năng đang được phát triển</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettingsPage;

