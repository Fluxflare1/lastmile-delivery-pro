export const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard": ["owner", "manager", "dispatcher"],
  "/order-management": ["owner", "manager", "dispatcher"],
  "/courier-management": ["owner", "manager"],
  "/analytics": ["owner", "manager"],
  "/settings": ["owner"],
};

export const hasAccess = (role: string, pathname: string): boolean => {
  for (const route in ROLE_PERMISSIONS) {
    if (pathname.startsWith(route) && ROLE_PERMISSIONS[route].includes(role)) return true;
  }
  return false;
};



const roleAccessMap = {
  Owner: ["dashboard", "orders", "couriers", "analytics", "settings"],
  Manager: ["dashboard", "orders", "analytics"],
  Dispatcher: ["dashboard", "orders"],
};
