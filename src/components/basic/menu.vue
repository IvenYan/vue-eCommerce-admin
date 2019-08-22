<template>
  <div class="menus">
    <el-menu
      background-color="#666"
      text-color="#ccc"
      :collapse="collapsed"
      class="slidebar"
      router
      theme="dark"
    >
      <el-submenu v-for="(v, k) in menus" :key="k" :index="v.menuName">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span slot="title">{{v.menuName}}</span>
        </template>
        <el-menu-item
          v-for="(item, key) in v.childMenu"
          :key="key"
          :index="item.route.path"
        >{{item.menuName}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import bus from "../../tools/bus.js";
export default {
  name: "menus",
  data() {
    return {
      collapsed: false,
      menus: [
        {
          route: {
            path: "/system/product"
          },
          menuName: "产品管理",
          icon: "el-icon-toilet-paper",
          childMenu: [
            {
              route: {
                path: "/system/product"
              },
              menuName: "产品管理",
              childMenu: []
            }
          ]
        },
        {
          route: {
            path: "/system/product"
          },
          menuName: "订单管理",
          icon: "el-icon-toilet-paper",
          childMenu: [
            {
              route: {
                path: "/system/product"
              },
              menuName: "订单列表",
              childMenu: []
            },
            {
              route: {
                path: "/system/product"
              },
              menuName: "订单下载",
              childMenu: []
            }
          ]
        },
        {
          menuName: "亚马逊",
          icon: "el-icon-news",
          childMenu: [
            {
              route: {
                path: "/system/upload"
              },
              menuName: "亚马逊上传",
              childMenu: []
            },
            {
              route: {
                path: "/system/upload_result"
              },
              menuName: "产品明细",
              childMenu: []
            },
            {
              route: {
                path: "/system/upload_result"
              },
              menuName: "更新产品",
              childMenu: []
            },
            {
              route: {
                path: "/system/upload_result"
                // component:upload_result
              },
              menuName: "上传结果",
              childMenu: []
            },
            {
              route: {
                path: "/system/upload_result"
              },
              menuName: "更新失败",
              childMenu: []
            },
            {
              route: {
                path: "/system/upload_result"
              },
              menuName: "失败列表",
              childMenu: []
            }
          ]
        }
      ]
    };
  },
  mounted() {
    bus.$on("collapsed", () => {
      this.collapsed = !this.collapsed;
    });
  }
};
</script>

<style>
.menus {
  display: inline-block;
  float: left;
}
.slidebar {
  height: 100%;
  width: 210px;
}
.el-menu--collapse {
  width: 64px;
}
</style>
