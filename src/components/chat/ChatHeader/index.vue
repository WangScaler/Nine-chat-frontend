<template>
  <div class="header flex_between">
    <div class="header-left flex_start">
      <div class="header-left-id">
        <span class="visible-xl visible-md visible-sm">ID:</span>
        8888
      </div>
      <div class="header-left-name">
        <span class="visible-xl visible-md visible-sm">技术交流，禁止非法操作</span>
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
       <div class="header-right-item flex_center" @click="toJuejin">
        <icon name="robot" scale="1.8"  />
        <span class="visible-xl visible-md visible-sm">掘金挖矿</span>
      </div>
        <div class="header-right-item flex_center" @click="toMath">
        <icon name="robot" scale="1.8"  />
        <span class="visible-xl visible-md visible-sm">掘金数字</span>
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
    <!-- popup -->
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
              <br>
              6.感谢nihao、spirit资金支持，九儿的书屋、摸鱼大王、古月_歌代码贡献。
               <br>
              7.祝大家新年快乐，虎年大吉。
    </div>
    </chat-popup>
    <chat-popup :options="opt3" :top="60" :right="10" title="个人中心">
      <person @update="update"/>
    </chat-popup>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import ChatPopup from "@/components/ChatPopup";
import OnlineList from "./components/OnLineList.vue";
import Person from "./components/Person"
import { update } from "@/api/user"

export default {
  components: { ChatPopup, OnlineList, Person },
  data() {
    return {
      opt1: {
        show: false,
      },
      opt2: {
        show: false,
      },
      opt3: {
        show: false,
      },
    };
  },
  methods: {
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
      const res = Object.keys(self._data).filter(
        (key) => key.search("opt") !== -1
      );
      res.forEach((t) => (self[t].show = false));
    },
    toBlog() {
      window.open("https://blog.wangscaler.com");
    },
    toMath(){
      window.open("http://math.wangscaler.com");
    },
    toJuejin(){
      window.open("http://juejin.wangscaler.com");
    },
    logoutSocket() {
    this.$socket.client.emit("closeSocket", localStorage.chat_token)
    localStorage.chat_token = "";
    window.location.replace("https://blog.wangscaler.com");
  },
    toGit() {
      window.open("https://github.com/wangscaler");
    },
    async update(v) {
      const res = await update(v)
      if (res.success) {
        this.opt3.show = false
        this.$message.success("修改成功!")
      } else {
        this.opt3.show = false
        this.$message.error("修改失败!")
      }
    }
  },
  created() {},
  mounted() {
  },
  watch: {},
  computed: {
    copyText() {
      return "http://chat.wangscaler.com";
    },
    onLineNum() {
      return this.$store.state.onlineUserList.length;
    },
  },
};
</script>
<style lang="less" scoped>
.header {
  height: 100%;
  padding: 0 15px;
  user-select: none;
  &-left {
    &-id {
      user-select: none;
      background-color: #333;
      color: #fff;
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
        background: #eee;
      }
    }
  }

  &-right {
    &-item {
      padding: 5px 10px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      color: #999;
      border-radius: 5px;
      margin: 0 3px;
      z-index: 3001;
      .icon {
        margin-right: 3px;
      }
      &:hover {
        background: #eee;
      }
      &:active {
        filter: brightness(1.2);
      }
    }
  }
  .gongao{
   
    text-align: left;
    max-width: 500px;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 13px;
    display: flex;
    flex-direction: column;
    letter-spacing: 3px;
  
  }
}
</style>
