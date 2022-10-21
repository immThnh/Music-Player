    
    const $ = document.querySelector.bind(document);
	const $$ = document.querySelectorAll.bind(document);

    const PLAYER_STORAGE_KEY = 'DANH_THANH'

    const playBtn = $('.btn-toggle-play');
    const audio = $('#audio');
    const heading = $('header h2');
    const cdThumb = $('.cd-thumb');
    const cd = $('.cd');
    const player = $('.player');
    const progress = $('#progress')
    const nextBtn = $(".btn-next");
    const prevBtn = $(".btn-prev");
    const randomBtn = $('.btn-random');
    const repeatBtn = $('.btn-repeat');
    const playlist = $('.playlist');


	const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        isRepeat: false,
        setConfig: function(key,value){
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
        },
        songs: [
			{
			name:'Chờ đợi có đáng sợ',
			singer: 'Andiez',
			path:'./css/mucsic/ChoDoiCoDangSo-Andiez-7641306.mp3',
			image: 'https://i.scdn.co/image/ab67616d0000b27302af2be6e2dd46a1d1e9ad55',
			},
			{
			name:'Chuyện Đôi ta',
			singer: 'EmceeLDaLAB',
			path:'./css/mucsic/ChuyenDoiTa-EmceeLDaLAB-7120974.mp3',
			image: 'https://avatar-ex-swe.nixcdn.com/song/share/2021/11/25/c/0/d/d/1637809827065.jpg'
			},
			{
			name:'Lạc nhau có phải muôn đời',
			singer: 'Trinh',
			path:'./css/mucsic/LacNhauCoPhaiMuonDoiMovieVersionChoEmDenNgayMaiOST-ERIKST319-4724804.mp3',
			image: 'https://i.scdn.co/image/ab67616d0000b2731cafe0f76a34ae821e8cb84a'
			},
			{
			name:'Mặt mộc',
			singer: 'VAnh, Ân Nhi',
			path:'./css/mucsic/MatMocSpeedUp-PhamNguyenNgocVAnhAnNhi-7812217.mp3',
			image: 'https://avatar-ex-swe.nixcdn.com/song/2022/08/15/e/8/c/1/1660550672437_640.jpg'
			},
			{
			name:'Overtired',
			singer: 'Dab',
			path:'./css/mucsic/Overtired-DabVietNamChilythoi-8033339.mp3',
			image: 'https://i1.sndcdn.com/artworks-FhieibYzSjiNcF6w-GbTBzA-t500x500.jpg'
			},
			{
			name:'Phong',
			singer: 'VSTRA',
			path:'./css/mucsic/Phong-VSTRATGSNTyronee-7235639.mp3',
			image: 'https://avatar-ex-swe.nixcdn.com/song/2022/08/23/b/0/1/e/1661243989471_640.jpg'
			},
			{
			name:'Tệ thật, anh lại nhớ em',
			singer: 'Phong Vũ',
			path:'./css/mucsic/TeThatAnhNhoEm-ThanhHung-7132634.mp3',
			image: 'https://nhachay.vn/wp-content/uploads/2022/03/Te-That-Anh-Nho-Em-Thanh-Hung.jpg'
			},
			{
			name:'Thêm bao nhiêu lâu',
			singer: 'Đạt G',
			path:'./css/mucsic/ThemBaoNhieuLauLiveAtDrunkOnMusic-DatG-7670605.mp3',
			image: 'https://i.ytimg.com/vi/sinhZ1l54K8/maxresdefault.jpg'
			},
			{
			name:'Vài câu nói có khiến người thay đổi',
			singer: 'Ngô Lan Hương',
			path:'./css/mucsic/VaiCauNoiCoKhienNguoiThayDoiAcousitcCover-NgoLanHuong-6058839.mp3',
			image: 'https://avatar-ex-swe.nixcdn.com/playlist/2019/08/01/5/d/8/2/1564663193747.jpg'
			},
		],
		render: function() {
			const htmls = this.songs.map((song, index) => {
				return `
				<div class="song ${index === this.currentIndex ? 'active': ''}" data-index="${index}">
					<div class="thumb"style="background-image: url('${song.image}')">
					</div>
						<div class="body">
							<h3 class="title">${song.name}</h3>
							<p class="author">${song.singer}</p>
						</div>
					<div class="option">
							<i class="fas fa-ellipsis-h"></i>
					</div>
				</div>`
			})
			playlist.innerHTML = htmls.join('');
		},
		
		handleEvent: function() {
            const _this = this;
            // xử lý khi quay CD
            const cdThumbAnimate = cdThumb.animate([
                {transform: 'rotate(360deg)'}
            ], {
                duration: 10000,
                iterations: Infinity
            })
            cdThumbAnimate.pause();
            
			const cdWidth = cd.offsetWidth;
            // Xử lí zoom CD
			document.onscroll = function() {
				const scrollTop = window.scrollY || document.documentElement.scrollTop;
				const newCdWidth = cdWidth - scrollTop;
				cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth / cdWidth;
			}

            // Xử lí khi click PLAY
            playBtn.onclick = function() {
                if(app.isPlaying) {
                    audio.pause();
                }
                else {
                    audio.play();
                }
            }
            // khi bài hát  play - sử dụng hàm onplay của audio
            audio.onplay = function() {
                cdThumbAnimate.play();
                app.isPlaying = true;
                player.classList.add('playing');
            }
            // khi bài hát  pause - sử dụng hàm onplay của audio
            audio.onpause = function() {
                cdThumbAnimate.pause();
                app.isPlaying = false;
                player.classList.remove('playing');
            }

            // Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    // const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    const progressPercent = audio.currentTime / audio.duration * 100;
                    progress.value = progressPercent;
                }
            }

            // Xử lý khi tua
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime;
            }

            // Xử lý khi next 
            nextBtn.onclick = function() {
                if(_this.isRandom) {
                    _this.randomSong();
                }
                else {
                    _this.nextSong();
                }
                audio.play();
            }
            
            prevBtn.onclick = function() {
                if(this.isRandom) {
                    _this.randomSong();
                }
                else {
                    _this.prevSong();
                }
                audio.play();
            }
            // Xử lý khi click vao btn Random
            randomBtn.onclick = function() {
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active',_this.isRandom);
                _this.setConfig('isRandom',_this.isRandom);
            }

            audio.onended = function() {
                if(_this.isRepeat) {
                    audio.play();
                }
                else {
                    nextBtn.click();
                }
            }

            repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active',_this.isRepeat);
                _this.setConfig('isRepeat',_this.isRepeat);
            }

            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)');
                if(songNode || e.target.closest('.option'))
                {
                    if(songNode) {
                        let oldIndex = _this.currentIndex;
                        // _this.currentIndex = songNode.getAttribute('data-index');
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.reloadActive(oldIndex, _this.currentIndex);
                        _this.loadCurrentSong();
                        audio.play();
                    } 

                    if(e.target.closest('.option')) {
                        
                    }
                }
            }

            document.addEventListener('keydown', function(event){
                    if(event.keyCode == 32) {
                        event.preventDefault();
                        this.isPlaying = !this.isPlaying;
                        if(this.isPlaying) {
                            audio.onplay();
                            audio.play();
                        }
                        else {
                            audio.pause(); 
                            audio.onpause();
                        }
                    }
            })
		},

        scrollToActiveSong: function() {
            setTimeout(() => {
                let cur = $('.song.active')
                if(Number(cur.dataset.index) > 1) {
                    cur.scrollIntoView({
                        behavior:'smooth',
                        block: 'nearest',
                    })
                }
                else {
                    cur.scrollIntoView({
                        behavior:'smooth',
                        block: 'center',
                    })
                }
               
            }, 300)
        },
        
        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            })
        },

        loadCurrentSong: function() {
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
            audio.src = this.currentSong.path;
        },

        loadConfig: function(){
            this.isRandom = this.config.isRandom;
            this.isRepeat = this.config.isRepeat;
            randomBtn.classList.toggle('active',this.isRandom);
            repeatBtn.classList.toggle('active',this.isRepeat);
        },

        reloadActive: function(currIndex, newIndex) {
            var songList = $$('.song');
            songList[currIndex].classList.remove('active');
            songList[newIndex].classList.add('active');
        },
        // Xử lí khi next song
        nextSong: function() {
            let prevIndex = this.currentIndex;
            this.currentIndex += 1;
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
            this.reloadActive(prevIndex, this.currentIndex);
            this.loadCurrentSong();
            this.scrollToActiveSong();
        },

        prevSong: function() {
            let prevIndex = this.currentIndex;
            this.currentIndex -= 1;
            if(this.currentIndex < 0) {
                this.currentIndex = this.songs.length - 1;
            }
            console.log(this.currentIndex);
            this.reloadActive(prevIndex, this.currentIndex);
            this.loadCurrentSong();
            this.scrollToActiveSong();
        },

        randomSong: function() {
            var newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.songs.length);
            }
            while(newIndex == this.currentIndex);
            this.reloadActive(this.currentIndex, newIndex);
            this.currentIndex = newIndex;
            this.loadCurrentSong();
            this.scrollToActiveSong();
        },

  

		start: function() {
            this.loadConfig();

            // Định nghĩa các thuộc tính cho object
            this.defineProperties();

            // Lắng nghe xử lý các sự kiện
			this.handleEvent();

            // Load bài hát đầu tiền và UI khi vừa chạy app
            this.loadCurrentSong();

            // Render playlist
			this.render();

		},
  	}
  	app.start();