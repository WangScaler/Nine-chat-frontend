<template>
  <form class="person">
    <div class="info_li">
        <span class="menu">用户头像:</span>
        <img class="avatar content" id="avatar" :src="form.user_avatar" @click="changeAvatar" />
        <input type="file" name="upload" id="upload" accept="image/png, image/jpeg"  @change="uploadAvatar"/>
    </div>
    <div class="info_li">
        <span class="menu">用户名:</span>
        <span class="content">{{userInfo.user_name}}</span>
    </div>
    <div class="info_li">
        <span class="menu">昵称:</span>
        <input v-model="form.user_nick" type="text" class="edit" />
    </div>
    <div class="info_li">
        <span class="menu">邮箱:</span>
        <span class="content">{{userInfo.user_email}}</span>
    </div>
    <div class="info_li">
        <span class="menu">个性签名:</span>
        <textarea v-model="form.user_sign" rows="3" cols="20" class="edit" style="resize: none" />
    </div>
    <div class="info_li confirm">
      <button class="btn" @click="confirm">保存</button>
    </div>
  </form>
</template>
<script>
import axios from "axios";
export default {
  name: "Person",
  data() {
    return {
      form: {
        user_sign: '',
        user_nick: '',
        user_avatar: ''
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  mounted() {
    this.form = this.userInfo
  },
  methods: {
    confirm() { 
      this.$emit('update', this.form)
    },
    changeAvatar() {
      document.getElementById('upload').click()
      
    },
    uploadAvatar() {
      const p =  document.getElementById('upload').files[0]
      // 转blob
      this.form.user_avatar = URL.createObjectURL(p)
      if (!p ) {
            return;
        }
        const formData = new FormData();
        formData.append('file', p );
        // 将图片的文件流上传到服务器
        let config = {
        headers: {
          'Access-Control-Allow-Origin': '*'
       }
      }
        axios.post('http://love.wangscaler.com/love/file/upload', formData ,config).then(res => {
        const orgin_url = res.data.data.url;
        const url = orgin_url.replace('https://www.scalerwang.com/blog/', "https://blog.wangscaler.com/");
        this.form.user_avatar = url;
    })
      // 转base64
      // const reader = new FileReader()
      // reader.readAsDataURL(p)
      // reader.onload = () => {
      //   this.form.user_avatar = reader.result
      // }
    }
  }
};
</script>
<style lang="less" scoped>
.person {
    padding: 10px 15px;
    .info_li {
      height: 70px;
      .avatar {
          width: 15%;
      }
      .avatar:hover {
        cursor: pointer;
      }
      .menu {
          display: inline-block;
          width: 60px;
      }
      .content {
          display: inline-block;
          margin-left: 40px;
      }
      .edit {
        margin-left: 40px;
        width: 180px;
        font-size: 16px;
        border: 0px;
        vertical-align: middle;
      }
      .btn {
        float: right;
      }
      #upload {
        display: none;
      }
    }
}
</style>
