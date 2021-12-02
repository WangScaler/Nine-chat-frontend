<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default{
  mounted(){
      window.addEventListener('unload',()=>{
          this.$socket.client.emit("closeSocket", window.localStorage.chat_token)
       })
      window.addEventListener('beforeunload',()=>{
      this.$socket.client.emit("closeSocket", window.localStorage.chat_token)
    })
  }
}

</script>
