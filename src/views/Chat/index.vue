<template>
<!-- <<<<<<< HEAD
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
          注意：将自动播放音乐（声音很大、提前减小音量）
        </div>
        <div slot="footer">
          <btn theme="gradient" @click="passJoin">确认加入</btn>
        </div>
      </Popup>
    </div>
  </div>
======= -->
	<div class="chat" :style="{ backgroundImage: `url(${room_bg})` }">
		<transition name="message-panel" mode="out-in">
			<div v-show="showChatPanle" class="chat-container">
				<div class="chat-container-header">
					<chat-header ref="header" />
				</div>
				<div class="chat-container-content">
					<message-panel :stop-loadmore="stopLoadmore" @loadHistoryMessage="handlerLoadHistoryMessage" @quoteMessage="handlerQuoteMessage" />
					<transition name="msg-tips" mode="out-in">
						<div v-if="un_read_msg_num" class="un-read" @click="handleToBotton">有{{ un_read_msg_num }}条新消息</div>
					</transition>
				</div>
				<div class="chat-container-progress">
					<chat-progress />
				</div>
				<div class="chat-container-footer">
					<chat-message-frame ref="messageFrame" />
					<chat-lrc />
				</div>
				<pre-img :data="pre_img" />
			</div>
		</transition>

		<bullet-chat v-show="!showChatPanle" />
		<music-player ref="minePlayer" />
	</div>
<!-- >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0 -->
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessageFrame from "@/components/chat/ChatMessageFrame";
import ChatLrc from "@/components/chat/ChatLrc";
import MessagePanel from "@/components/chat/MessagePanel";
import MusicPlayer from "@/components/chat/MusicPlayer";
import ChatProgress from "@/components/chat/ChatProgress";
import PreImg from "@/components/preImg";
import bulletChat from '@/components/bulletChat'
import { setTheme } from "@/theme";

import { history } from "@/api/chat";
import config from "@/config/index";

const { default_room_bg } = config;

export default {
  components: {
    ChatHeader,
    ChatMessageFrame,
    ChatLrc,
    MessagePanel,
    MusicPlayer,
    ChatProgress,
    PreImg,
    bulletChat
  },
  data() {
    return {
      showPopup: true,
      lock: true, // 用户确认进入房间后才能解锁 之后允许使用快捷键
      showChatPanle: false, // 是否现在聊天窗口
      stopLoadmore: false, // 是否加载完了历史消息
      messageParams: {
        page: 1,
        pagesize: 20,
      },
    };
  },
  sockets: {
    /* 连接成功后初始化房间信息 */
    connect() {
      this.initLocalStorageConfig();
      this.getRoomInfo();
    },

    /* 携带的token没有通过校验、禁止用户做任何操作 */
    authFail(data) {
      data && this.$message.error(data.msg);
      this.logout();
    },

    /* 初始化房间信息、获取音乐详情 */
    async initRoom(data) {
      await this.getHistoryMessage();
      const { room_admin_info, msg, on_line_user_list, room_list } = data;
      this.setRoomAdminInfo(room_admin_info);
      this.updateMusicInfo(data);
      // this.$message.success(tips); 提示可以加可不加
      this.setOnlineUserList(on_line_user_list);
      this.setRoomList(room_list);
      this.showTipsJoinRoom &&
        this.setMessageDataList({ message_type: "info", message_content: msg });
      this.showTipsNotice && this.initNotice();
    },

    /* 通知房间列表变动了 */
    async updateRoomlist(data) {
      const { room_list, msg } = data;
      this.setRoomList(room_list);
      msg &&
        this.setMessageDataList({ message_type: "info", message_content: msg });
    },

    /* 用户上线了、更新在线列表、添加新用户上线消息提示、获取房间信息公告 */
    async online(data) {
      const { msg, on_line_user_list } = data;
      this.setOnlineUserList(on_line_user_list);
      this.showTipsJoinRoom &&
        this.setMessageDataList({ message_type: "info", message_content: msg });
    },
// <<<<<<< HEAD
//     async offline(data) {
//       const { msg, onlineUser } = data
//       this.setOnlineUserList(onlineUser);
//       this.setMessageDataList({ message_type: "info", message_content: msg });
//     },
// =======

    /* 用户离开当前房间，提示 + 更新在线用户列表 */
    async offline(data) {
      const { on_line_user_list, msg } = data;
      this.showTipsQuitRoom &&
        this.setMessageDataList({ message_type: "info", message_content: msg });
      this.setOnlineUserList(on_line_user_list);
    },


    /* 来了一条新消息 */
    message(data) {
      this.setMessageDataList(data.data);
    },

    /* 歌曲切换、到新歌曲了 */
    switchMusic(data) {
      const { msg, musicInfo } = data;
      this.updateMusicInfo(musicInfo);
      this.showTipsPlayMusic &&
        this.setMessageDataList({ message_type: "info", message_content: msg });
    },

    /* 服务端来了新的消息提示，根据code判断消息类型  */
    /**
     * 2: 提示用户 xx切掉了xx歌曲
     */
    notice(data) {
      const { code } = data;
      code === 2 && this.showTipsSwitchMusic && this.setMessageDataList(data);
    },

    /* 来自服务端的消息提示 1位成功提示 -1位错误或警告提示 */
    tips(data) {
      const { code, msg } = data;
      code === 1 && this.$message.success(msg);
      code === -1 && this.$message.error(msg);
      /* -2 是特殊情况 被挤下线 */
      code === -2 && this.$message.error(msg);
      code === -2 && this.logout(false);
      /* -3是加入的房间不存在，需要自己回归到888主房间 */
      code === -3 && this.$message.error(msg);
      code === -3 && this.setRoomId(888)
    },
    /* 有新的点的歌曲信息、更新队列歌单并消息提示 */
    chooseMusic(data) {
      const { music_queue_list, msg } = data;
      this.setMessageDataList({ message_type: "info", message_content: msg });
      this.setQueueMusicList(music_queue_list);
    },

    /* 有人撤回消息了 */
    recallMessage({ id, msg }) {
      this.updateMessageList({ id, msg });
    },

    updateOnLineUserList({ on_line_user_list }) {
      this.setOnlineUserList(on_line_user_list);
    },
  },
  computed: {
    ...mapState([
      "room_id",
      "un_read_msg_num",
      "pre_img",
      "showTipsJoinRoom",
      "showTipsQuitRoom",
      "showTipsSwitchMusic",
      "theme",
      "showTipsPlayMusic",
      "showTipsNotice",
    ]),
    ...mapGetters(["room_info", "mine_room_bg"]),
    room_bg() {
      return (
        this.mine_room_bg || this.room_info?.room_bg_img || default_room_bg
      );
    },
  },
  watch: {
    room_id(n, o) {
      if (Number(n) === Number(o) || !n) return;
      this.$socket.client.disconnect();
      this.resetRoom();
      this.initSocket();
    },
  },
  created() {
    this.initLocalStorageConfig();
    localStorage.room_id && this.setRoomId(localStorage.room_id);
    this.$confirm('请注意、加入聊天室将自动播放音乐!', '欢迎加入聊天室', {
      confirmButtonText: '加入房间',
      cancelButtonText: '取消',
    }).then(() => this.passJoin()).catch( () => this.logout())
  },
  mounted() {
    this.initUserAddress();
    document.addEventListener("keyup", this.keyboardEvent);
  },
  beforeDestroy() {
    this.$socket.connected && this.$socket.client.disconnect();
    document.removeEventListener("keyup", this.keyboardEvent, true);
  },
  methods: {
    ...mapActions([
      "toggleSignInPopup",
      "getUserInfo",
      "logout",
      "getRoomInfo",
    ]),
    ...mapMutations([
      "setOnlineUserList",
      "setRoomList",
      "setRoomAdminInfo",
      "setMessageDataList",
      "setCurrentMusicInfo",
      "setCurrentMusicStartTime",
      "setQueueMusicList",
      "emptyMessageDataList",
      "setRoomId",
      "updateMessageList",
      "setUnReadMsgNum",
      "setRoomInfo",
      "setGlobalRoomConfig",
    ]),

    resetRoom() {
      this.emptyMessageDataList();
      this.messageParams.page = 1;
    },
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

    /* 初始化ws需要参数携带token room_id 地址 前去校验 连接后挂载在全局 */
    async initSocket() {
      const token = localStorage.chat_token;
      if (!window.returnCitySN) {
        setTimeout(() => this.initSocket(), 50);
      } else {
        const { cname } = window.returnCitySN;
        this.$socket.client.io.opts.query = {
          token,
          address: cname,
          room_id: this.room_id,
        };
        localStorage.room_id = this.room_id;
        this.$socket.client.open();
        Vue.prototype.$socket = this.$socket;
      }
    },

    /* 初始化点歌列表队列、到点歌曲切换 设置当前正在播放的歌曲信息 都走这里 */
    updateMusicInfo(musicInfo) {
      const {
        music_info,
        music_lrc,
        music_src,
        music_start_time,
        music_queue_list,
      } = musicInfo;
      this.setQueueMusicList(music_queue_list);
      this.setCurrentMusicInfo({ music_info, music_lrc, music_src });
      music_start_time && this.setCurrentMusicStartTime(music_start_time);
    },

    /* 获取历史消息 */
    async getHistoryMessage() {
      const res = await history({
        room_id: this.room_id,
        ...this.messageParams,
      });
      this.stopLoadmore = res.data.length < this.messageParams.pagesize;
      this.stopLoadmore &&
        this.messageParams.page > 1 &&
        this.$message.warning("已加载完全部历史消息了！");
      this.setMessageDataList(res.data);
    },

    /* 上拉获取更多消息 */
    handlerLoadHistoryMessage() {
      this.messageParams.page += 1;
      this.getHistoryMessage();
    },

    /* 引用消息 */
    handlerQuoteMessage(message) {
      this.$refs.messageFrame.setQuoteMessage(message);
    },
    /* TODO 需要作为可配置项房间信息 */
    initNotice() {
      setTimeout(() => {
        this.$socket.client.connected &&
          this.setMessageDataList({
            message_type: "notice",
// <<<<<<< HEAD
//             message_content: [
//               "欢迎来到WangScaler的听歌房、欢迎点歌、欢迎各位朋友的到来、一起安安静静听歌吧。",
//               "1.本房间禁止任何违法非法行为。",
//               "2.禁止谈论关于色情、政治等任何敏感信息。",
//               "3.聊天室属于开放平台，有任何以上行为与本人无关。",
//               "4.本房间属于开源项目的测试平台。非运行上线产品。",
//               "5.如果有以上行为，请及时举报至Q/V:1349320519。",
//             ],
// =======
            message_content: this.room_info.room_notice.split(","),
// >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0
          });
      }, 1000);
    },
    /* 关闭弹窗 */
    closePopup() {
      this.showPopup = false;
    },
    /* 确认加入房间 */
    passJoin() {
      this.showPopup = false;
      this.lock = false;
      this.showChatPanle = true;
      this.initSocket();
// <<<<<<< HEAD
//     }
//   },
//   created() {},
//   mounted() {
//      this.initUserAddress();
//   },
//   watch: {
//     isLogin(n) {
//       n && this.initSocket();
// =======
// >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0
    },

    /* 聊天窗口滚到底部 */
    handleToBotton() {
      this.$scorllToBottom({ animation: true });
      this.setUnReadMsgNum(0);
    },

    keyboardEvent({ keyCode }) {
      if (this.lock) return;
      if (keyCode === 117) {
        // f6

      }
      if (keyCode === 192) {
        // ~

      }
      if (keyCode === 27) {
        // esc
        this.showChatPanle = !this.showChatPanle;
        this.showChatPanle && this.$nextTick(() => this.$scorllToBottom());
      }
      if (keyCode === 112) {
        // f1
        this.$refs.messageFrame.openBox(1);
      }
      if (keyCode === 113) {
        // f2
        this.$refs.messageFrame.openBox(2);
      }
      if (keyCode === 114) {
        // f3
        this.$refs.messageFrame.openBox(3);
      }
      if (keyCode === 115) {
        // f4
        this.$refs.messageFrame.openBox(4);
      }
      if (keyCode === 116) {
        // f5
      }
      if (keyCode === 118) {
        // f7
      }
      if (keyCode === 119) {
        // f8
        this.$refs.header.openBox(1);
      }
      if (keyCode === 120) {
        // f9
        this.$refs.header.openBox(2);
      }
      if (keyCode === 121) {
        // f10
        this.$refs.header.openBox(3);
      }
      return false;
    },

    hanlderCloseDialog(){
      this.logout()
    },

    /* 初始化全部配置，拿到本地缓存的历史配置,并设置主题 */
    initLocalStorageConfig() {
      const storageKeys = [
        "showTipsJoinRoom",
        "showTipsQuitRoom",
        "showTipsSwitchMusic",
        "theme",
        "show_all_tips",
        "showTipsNotice",
      ];
      storageKeys.forEach(
        (key) =>
          localStorage[key] &&
          this.setGlobalRoomConfig({ key, value:  key === "theme" ? localStorage[key] : JSON.parse(localStorage[key])})
      );
      const theme = localStorage.theme || "default";
      setTheme(theme);
    },
  }
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
// <<<<<<< HEAD
//   background: url("http://chat.scalerwang.com/1636699165011bg.jpegg");
//   background: url("http://chat.scalerwang.com/banner_111.a6be22c.gif");
// =======
  background: url("https://public-1300678944.cos.ap-shanghai.myqcloud.com/blog/1636699165011bg.jpeg");
  background-size: cover;
// >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0
  &-container {
    position: fixed;
    left: 8%;
    right: 8%;
    top: 5%;
    bottom: 5%;
    transition: all 0.5s;
    background: @message-panel-bg-color;
    box-shadow: @message-panel-box-shadow;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    z-index: 1;
    &-header {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid @message-border-color;
    }
    &-content {
      flex: 1;
      height: 0;
      position: relative;
      .un-read {
        transition: all 0.3s;
        position: absolute;
        right: 15px;
        bottom: 10px;
        padding: 7px 13px;
        font-size: 12px;
        background: #f56c6c;
        color: #fff;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
      }
    }
    &-progress {
      height: 2px;
      margin-bottom: 5px;
    }
    &-footer {
      padding: 0;
    }
  }
}
</style>
