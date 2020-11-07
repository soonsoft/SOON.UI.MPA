/**
 * 页面配置
 * js: 从src/page目录下开始
 * layout: 从src/template目录下开始
 * url: 编译后js文件和html文件存放的位置
 */
module.exports = [
      {
         name: "home",
         url: "",
         layout: "",
         js: "home/home.js"
      },
      {
         name: "manage",
         url: "",
         layout: "menu-layout.ejs",
         js: "manage/manage.js"
      },
      {
         name: "about",
         url: "",
         layout: "",
         js: "about/about.js"
      }
 ];