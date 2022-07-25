<template>
<!-- <<<<<<< HEAD
  <div class="header flex_between">
    <div class="header-left flex_start">
      <div class="header-left-id">
        <span class="visible-xl visible-md visible-sm">ID:</span>
        8888
      </div>
      <div class="header-left-name">
        <span class="visible-xl visible-md visible-sm">摸鱼聊天，禁止非法言论</span>
      </div>
      <div
        class="header-left-share flex_center"
        :data-clipboard-text="copyText"
        @click="share"
      >
        <icon name="chat-share" scale="1.8" class="icon" />
        <span class="visible-xl visible-md visible-sm">分享</span>
      </div>
    </div>
   
    <div class="header-right flex_center">
       <div class="header-right-item flex_center" @click="toGit">
        <icon name="github" scale="1.8"  />
        <span class="visible-xl visible-md visible-sm">开源地址</span>
      </div>
      <div class="header-right-item flex_center" @click="toBlog">
        <icon name="chat-blog" scale="1.8"  />
        <span class="visible-xl visible-md visible-sm">博客</span>
      </div>
      <div class="header-right-item flex_center" @click.stop="openBox(1)">
        <icon name="chat-online" scale="1.8" class="icon" />
        <span class="visible-xl visible-md visible-sm">
          在线[{{ onLineNum }}]
        </span>
      </div>
      <div class="header-right-item flex_center" @click.stop="openBox(2)">
        <icon name="chat-room" scale="1.8" class="icon" />
        <span class="visible-xl visible-md visible-sm">公告</span>
      </div>
      <div class="header-right-item flex_center" @click.stop="openBox(3)">
        <icon name="chat-mine" scale="1.8" class="icon" />
        <span class="visible-xl visible-md visible-sm">我的</span>
      </div>
      <div class="header-right-item flex_center" @click="logoutSocket">
        <icon name="close" scale="1.8" class="icon" />
        <span class="visible-xl visible-md visible-sm">退出</span>
      </div>
    </div>
    <chat-popup :options="opt1" :top="60" :right="10" title="在线用户">
      <online-list />
    </chat-popup>
    <chat-popup :options="opt2" :top="60" :right="10" title="房间信息" >
    <div class="gongao">
      欢迎来到WangScaler的听歌房、欢迎点歌、欢迎各位朋友的到来、一起安安静静听歌吧。
      <br>
              1.本房间禁止任何违法非法行为。
                <br>
              2.禁止谈论关于色情、政治等任何敏感信息。
                <br>
              3.聊天室属于开放平台，有任何以上行为与本人无关。
                <br>
              4.本房间属于开源项目的测试平台。非运行上线产品。
                <br>
              5.如果有以上行为，请及时举报至Q/V:1349320519。
    </div>
    </chat-popup>
    <chat-popup :options="opt3" :top="60" :right="10" title="个人中心" />
  </div>
======= -->
	<div class="header flex_between">
		<div class="header-left flex_start">
			<div class="header-left-id">
				<span class="visible-xl visible-lg">ID:</span>
				{{ (room_info && room_info.room_id) || 888 }}
			</div>
			<div class="header-left-name">
				<span class="visible-xl visible-lg">{{
          (room_info && room_info.room_name) || "chat-wangscaler"
				}}</span>
			</div>
			<div class="header-left-share flex_center" :data-clipboard-text="copyText" @click="share">
				<icon name="chat-share" scale="1.8" class="icon" />
				<span class="visible-xl visible-lg">分享</span>
			</div>
		</div>

		<!-- pannel right -->
		<div class="header-right flex_center">
			<div class="header-right-item flex_center" @click="toGit">
				<icon name="github" scale="1.8" />
				<span class="visible-xl visible-lg">开源地址</span>
			</div>
       <div class="header-right-item flex_center" @click="toBlog">
        <icon name="chat-blog" scale="1.8"  />
        <span class="visible-xl visible-md visible-sm">博客</span>
      </div>
			<div
				v-if="Number(mine_room_id) === Number(room_id)"
				:class="[
          'header-right-item',
          'flex_center',
          { 'active-menu': opt4.show },
        ]"
				@click.stop="openBox(4)"
			>
				<icon name="chat-header-setting" scale="1.8" class="icon" />
				<span class="visible-xl visible-lg">管理</span>
			</div>
			<div
				:class="[
          'header-right-item',
          'flex_center',
          { 'active-menu': opt1.show },
        ]"
				@click.stop="openBox(1)"
			>
				<icon name="chat-online" scale="1.8" class="icon" />
				<span class="visible-xl visible-lg"> 在线[{{ onLineUserNum }}] </span>
			</div>
			<div
				:class="[
          'header-right-item',
          'flex_center',
          { 'active-menu': opt2.show },
        ]"
				@click.stop="openBox(2)"
			>
				<icon name="chat-room" scale="1.8" class="icon" />
				<span class="visible-xl visible-lg">房间[{{ onLineRoomNum }}]</span>
			</div>
			<div
				:class="[
          'header-right-item',
          'flex_center',
          { 'active-menu': opt3.show },
        ]"
				@click.stop="openBox(3)"
			>
				<icon name="chat-mine" scale="1.8" class="icon" />
				<span class="visible-xl visible-lg">我的</span>
			</div>
			<div class="header-right-item flex_center" @click="handlerLogout">
				<icon name="chat-go" scale="1.8" class="icon" />
				<span class="visible-xl visible-lg">登出</span>
			</div>
		</div>
		<!-- popup -->
		<chat-popup :options="opt1" :top="60" :right="10" title="在线用户">
			<online-list />
		</chat-popup>
		<chat-popup :options="opt2" :top="60" :right="10" title="房间信息">
			<el-button v-if="!isMineRoom" slot="header" type="text" size="mini" @click="createOrJoinRoom">{{ btnText }}</el-button>
			<room-list :create-room-visible="createRoomVisible" @canel="handlerCreateSuccess" @close="closeBox" @create-success="handlerCreateSuccess" />
		</chat-popup>
		<chat-popup :options="opt3" :top="60" :right="10" :height="450" title="个人中心">
			<persion-info />
		</chat-popup>
		<chat-popup :options="opt4" :top="60" :right="10" title="房间设置">
			<room-setting />
		</chat-popup>
	</div>
<!-- >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0 -->
</template>

<script>
import Clipboard from "clipboard";
import { mapGetters, mapActions, mapMutations } from "vuex";
import ChatPopup from "@/components/ChatPopup";
import OnlineList from "./components/OnLineList.vue";
import RoomList from "./components/RoomList.vue";
import PersionInfo from "./components/PersionInfo.vue";
import RoomSetting from "./components/RoomSetting.vue";

export default {
  components: { ChatPopup, OnlineList, RoomList, PersionInfo, RoomSetting },
  data() {
    return {
      opt1: { show: false },
      opt2: { show: false },
      opt3: { show: false },
      opt4: { show: false },
      createRoomVisible: false,
    };
  },
  computed: {
    ...mapGetters([
      "mine_room_id",
      "onLineRoomNum",
      "onLineUserNum",
      "room_id",
      "room_info",
      "user_info",
    ]),
    btnText() {
      return !this.mine_room_id ? "创建房间" : "我的房间";
    },
    copyText() {
      return "http://chat.wangscaler.com";
    },
    isMineRoom() {
      return Number(this.room_id) === Number(this.mine_room_id);
    },
  },
  methods: {
    ...mapActions(["getUserInfo", "logout"]),
    ...mapMutations(["setRoomId", "setSignInPopup"]),
    share() {
      const clipboard = new Clipboard(".header-left-share");
      clipboard.on("success", () => {
        this.$message.success("复制成功、快发给你的小伙伴一起来听音乐吧~");
        clipboard.destroy();
      });
    },
    openBox(val) {
      if (this[`opt${val}`].show) return (this[`opt${val}`].show = false);
      this.closeBox();
      this[`opt${val}`].show = !this[`opt${val}`].show;
    },
    closeBox() {
      const self = this;
      // eslint-disable-next-line no-underscore-dangle
      const res = Object.keys(self._data).filter(
        (key) => key.search("opt") !== -1
      );
      res.forEach((t) => (self[t].show = false));
    },
// <<<<<<< HEAD
    toBlog() {
      window.open("https://blog.scalerwang.com");
    },
    logoutSocket() {
    this.$socket.client.emit("closeSocket", localStorage.chat_token)
    localStorage.chat_token = "";
    window.location.replace("https://blog.scalerwang.com");
  },
    toGit() {
      window.open("https://github.com/wangscaler");
    }
  },
//   created() {},
//   mounted() {
//   },
//   watch: {},
//   computed: {
//     copyText() {
//       return "http://chat.scalerwang.com";
//     },
//     onLineNum() {
//       return this.$store.state.onlineUserList.length;
//     },
//   },
// =======
    // toGit() {
    //   window.open("https://github.com/longyanjiang/Nine-chat-frontend");
    // },
    createOrJoinRoom() {
      if (!this.$socket.client.connected) return this.setSignInPopup(true);
      if (!this.mine_room_id) return (this.createRoomVisible = true);
      if (Number(this.mine_room_id) === Number(this.room_id))
        return this.$message.warning("当前已经在这个房间里了");
      this.setRoomId(this.mine_room_id);
      this.closeBox();
    },
    handlerCreateSuccess() {
      this.createRoomVisible = false;
      this.getUserInfo();
    },

    /* 退出登录 */
    handlerLogout() {
      this.$confirm('是否需要退出登录?', '退出登录', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => this.logout()).catch()
    }
  }
// >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0
};
</script>
<style lang="less" scoped>
.header {
  height: 100%;
  padding: 0 15px;
  user-select: none;
  color: @message-main-text-color;
  &-left {
    &-id {
      user-select: none;
      background-color: @message-main-text-color;
      color: @message-border-color;
      display: flex;
      padding: 0 5px;
      font-size: 14px;
      border-radius: 3px;
      margin-right: 5px;
    }
    &-name {
      font-size: 18px;
      user-select: none;
      margin-right: 12px;
    }
    &-share {
      cursor: pointer;
      padding: 4px 10px;
      border-radius: 5px;
      transition: all 0.3s;
      .icon {
        margin-right: 3px;
      }
      &:hover {
        background: @message-hover-bg-color;
      }
    }
  }

  &-right {
    &-item {
      padding: 5px 10px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      color: @message-main-text-color;
      border-radius: 5px;
      margin: 0 3px;
      z-index: 3001;
      .icon {
        margin-right: 3px;
      }
      &:hover {
        background: @message-hover-bg-color;
      }
      &:active {
        filter: brightness(1.2);
      }
    }
  }
// <<<<<<< HEAD
//   .gongao{
   
//     text-align: left;
//     max-width: 500px;
//     padding: 10px 15px;
//     border-radius: 10px;
//     font-size: 13px;
//     display: flex;
//     flex-direction: column;
//     letter-spacing: 3px;
  
// =======

  .active-menu {
    background: @message-hover-bg-color !important;
// >>>>>>> e269c40c8398d0f438758f2ce454a0cc8b761fa0
  }
}
</style>
