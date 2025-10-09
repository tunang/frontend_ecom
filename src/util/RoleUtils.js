// Constants cho các roles
export const ROLES = {
  USER: 'user',
  STAFF: 'staff',
  ADMIN: 'admin'
};

// Object chứa các hàm kiểm tra role
export const RoleChecker = {
  // Kiểm tra xem có phải là user không
  isUser: (role) => role === ROLES.USER,
  
  // Kiểm tra xem có phải là staff không
  isStaff: (role) => role === ROLES.STAFF,
  
  // Kiểm tra xem có phải là admin không
  isAdmin: (role) => role === ROLES.ADMIN,
  
  // Kiểm tra xem có phải là staff hoặc admin không (có quyền quản lý)
  isStaffOrAdmin: (role) => role === ROLES.STAFF || role === ROLES.ADMIN,
  
  // Lấy tên hiển thị của role
  getRoleDisplayName: (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'Admin';
      case ROLES.STAFF:
        return 'Staff';
      case ROLES.USER:
        return 'User';
      default:
        return 'Unknown';
    }
  },
  
  // Lấy class CSS cho badge của role
  getRoleBadgeClass: (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case ROLES.STAFF:
        return 'bg-green-100 text-green-800';
      case ROLES.USER:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
};

// Hàm helper để kiểm tra nhanh role từ user object
export const checkUserRole = (user) => {
  if (!user || !user.role) {
    return {
      isUser: false,
      isStaff: false,
      isAdmin: false,
      isStaffOrAdmin: false,
      role: null
    };
  }
  
  const role = user.role.toLowerCase();
  
  return {
    isUser: RoleChecker.isUser(role),
    isStaff: RoleChecker.isStaff(role),
    isAdmin: RoleChecker.isAdmin(role),
    isStaffOrAdmin: RoleChecker.isStaffOrAdmin(role),
    role: role
  };
};