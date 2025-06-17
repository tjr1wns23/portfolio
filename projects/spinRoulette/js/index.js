const { createApp } = Vue;

createApp({
	data() {
		return {
			items: [''],
			rotation: 0,
			spinning: false,
			selectedItem: null,
			distinctColors: ["#e6194b", // 빨강
				"#3cb44b", // 초록
				"#ffe119", // 노랑
				"#4363d8", // 파랑
				"#f58231", // 주황
				"#911eb4", // 보라
				"#46f0f0", // 청록
				"#f032e6", // 핑크
				"#bcf60c", // 라임
				"#fabebe", // 연분홍
				"#008080", // 딥청록
				"#e6beff", // 연보라
				"#9a6324", // 갈색
				"#808000", // 올리브
				"#ffd8b1"],  // 살구빛
			selectedCount: 0,
			tempSelectedCount: 0
		};
	},
	methods: {
		onSelectChange() {
			if (this.spinning) {
				this.tempSelectedCount = this.selectedCount;
				return;
			}
			this.selectedCount = this.tempSelectedCount;

			const rouletteBox = this.$refs.rouletteBox;

			let tempArray = this.items;
			this.items = Array(this.selectedCount);

			let gradientText = "";
			const borderV = 360 / this.selectedCount; 0

			for (let i = 0; i < this.selectedCount; i++) {
				// 입력값이 개수가 늘어난 경우 위치를 맞추기 위함
				if (tempArray[i]) {
					this.items[i] = tempArray[i];
				}

				const start = (i * borderV).toFixed(6);
				const end = ((i + 1) * borderV).toFixed(6);
				gradientText += `${this.distinctColors[i]} ${start}deg ${end}deg,`;
			}

			gradientText = gradientText.slice(0, -1); // 마지막 쉼표 제거

			rouletteBox.style.background = `conic-gradient(${gradientText})`;
		},
		spin() {
			if (this.spinning) return;

			this.spinning = true;
			this.selectedItem = null;

			const itemCount = this.items.length;

			const selectedIndex = Math.floor(Math.random() * itemCount);

			const degreesPerItem = 360 / itemCount;
			const randomNum = Math.floor(Math.random() * degreesPerItem);

			const randomRoundCount = Math.floor(Math.random() * 3) + 2

			const rouletteBox = this.$refs.rouletteBox;
			const transform = rouletteBox.style.transform;
			const rouletteDeg = transform.split("rotate(")[1].split("deg)")[0];

			const additinalToOneRound = 360 - rouletteDeg % 360;


			rouletteBox.classList.add('wheel-animation');
			this.rotation += randomRoundCount * 360 + additinalToOneRound + (360 - (degreesPerItem * (selectedIndex) + randomNum));

			// 효과음 재생
			this.$refs.sound.currentTime = 0;
			// this.$refs.sound.play();

			setTimeout(() => {
				this.selectedItem = this.items[selectedIndex];
				this.spinning = false;


				rouletteBox.classList.remove('wheel-animation');
				this.rotation = this.rotation % 360;
			}, 3600);
		},
		getLabelStyle(index) {
			const angle = (360 / this.items.length) * index;
			const forCenter = (360 / this.items.length) * 0.5
			const width = 550 / this.items.length;
			return {
				transform: `translate(-50%, -50%) rotate(${angle + forCenter}deg)`, width: width + "px"
			};
		}
	}
}).mount("#app");