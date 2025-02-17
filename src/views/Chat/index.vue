<template>
  <div class="chat">
    <div class="chat-container" v-if="isPassJoin">
      <div class="chat-container-header">
        <chat-header />
      </div>
      <div class="chat-container-content">
        <message-panel />
      </div>
      <div class="chat-container-progress">
        <chat-progress />
      </div>
      <div class="chat-container-footer">
        <chat-message-frame />
        <chat-lrc />
      </div>
    </div>
    <div>
      <sign-in />
      <sign-up />
      <music-player />
      <Popup
        :show="showPopup"
        :width="'300px'"
        title="欢迎加入聊天室"
        top="45vh"
        lock
        @close="closePopup"
        :showCloseBtn="false"
      >
        <div :style="{ marginLeft: '20px' }">
          注意：1、将自动播放音乐，声音很大，提前减小音量
               2、人多配置差，多刷新几遍，看见聊天记录才算成功
        </div>
        <div slot="footer">
          <btn theme="gradient" @click="passJoin">确认加入</btn>
        </div>
      </Popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageFrame from "@/components/chat/ChatMessageFrame";
import ChatLrc from "@/components/chat/ChatLrc";
import MessagePanel from "@/components/chat/MessagePanel";
import MusicPlayer from "@/components/chat/MusicPlayer";
import ChatProgress from "@/components/chat/ChatProgress";
import Popup from "@/components/Popup";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import Btn from "@/components/Btn";
import { mapActions, mapMutations, mapState } from "vuex";
import { history } from "@/api/chat";

export default {
  components: {
    ChatHeader,
    SignIn,
    SignUp,
    ChatMessageFrame,
    ChatLrc,
    MessagePanel,
    MusicPlayer,
    ChatProgress,
    Popup,
    Btn,
  },
  data() {
    return {
      showPopup: true,
      isPassJoin: false,
    };
  },
  sockets: {
    /* 初次连接成功加入聊天室 */
    connect() {
      // this.$message.success("成功加入聊天室了哟");
    },
    /* 携带的token没有通过校验、禁止用户做任何操作 */
    authFail(data) {
      this.loginAgain(data);
    },
    /* 初始化房间信息、获取音乐详情 */
    async initRoom(data) {
      this.updateMusicInfo(data);
      this.$message.success(data.msg);
    },
    /* 用户上线了、更新在线列表、添加新用户上线消息提示、获取房间信息公告 */
    async online(data) {
      await this.getHistoryMessage();
      const { msg, onlineUser } = data
      this.setOnlineUserList(onlineUser);
      this.setMessageDataList({ message_type: "info", message_content: msg });
      this.initNotice();
    },
    async offline(data) {
      const { msg, onlineUser } = data
      this.setOnlineUserList(onlineUser);
      this.setMessageDataList({ message_type: "info", message_content: msg });
    },
    /* 来了一条新消息 */
    message(data) {
      this.setMessageDataList(data.data);
    },
    /* 歌曲切换、到新歌曲了 */
    switchMusic(data) {
      const { msg, musicInfo } = data
      this.updateMusicInfo(musicInfo);
      this.setMessageDataList({ message_type: "info", message_content: msg });
    },
    /* 服务端来了新的消息提示 */
    notice(data) {
      this.setMessageDataList(data);
      console.log(data);
    },
    /* 来自服务端的message消息提示 */
    tips(data) {
      const { code, msg } = data
      code === 1 && this.$message.success(msg)
      code === -1 && this.$message.error(msg)
    },
    /* 有新的点的歌曲信息、更新队列歌单并消息提示 */
    chooseMusic(data){
      const { queue_music_list, msg } = data;
      this.setMessageDataList({ message_type: "info", message_content: msg });
      this.setQueueMusicList(queue_music_list);
    }
  },
  methods: {
    ...mapActions(["toggleSignInPopup", "initGetInfo"]),
    ...mapMutations([
      "setIsLogin",
      "setOnlineUserList",
      "setMessageDataList",
      "setCurrentMusicInfo",
      "setCurrentMusicStartTime",
      "setQueueMusicList",
    ]),
    /* 调用一个开发API拿到用户位置的js */
    initUserAddress() {
      if (!document.querySelector("#address")) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "address";
        script.src = "https://pv.sohu.com/cityjson?ie=utf-8";
        document.head.appendChild(script);
      }
    },
    /* 初始化ws需要参数携带token前去校验 连接后挂载在全局 */
    async initSocket() {
      const token = localStorage.chat_token;
      const userInfo = this.$store.state.userInfo;
      if (!token) {
        this.toggleSignInPopup(true); // 没有登录信息，强制用户登录
      } else if (!window.returnCitySN) {
        // 没有插入获取位置信息脚本，等待插入script完毕
        setTimeout(() => this.initSocket(), 50);
      } else {
        if (!userInfo) {
          /* 如果有token没有个人信息就获取下，暂时用不到也可以不拿 */
          await this.initGetInfo(token);
          this.setIsLogin(true);
        }
        const { cname } = window.returnCitySN;
        this.$socket.client.io.opts.query = { token, address: cname };
        this.$socket.client.open();
       
        // Vue.prototype.$socket = this.$socket
        
       
      }
    },
    /* 权限校验失败，重新登录 */
    loginAgain(data) {
      data && this.$message.error(data.msg);
      this.toggleSignInPopup(true);
    },
    /* 初始化房间信息、到点歌曲切换都走这里 */
    updateMusicInfo(data) {
      const {
        music_info,
        music_lrc,
        music_src,
        music_start_time,
        queue_music_list,
      } = data;
      this.setQueueMusicList(queue_music_list);
      this.setCurrentMusicInfo({ music_info, music_lrc, music_src });
      music_start_time && this.setCurrentMusicStartTime(music_start_time);
    },
    /* TODO 上拉加载更多 */
    async getHistoryMessage() {
      const res = await history();
      this.setMessageDataList(res.data);
    },
    /* TODO 需要作为可配置项房间信息 */
    initNotice() {
      setTimeout(() => {
        this.$socket.client.connected &&
          this.setMessageDataList({
            message_type: "notice",
            message_content: [
              "欢迎来到WangScaler的听歌房、欢迎点歌、欢迎各位朋友的到来、一起安安静静听歌吧。",
              "1.本房间禁止任何违法非法行为。",
              "2.禁止谈论关于色情、政治等任何敏感信息。",
              "3.聊天室属于开放平台，有任何以上行为与本人无关。",
              "4.本房间属于开源项目的测试平台。非运行上线产品。",
              "5.如果有以上行为，请及时举报至Q/V:1349320519。",
              "6.感谢nihao、spirit资金支持，九二的书屋、摸鱼大王、古月_歌代码贡献",
              "7.祝大家新年快乐，虎年大吉。",
            ],
          });
      }, 1000);
    },
    /* 关闭弹窗 */
    closePopup() {
      this.showPopup = false;
    },
    /* 确认加入房间 */
    passJoin() {
      this.isPassJoin = true;
      this.showPopup = false;
      this.initSocket();
    }
  },
  created() {},
  mounted() {
     this.initUserAddress();
  },
  watch: {
    isLogin(n) {
      n && this.initSocket();
    },
  },
  computed: {
    ...mapState(["isLogin"]),
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 720px) {
  .chat-container {
    position: fixed;
    width: 100vw !important;
    height: 100vh !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: 0 !important;
    border-radius: 0 !important;
  }
}
.chat {
  width: 100vw;
  height: 100vh;
  background: url("https://chat.wangscaler.com/1636699165011bg.jpegg");
  background: url("https://chat.wangscaler.com/banner_111.a6be22c.gif");
  &-container {
    position: fixed;
    left: 8%;
    right: 8%;
    top: 8%;
    bottom: 8%;
    transition: all 0.5s;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 0 20px #f1f1f1;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 1;
    &-header {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #eee;
    }
    &-content {
      flex: 1;
      height: 0;
      position: relative;
      padding: 20px;
    }
    &-progress {
      height: 2px;
      margin-bottom: 5px;
    }
    &-footer {
      // padding: 0 18px;
    }
  }
}
</style>
