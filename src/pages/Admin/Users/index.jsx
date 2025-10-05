import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const AdminUsersPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý người dùng
        </h1>
        <p className="text-gray-600">
          Quản lý tài khoản người dùng trong hệ thống
        </p>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-12 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Quản lý người dùng
          </h3>
          <p className="text-gray-600">Chức năng đang được phát triển</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;

