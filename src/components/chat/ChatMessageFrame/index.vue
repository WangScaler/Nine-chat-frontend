<template>
  <div class="message-frame">
    <chat-toolbar @emotion="handlerEmotion" />
    <textarea
      ref="messageInput"
      v-model.trim="message"
      id="textarea"
      class="message-frame-input"
      @keydown.13="sendMsg"
      @paste="pasting"
    >
    </textarea>
    <dialog id="myDialog">
      <img :src="url" alt="" id="img"><br/>
      <button class="btn_pic" @click="sendPic">发送</button>
      <button class="btn_pic" @click="closePic">取消</button> 
    </dialog>
  </div>
</template>

<script>
import ChatToolbar from "@/components/chat/ChatToolbar";
import axios from "axios";
export default {
  components: { ChatToolbar },
  data() {
    return {
      message: "",
      url: '',
      first_url: '',
      width: null,
      height: null
    };
  },
  methods: {
    submit(data) {
      this.$socket.client.emit("message", data);
      this.$nextTick(() => {
        this.$scorllToBottom();
      });
      this.message = "";
    },
    sendMsg(e) {
      if (this.message) {
        let data ;
        data = { message_type: "text", message_content: this.message };
        this.submit(data)
        e.preventDefault();
      }
    },
    pasting() {},
    sendPic() {
      document.getElementById('myDialog').open = false
      this.message = this.first_url
      let data
      data = { message_type: "url", message_content: this.message }
      this.submit(data)
      this.first_url = ""
      this.url = ""
    },
    closePic() {
      document.getElementById('myDialog').open = false
      this.first_url = ""
      this.url = ""
    },
    handlerEmotion(emoji) {
      this.message += `[${emoji.text}]`;
    },
  },
  created() {},
  mounted() {

},
  watch: {},
  computed: {},
};
</script>
<style lang="less" scoped>
.message-frame {
  position: relative;
  width: 100%;
  .progress {
    width: 100%;
    height: 2px;
  }
  &-input {
    width: 100%;
    overflow: hidden;
    position: relative;
    height: 50px;
    padding: 10px 15px;
    resize: none;
    outline: none;
    border: none;
    font-size: 13px;
    background-color: transparent;
  }
  #myDialog {
    position:  absolute;
    width: 500px;
    height: 330px;
    bottom: 120px;
    border: 0px;
    img {
      max-width: 500px;
      width: 500px;
      max-height: 280px;
      height: 280px;
    }
  }
  .btn_pic {
    margin-top: 15px;
    margin-left: 10px;
    float: right;
  }
}
</style>
