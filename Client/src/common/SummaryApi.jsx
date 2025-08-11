export const dbUrl = import.meta.env.VITE_API_UR;

export const SummaryApi = {
  Register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  verifyEmail: {
    url: "/api/user/verify-email",
    method: "post",
  },
  forgotpassword: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  verifyotp: {
    url: "/api/user/verify-forgot-password",
    method: "put",
  },
  resetpassword: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "post",
  },
  userdetails: {
    url: "/api/user/user-details",
    method: "get",
  },
  logout: {
    url: "/api/user/logout",
    method: "post",
  },
  updateUser: {
    url: "/api/user/update-user",
    method: "put"
  },
   uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "put"
  },
  addcategory: {
    url: "/api/category/add",
    method: "post"
  },
  Uploadimage: {
    url: "/api/upload/upload-image",
    method: "post"
  },
  getallcategory: {
    url: "/api/category/",
    method: "get"
  },
  editcategory: {
    url: "/api/category/update-category",
    method: "put"
  },
  deletecategory: {
    url: "/api/category/delete-category",
    method: "delete"
  },
  Addsubcategory: {
    url: "/api/sub-category/add",
    method: "post"
  },
  Getsubcategories: {
    url: "/api/sub-category/",
    method: "get"
  },
  Editsubcategory: {
    url: "/api/sub-category/update-subcategory",
    method: "put"
  },
  Deletesubcategory: {
    url: "/api/sub-category/delete",
    method: "delete"
  },
  Addproduct: {
    url: "/api/product/add-product",
    method: "post"
  },
  Getproducts: {
    url: "/api/product/get-all",
    method: "post"
  },
  Updateproduct: {
    url: "/api/product/update",
    method: "put"
  },
  Deleteproduct: {
    url: "/api/product/delete",
    method: "delete"
  },
  Getproductbycategory: {
    url: "/api/product/get-product-bycategory",
    method: "post"
  },
  Getproductbycategoryandsubcategory: {
    url: "/api/product/get-product-bycategory-and-subcategory",
    method: "post"
  },
  GetProductDetails: {
    url: "/api/product/get-product-details",
    method: "post"
  },
  AddToCart: {
    url: "/api/cart/add",
    method: "post"
  },
  GetCart: {
    url: "/api/cart/get",
    method: "get"
  },
  UpdateCart: {
    url: "/api/cart/update",
    method: "post"
  },
  DeleteCart: {
    url: "/api/cart/delete",
    method: "delete"
  },
  AddAddress: {
    url: "/api/address/",
    method: "post"
  },
  GetAddress: {
    url: "/api/address/",
    method: "get"
  },
  UpdateAddress: (id) => ({
    url: `/api/address/${id}`,
    method: "put"
  }),
  DeleteAddress: (id) => ({
    url: `/api/address/${id}`,
    method: "delete"
  })


}


