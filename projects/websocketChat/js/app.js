const { createApp, ref, onMounted, onUnmounted } = Vue;

createApp({
  setup() {
    const ws = ref(null);
    const colonEncode = "COLON:::COLON";
    const documentTitle = ref(document.title);
    const messageAudio = ref(null);
    const userFocused = ref(true);
    const unreadMessageCount = ref(0);
    const nickName = ref("");
    const message = ref("");
    const chatHistory = ref([]);
    let soundEnabled = false;

    function initWebSocket() {
      ws.value = new WebSocket("ws://192.168.20.121:8001");

      ws.value.onopen = () => console.log("WebSocket Connected");

      ws.value.onmessage = (event) => {
        const sendUserNickName = event.data.split(colonEncode)[0];
        let messageTxt;

        if (sendUserNickName === nickName.value) {
          messageTxt = event.data.split(colonEncode)[1];
          chatHistory.value.push({ text: messageTxt, type: "bg-primary text-white" });
        } else {
          messageTxt = event.data.replace(colonEncode, ":");
          chatHistory.value.push({ text: messageTxt, type: "bg-light text-dark" });

          if (!userFocused.value) {
            unreadMessageCount.value++;
            if (soundEnabled.value) {
              messageAudio.value.play();
            }
          }
        }

        if (unreadMessageCount.value > 0) {
          document.title = unreadMessageCount.value > 99
            ? `(99+) ${documentTitle.value}`
            : `(${unreadMessageCount.value}) ${documentTitle.value}`;
        }

        scrollToBottom();
      };

      ws.value.onclose = () => alert("WebSocket Disconnected");
      ws.value.onerror = (error) => alert(JSON.stringify(error));
    }

    function soundCtl() {
      this.soundEnabled = !this.soundEnabled;
    }

    function scrollToBottom() {
      const chatBoard = document.getElementById("chatHistory");
      if (chatBoard) chatBoard.scrollTop = chatBoard.scrollHeight;
    }

    function sendChatting() {
      if (ws.value?.readyState === 1) {
        if (!nickName.value) {
          alert("닉네임을 입력하세요!");
          return;
        }
        const text = `${nickName.value}${colonEncode} ${message.value}`;
        ws.value.send(text);
        message.value = "";
      } else {
        alert("서버와 연결이 끊겼습니다.");
      }
    }

    function clearChatting() {
      chatHistory.value = [];
    }

    onMounted(() => {
      messageAudio.value = document.getElementById("alertAudio");
      initWebSocket();

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          userFocused.value = false;
        } else {
          userFocused.value = true;
          unreadMessageCount.value = 0;
          document.title = documentTitle.value;
        }
      });
    });

    onUnmounted(() => {
      if (ws.value) ws.value.close();
      document.removeEventListener("visibilitychange", () => { });
    });

    return {
      nickName,
      message,
      chatHistory,
      soundEnabled,
      sendChatting,
      clearChatting
    };
  }
}).mount("#app");