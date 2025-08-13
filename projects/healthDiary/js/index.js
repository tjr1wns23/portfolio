const app = Vue.createApp({
  data() {
    return {
      page: "home",
      quotes: [
        {
          name: "아놀드 슈워제네거",
          imageURL: "css/images/Arnold.webp",
          quote: "The last three or four reps is what makes the muscle grow.",
          quoteKorean: "근육을 키우는 건 마지막 세네 번의 반복이다."
        },
        {
          name: "로니 콜먼",
          imageURL: "css/images/Ronald.jpg",
          quote: "That is when I squatted that 800 lbs I would do four reps instead of two.",
          quoteKorean: "(가장 후회하는것은) 스쾃 800파운드를 4번할 수 있었는데 2번밖에 하지 못한 것."
        },
        {
          name: "제이 커틀러",
          imageURL: "css/images/Cutler.webp",
          quote: "Success is usually the culmination of controlling failure.",
          quoteKorean: "성공은 보통 실패를 통제하는 것의 결실이다."
        },
        {
          name: "필 히스",
          imageURL: "css/images/Phillip.jpg",
          quote: "The mind always fails first, not the body.",
          quoteKorean: "먼저 실패하는 건 몸이 아니라 마음이다."
        },
        {
          name: "애디 홀",
          imageURL: "css/images/addie.webp",
          quote: "Pain is temporary. Quitting lasts forever.",
          quoteKorean: "고통은 잠시지만, 포기는 영원하다."
        }
      ],
      randomQuote: "",
      exerciseCategories: {
        '가슴': ['벤치프레스', '덤벨 프레스', '체스트 프레스', '체스트 플라이', '푸시업'],
        '등': ['풀 오버', '렛 풀 다운', '케이블 로우', '바벨 로우'],
        '하체': ['스쿼트', '런지', '레그프레스', '레그 익스텐션', '레그컬'],
        '복부': ['크런치', '플랭크', '행잉 레그 레이즈'],
      },
      selectedCategory: '',
      newExercise: {
        name: '',
        nameDetail: '',
        sets: null,
        details: [],
      },
      form: {
        exercises: [],
      },
      entries: []
    };
  },
  created() {
    this.pickRandomQuote();
  },
  computed: {
    reversedEntries() {
      return [...this.entries].reverse();
    }
  },
  watch: {
    'newExercise.sets'(newVal) {
      if (newVal && Number.isInteger(newVal) && newVal > 0) {
        this.newExercise.details = Array.from({ length: newVal }, () => ({ reps: null, weight: null }));
      } else {
        this.newExercise.details = [];
      }
    }
  },
  methods: {
    pickRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.quotes.length);
      this.randomQuote = this.quotes[randomIndex];
    },
    addExercise() {
      const ex = this.newExercise;
      if (!ex.name || !ex.sets || ex.details.length !== ex.sets) {
        alert("모든 항목을 정확히 입력해주세요.");
        return;
      }
      for (const d of ex.details) {
        if (!d.reps || !d.weight) {
          alert("세트별 반복수와 중량을 모두 입력해주세요.");
          return;
        }
      }

      this.form.exercises.push({
        name: ex.nameDetail ? ex.name + " (" + ex.nameDetail + ")" : ex.name,
        sets: ex.sets,
        details: ex.details.map(item => `${item.reps}:${item.weight}`)
      });
      this.newExercise = { name: '', sets: null, details: [] };

    },
    removeExercise(index) {
      this.form.exercises.splice(index, 1);
    },
    saveEntry() {
      if (this.form.exercises.length === 0) {
        alert("운동 기록을 추가해 주세요.");
        return;
      }

      const contentObject = {
        exercises: this.form.exercises.map(item => item.name),
        setsArray: this.form.exercises.map(item => item.details)
      }

      const abc = { exercises: [], setsArary: [] };
      abc.exercises.push();
      abc.setsArary.push();

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');

      const dateString = `${yyyy}.${mm}.${dd}`;

      this.entries.push({
        title: "운동 기록 " + (this.entries.length + 1),
        date: dateString,
        content: contentObject
      });

      this.form.exercises = [];  // 초기화
      alert("운동 일지가 저장되었습니다!");
      this.page = 'journal';  // 일지 보기로 이동
    }
  },

});

app.mount("#app");