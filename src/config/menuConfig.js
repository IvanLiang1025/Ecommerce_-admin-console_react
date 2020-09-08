

const menuList = [
  {
    title: "Home",
    key: "/home",
    iconType: "home",
    route: "/home"
  },
  {
    title: "Goods Management",
    key: "/goods",
    iconType: "appstore",
    children: [
      {
        title: "Categories",
        key: "/category",
        iconType: "profile",
        route: "/category"
      },
      {
        title: "Products",
        key: "/product",
        iconType: "project",
        route: "/product"
      }
    ]
  },
  {
    title: "Orders",
    key: "/orders",
    iconType: "shop",
    route: "/orders"
  },
  {
    title: "Users",
    key: "/users",
    iconType: "user",
    route: "/users"
  },

]


export default menuList;

// export const menuList = {
//     profile: {
//         title: "Profile",
//         key: "1"
//     },
//     goods: {
//         title: "Goods Management",
//         key: "2",
//         children: {
//             category: {
//                 title: "Categories",
//                 key: "2.1"
//             },

//         }
//     }

// };