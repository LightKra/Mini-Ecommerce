// Query Keys
export { queryKeys } from './query-keys';

// Auth Hooks
export { useRegister, useLogin, useLogout, useRefreshToken } from './use-auth';

// Users Hooks
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from './use-users';

// Roles Hooks
export {
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from './use-roles';

// Categories Hooks
export {
  useCategories,
  useCategory,
  useCategoryBySlug,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from './use-categories';

// Products Hooks
export {
  useProducts,
  useProduct,
  useProductBySlug,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useAddProductImage,
  useRemoveProductImage,
} from './use-products';

// Cart Hooks
export {
  useCart,
  useCartTotal,
  useAddToCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from './use-cart';

// Addresses Hooks
export {
  useAddresses,
  useAddress,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from './use-addresses';

// Orders Hooks
export {
  useOrders,
  useAdminOrders,
  useOrder,
  useCreateOrder,
  useUpdateOrderStatus,
  useCancelOrder,
} from './use-orders';

