const { createApp, ref, onMounted, watch, reactive } = Vue;

createApp({
  setup() {
    const canvas = ref(null);
    const connector = ref(null);

    const projects = reactive([
      { id: 1, title: "사다리 게임", desc: "Vanilla JS로 구현한 사다리 게임입니다. SVG를 활용하여 경로를 시각적으로 표현하고 클릭 시 랜덤한 결과가 도출되도록 설계했습니다. DOM 조작과 이벤트 처리, SVG 동적 렌더링 등 다양한 웹 기술을 실습하는 데 중점을 두었습니다.", image:'./css/image/ladder_game.png', tags: ['Vanilla JS', 'requestAnimationFrame', 'SVG'], link: "./projects/ladder_game/project_info.html" },
      { id: 2, title: "룰렛 게임", desc: "Vue.js로 구현한 룰렛 게임입니다. CSS 스타일을 동적으로 조작하여 룰렛이 회전하는 효과를 구현하고, JavaScript 함수로 결과를 계산하고 표시하는 구조로 설계했습니다.", image:'./css/image/roulette.png', tags: ['Vue', 'conic-gradient'], link: "./projects/spinRoulette/project_info.html" },
      { id: 3, title: "웹소켓 채팅", desc: "Websocket을 이용해 구현한 채팅 어플리케이션입니다. 닉네임 설정, 알람끄기 기능 등을 구현했으며, 실시간 채팅이 가능하도록 구현했습니다.", image:'./css/image/websocket_chat.png', tags: ['Websocket', 'nodeJS'], link: "./projects/websocketChat/project_info.html" },
      { id: 4, title: "운동 일지", desc: "Vue 3 CDN을 활용해 개발한 SFA 개인 운동 기록용 어플입니다. 사용자가 날짜별로 운동 내용을 작성하고, 기록을 관리할 수 있는 기능을 구현했습니다.", image:'./css/image/health_diary.png', tags: ['Vue', 'Composition API'], link: "./projects/healthDiary/project_info.html" },
      { id: 5, title: "칸반 보드", desc: "Vue 3, TypeScript, Vite를 활용해 제작한 칸반 보드 애플리케이션입니다. 작업을 To Do, In Progress, Done의 세 영역으로 구분해 진행 상황을 한눈에 확인할 수 있으며, 마우스 드래그 앤 드롭 기능을 통해 편리하게 작업을 관리할 수 있습니다.", image:'./css/image/kanban_board.png', tags: ['Vue', 'typescript', 'vite', 'nodeJS'], link: "./projects/kanbanBoard/distribution/project_info.html" },
      { id: 6, title: "날씨 앱", desc: "React, TypeScript, Vite를 활용해 제작한 날씨 앱입니다. OpenWeatherMap API를 이용해 지역별 날씨 정보를 가져오며, 하루 날씨와 일주일간 예보를 한눈에 확인할 수 있도록 구성했습니다. 또한 직관적인 아이콘 표시를 통해 사용자가 쉽게 날씨 정보를 이해할 수 있도록 구현했습니다.", image:'./css/image/weather_app.png', tags: ['React', 'typescript', 'vite', 'Chart.js','OpenWeatherMap API'], link: "./projects/weatherApp/distribution/project_info.html" },
      { id: 7, title: "길드 관리 콘솔", desc: "Google Vision API 기반의 길드 관리 콘솔로, 길드 점수 이미지를 업로드하면 OCR을 통해 자동으로 텍스트 데이터를 추출하고, 이를 변수화하여 지난 2주간 점수를 효율적으로 합산하고 평균을 계산할 수 있도록 개발했습니다.", image:'./css/image/vision_ocr.png', tags: ['게임', 'google vision API', 'Vue 3'], link: "./projects/vision_ocr/project_info.html" }
    ]);

    const radiusAnim = ref(0);
    const animationDuration = 600; // ms
    const animationStartTime = ref(null);

    const animateRadius = (timestamp) => {
      if (!animationStartTime.value) animationStartTime.value = timestamp;
      const elapsed = timestamp - animationStartTime.value;
      radiusAnim.value = Math.min(elapsed / animationDuration, 1);

      calculateLines();

      if (radiusAnim.value < 1) {
        requestAnimationFrame(animateRadius);
      }
    };

    const backanimateRadius = (timestamp) => {
      if (!animationStartTime.value) animationStartTime.value = timestamp;
      const elapsed = timestamp - animationStartTime.value;
      const duration = 500; // ms

      radiusAnim.value = Math.max(1 - elapsed / duration, 0);

      if (radiusAnim.value > 0) {
        requestAnimationFrame(backanimateRadius);
      } else {
        animationStartTime.value = null;
      }
    }

    const resetNodeAnime = () => {
      // radiusAnim.value = 0;
      animationStartTime.value = null;
      requestAnimationFrame(backanimateRadius);
    }

    const preview = ref({});

    const nodeSize = 140; // px

    const getNodeStyle = (index) => {
      if (!canvas.value) return {};
      const rect = canvas.value.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const maxRadius = Math.min(rect.width, rect.height) / 2 - 100;

      const angle = (index / projects.length) * Math.PI * 2 - Math.PI / 2;
      const r = maxRadius * radiusAnim.value;

      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      return {
        position: 'absolute',
        left: `${x - nodeSize / 2}px`,
        top: `${y - nodeSize / 2}px`,
        width: `${nodeSize}px`,
        height: `${nodeSize}px`,
        cursor: 'pointer',
        transition: 'left 0.1s, top 0.1s',
      };
    };
    const connectorLines = ref([]);

    const calculateLines = () => {
      if (!canvas.value) return;
      const rect = canvas.value.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const maxRadius = Math.min(rect.width, rect.height) / 2 - 100;

      const lines = projects.map((_, i) => {
        const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
        const r = maxRadius * radiusAnim.value;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        return {
          x1: cx,
          y1: cy,
          x2: x,
          y2: y,
        };
      });

      connectorLines.value = lines;
    };

    const onClickNode = (pLink) => {
      window.open(pLink);
    };

    const showPreview = (p) => {
      preview.value = p;
    };

    const flash = (el) => {
      el.animate([
        { boxShadow: '0 0 0 0 rgba(124,58,237,0.0)' },
        { boxShadow: '0 0 0 8px rgba(124,58,237,0.06)' },
        { boxShadow: '0 0 0 0 rgba(124,58,237,0)' }
      ], { duration: 900 });
    };

    const onResize = () => {
      calculateLines();
    };

    window.addEventListener('resize', onResize);

    onMounted(() => {
      calculateLines();
      showPreview(projects[0]);
    });

    watch(radiusAnim, () => {
      calculateLines();
    });

    const personalPorjectAnime = () => {
      requestAnimationFrame(animateRadius);
    }

    return {
      projects,
      preview,
      getNodeStyle,
      onClickNode,
      showPreview,
      connectorLines,
      canvas,
      connector,
      personalPorjectAnime,
      resetNodeAnime
    };
  },
  data() {
    return {
      sectionsCount: 0,
      currentSection: 0,
      isScrolling: false,
      skillsShowArray: Array(15).fill(false),
      fullText: "안녕하세요.\n프론트엔드 개발자 장석준입니다.",
      displayedText: "",
      typeIndex: 0,
    };
  },
  couputed: {

  },
  methods: {
    scrollNext() {
      if (this.currentSection < this.sectionsCount - 1) {
        this.currentSection++;
      }
      this.scrollToSection(this.currentSection);
    },
    scrollPrev() {
      if (this.currentSection > 0) {
        this.currentSection--;
      }
      this.scrollToSection(this.currentSection);
    },
    scrollToSection(index) {
      const section = document.querySelectorAll('.board-wrap')[index];
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      if (index == 1) {
        this.skillsShow();
      } else {
        setTimeout(() => {
          let skillCount = this.skillsShowArray.length;
          this.skillsShowArray = Array(skillCount).fill(false);
        }, 500);
      }
      if (index == 2) {
        this.personalPorjectAnime();
      } else {
        this.resetNodeAnime();
      }
    },
    handleWheel(event) {
      if (this.isScrolling) return;

      if (event.deltaY > 0) {
        this.scrollNext();
      } else {
        this.scrollPrev();
      }

      event.preventDefault();
      this.isScrolling = true;

      // Reset scrolling flag after 1 second to allow smooth scrolling
      setTimeout(() => {
        this.isScrolling = false;
      }, 300);  // .3 second delay for scrolling
    },
    clickNav(index) {
      this.currentSection = index;
      this.scrollToSection(this.currentSection);
    },
    typeText() {
      if (this.typeIndex < this.fullText.length) {
        const currentChar = this.fullText[this.typeIndex];
        this.displayedText += currentChar === "\n" ? "<br>" : currentChar;
        this.typeIndex++;
        setTimeout(this.typeText, 80);
      } else {
        this.typeIndex = 1000;
        window.addEventListener('wheel', this.handleWheel, { passive: false });
      }
    },
    scrollTop() {
      this.currentSection = 0;
      this.scrollToSection(this.currentSection);
    },
    async skillsShow() {
      let skillsLength = this.skillsShowArray.length;
      for (let i = 0; i < skillsLength; i++) {

        if (this.currentSection != 1) {
          setTimeout(() => {
            this.skillsShowArray = Array(skillsLength).fill(false);
          }, 500);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
        this.skillsShowArray[i] = true;
      }

    },
  },
  mounted() {
    this.sectionsCount = document.getElementsByClassName("board-wrap").length;
    this.scrollToSection(this.currentSection);
    this.typeText();
  },
  beforeDestroy() {
    // Clean up event listener before destroying the component
    window.removeEventListener('wheel', this.handleWheel);
  },
}).mount('#app');
