const { createApp } = Vue;

createApp({
  data() {
    return {
      sectionsCount: 0,
      currentSection: 0,
      isScrolling: false,
      skillsShowArray: Array(11).fill(false),
      prjectsExplainShowArray: [true, false, false, false],
      projectExplainHover: [false, false, false, false],
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
          this.skillsShowArray = Array(11).fill(false);
        }, 500);
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
            this.skillsShowArray = Array(11).fill(false);
          }, 500);
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
        this.skillsShowArray[i] = true;
      }
      
    },
    thanksEffect() {
      // document.getElementById("thanksss").className
    },
    projectExplainChange(index) {
      this.projectExplainHover[index] = true;
      this.prjectsExplainShowArray = Array(this.prjectsExplainShowArray.length).fill(false);
      this.prjectsExplainShowArray[index] = true;
    },
    openProjectTab(i) {
      const linkArray = ["./projects/ladder_game/project_info.html", "./projects/spinRoulette/project_info.html", "./projects/websocketChat/project_info.html", "./projects/healthDiary/project_info.html"];
      window.open(linkArray[i], '_blank');
    }

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
