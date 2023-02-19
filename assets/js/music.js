const btnIconPlay = document.querySelector('.btn.btn-play i.fa-circle-play');
const btnIconPause = document.querySelector('.btn.btn-play i.fa-circle-pause');

const heading = document.querySelector('header h2')
const cdThum = document.querySelector('.cd-thurm')
const audio = document.querySelector('#audio')
const btnPlay = document.querySelector('.btn-play')
const player = document.querySelector('.player')
const app = {
    isPlaying: false,
    currenIndex: 0,
    isRandom: false,
    isPreat: false,
    songs: [{
        name: 'Đám cưới của em',
        singer: 'Lý Tuấn Kiệt - Phát Hồ',
        path: 'assets/music/DamCuoiCuaEm-LyTuanKietPhatHo-8489769.mp3',
        img: 'assets/img/damcuoicuaem.jpg',
    },
    {
        name: 'Không đâu bằng nhà',
        singer: 'Phùng Ngọc Huy',
        path: 'assets/music/KhongDauBangNha-PhungNgocHuy-8572952.mp3',
        img: 'assets/img/khongdaubangnha.jpg',
    },
    {
        name: 'Không yêu trả dép tôi về',
        singer: 'HuyR',
        path: 'assets/music/KhongYeuTraDepToiVe-HuyR-8677582.mp3',
        img: 'assets/img/khongyeutadep.webp',
    },
    {
        name: 'Nếu đánh mất em',
        singer: 'HuyDuy',
        path: 'assets/music/NeuDanhMatEm-ReddyHuuDuy-8489763.mp3',
        img: 'assets/img/neudanhmatem.jpg',
    },
    {
        name: 'Sao soi đường đêm',
        singer: 'Hải Ngoại',
        path: 'assets/music/SaoSoiDuongDem-TrungTranTrungTamBangDiaLauHaiNgoai-8646724.mp3',
        img: 'assets/img/Saosoidem.jpg',
    },
    {
        name: 'See tình',
        singer: 'Hương Ly',
        path: 'assets/music/SeeTinhCover-HuongLy-8564503.mp3',
        img: 'assets/img/seetinh.jpg',
    },
    {
        name: 'Thị trấn âm thanh',
        singer: 'Chưa xác định tác giả',
        path: 'assets/music/ThiTranAmThanhPart3-KaneHydanEROSSVietNamDBiiZ-8486329.mp3',
        img: 'assets/img/thitranamthanh.jpg',
    },
    {
        name: 'Thuyền Quyên',
        singer: 'Cao Trí',
        path: 'assets/music/ThuyenQuyenLofiVer-DieuKienCaoTri-8520916.mp3',
        img: 'assets/img/thuyenquyen.jpg',
    },
    {
        name: 'Yêu anh trong giấc mơ',
        singer: 'Mia Trần',
        path: 'assets/music/YeuAnhTrongGiacMo-MiaTran-8489760.mp3',
        img: 'assets/img/yeuanhtronggiacmo.jpg',
    },
    ],

    render: function () {
        const htmls = this.songs.map(function (song, index) {
            return `
                <div class="song ${index  === app.currenIndex ? 'active' : ""}">
                    <div class="thurm">
                        <div class="thurm-img" style="background-image:
                            url('${song.img}')"></div>
                    </div>
                    <div class="body">
                        <div class="title">${song.name}</div>
                        <div class="author">${song.singer}</div>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        document.querySelector('.playlist').innerHTML = htmls.join('')
    },

    handleEvent: function () {
        const _this = this;
        const cd = document.querySelector('.cd')
        const cdWidth = cd.offsetWidth;
        const progress = document.querySelector('#progress')
        const btnnextSong = document.querySelector('.btn-next')
        const btnpriSong = document.querySelector('.btn-previous')
        const btnRandom = document.querySelector('.btn-random')
        const btnPreat = document.querySelector('.btn-repeat')

        document.onscroll = function () {
            const newWidth = cdWidth - window.scrollY;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }
        // Xu ly CD quay 360
        const CDAnimation = cd.animate ([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        CDAnimation.pause();

        // Xu ly khi click play
        btnPlay.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            }else {
                audio.play();
            }
            
        }
        // Khi nhan play song
        audio.onplay = function (){
            _this.isPlaying = true;
            btnIconPlay.style.display = 'none';
            btnIconPause.style.display = 'block';
            CDAnimation.play();
        }
        // Khi song pause
        audio.onpause = function (){
            _this.isPlaying = false;
            btnIconPause.style.display = 'none';
            btnIconPlay.style.display = 'block';
            CDAnimation.pause();
        }
        // Time cua bai hat
        audio.ontimeupdate = function () {
            const percentTime = Math.floor(audio.currentTime / audio.duration * 100);
            if (percentTime !== NaN) {
                progress.value = percentTime;
            }
        }
        // Xu ly khi tua time
        progress.oninput = function (e) {
            const timeSelecte = audio.duration * e.target.value / 100;
            audio.currentTime = timeSelecte;
        }
        // Xu ly khi next song:
        btnnextSong.onclick = function () {
            if(_this.isRandom){
                _this.randomSong();
            }else {
                _this.nextSong();
            }
            audio.play();
            _this.render()
            _this.scrollToACtive();
        }
        // Xu ly khi lui song:
        btnpriSong.onclick = function () {
            _this.prevSong();
            audio.play();
            _this.render()
            _this.scrollToACtive();
        }
        // Xu ly khi random song:
        btnRandom.onclick = function (e) {
           _this.isRandom = !_this.isRandom;
           btnRandom.classList.toggle("active", _this.isRandom)
        }
        // Xu ly khi end bai hat
        audio.onended = function () {
            if(_this.isPreat){
                audio.play()
            }else{
                btnnextSong.click();
            }
        }
        // XU li nut repaet
        btnPreat.onclick = function (e) {
            _this.isPreat = !_this.isPreat;
            btnPreat.classList.toggle("active", _this.isPreat)
        }
    },
    scrollToACtive: function () {
        setTimeout(() => {
            document.querySelector('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest'
            })
        },200)
    },
    defineProperties: function () {
        Object.defineProperties(this, {
            currentSong: {
                get: function () {
                    return this.songs[this.currenIndex];
                }
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThum.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currenIndex++
        if(this.currenIndex > this.songs.length-1){
            this.currenIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currenIndex--
        if(this.currenIndex < 0){
            this.currenIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    randomSong: function () {
        let NewIndex
        do{
            NewIndex = Math.floor(Math.random() * this.songs.length);
        }while(NewIndex === this.currenIndex)
        this.currenIndex = NewIndex;
        this.loadCurrentSong();
    },
    start: function () {

        this.defineProperties();

        this.handleEvent();

        this.loadCurrentSong();

        // In ra danh sách bài hát
        this.render();
    }
}

app.start();