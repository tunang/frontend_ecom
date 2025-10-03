import { useEffect, useState } from "react";
import AddressService from "@/services/address.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import AddressForm from "./AddressForm";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await AddressService.getAddresses();
      setAddresses(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải địa chỉ:", error);
      toast.error("Không thể tải danh sách địa chỉ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await AddressService.deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      setDeletePopoverOpen(null);
      toast.success("Đã xóa địa chỉ");
    } catch (error) {
      toast.error("Không thể xóa địa chỉ");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await AddressService.setDefaultAddress(id);
      // Refresh addresses to get updated default status
      fetchAddresses();
      toast.success("Đã đặt làm địa chỉ mặc định");
    } catch (error) {
      toast.error("Không thể đặt địa chỉ mặc định");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-amber-600 mx-auto" />
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Địa chỉ của tôi</h1>
            <p className="text-gray-600 mt-1">
              Quản lý địa chỉ giao hàng của bạn
            </p>
          </div>
          <Button
            onClick={handleAddNew}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Thêm địa chỉ mới
          </Button>
        </div>

        {/* Address List */}
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <MapPin className="h-24 w-24 text-gray-300 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Chưa có địa chỉ nào
              </h2>
              <p className="text-gray-500 mb-6">
                Thêm địa chỉ giao hàng để mua sắm dễ dàng hơn
              </p>
              <Button
                onClick={handleAddNew}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Thêm địa chỉ đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((address) => (
  <Card
    key={address.id}
    className={`overflow-hidden transition-all hover:shadow-lg ${
      address.is_default ? "border-2 border-amber-500 bg-amber-50/30" : "border border-gray-200"
    }`}
  >
    <CardContent className="flex justify-between p-6">
      {/* Default Badge */}
      {address.is_default && (
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full">
          <CheckCircle className="h-4 w-4" />
          <span className="font-semibold text-sm">Địa chỉ mặc định</span>
        </div>
      )}

      <div className="space-y-3">
        {/* Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <p className="font-semibold text-gray-900 text-lg">
            {address.first_name} {address.last_name}
          </p>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <Phone className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-gray-700">{address.phone}</p>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-gray-700 leading-relaxed">
            <p>{address.address_line_1}</p>
            {address.address_line_2 && <p>{address.address_line_2}</p>}
            <p>
              {address.city}, {address.state}
            </p>
            <p>
              {address.postal_code}, {address.country}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2">
        {/* {!address.is_default && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSetDefault(address.id)}
            className="flex-1 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300"
            title="Đặt làm địa chỉ mặc định"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Đặt mặc định
          </Button>
        )} */}
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(address)}
          className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
          title="Chỉnh sửa địa chỉ"
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        {/* Delete with Popover Confirmation */}
        <Popover
          open={deletePopoverOpen === address.id}
          onOpenChange={(open) =>
            setDeletePopoverOpen(open ? address.id : null)
          }
        >
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
              title="Xóa địa chỉ"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Xác nhận xóa địa chỉ
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Bạn có chắc muốn xóa địa chỉ này? Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletePopoverOpen(null)}
                  className="flex-1"
                  disabled={deletingId === address.id}
                >
                  Hủy
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={deletingId === address.id}
                >
                  {deletingId === address.id ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-1" />
                      Đang xóa...
                    </>
                  ) : (
                    "Xóa"
                  )}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </CardContent>
  </Card>
))}
          </div>
        )}

        {/* Address Form Dialog */}
        <AddressForm
          address={editingAddress}
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          onSuccess={handleFormSuccess}
        />
      </div>
    </div>
  );
};

export default Address;
