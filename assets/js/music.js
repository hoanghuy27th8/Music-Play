const btnIconPlay = document.querySelector('.btn.btn-play i.fa-circle-play');
const btnIconPause = document.querySelector('.btn.btn-play i.fa-circle-pause');

const PLAY_STORAGE_KEY = "F8 config"
const heading = document.querySelector('header h2')
const cdThum = document.querySelector('.cd-thurm')
const audio = document.querySelector('#audio')
const btnPlay = document.querySelector('.btn-play')
const player = document.querySelector('.player')
const playlist = document.querySelector('.playlist')
const btnRandom = document.querySelector('.btn-random')
const btnPreat = document.querySelector('.btn-repeat')
const app = {
    isPlaying: false,
    currenIndex: 0,
    isRandom: false,
    isPreat: false,
    config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config))
    },
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
                <div class="song ${index  === app.currenIndex ? 'active' : ""}" data-index ="${index}">
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
        const control = document.querySelector('.control')
        const contolHeight = control.clientHeight

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
            // Fix loi thay doi height cua lop control khi an PLay
            if(control.clientHeight !== contolHeight){
                control.style.height = contolHeight + 'px'
            }
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
           _this.setConfig("isRandom", _this.isRandom)
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
           _this.setConfig("isPreat", _this.isPreat)
            btnPreat.classList.toggle("active", _this.isPreat)
        }
        // Xu ly khi click playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)")
            // Click khi click vao song chuyen den bai vua click
            if(songNode || e.target.closest(".option")){
                // Khi cclick vao song
                if(songNode){
                    const indexSongSelect = Number(songNode.dataset.index)
                    _this.currenIndex = indexSongSelect;
                    _this.render()
                    _this.loadCurrentSong();
                    audio.play()
                }
                // Khi click vao option
                if(e.target.closest(".option")) {

                }
            }
        }

    },
    scrollToACtive: function () {
        setTimeout(() => {
            if(this.currenIndex === 0 || this.currenIndex === 1){
                document.querySelector('.song.active').scrollIntoView({
                    behavior:'smooth',
                    block:'end'
                })
            }else {
                document.querySelector('.song.active').scrollIntoView({
                    behavior:'smooth',
                    block:'nearest'
                })
            }
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
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isPreat = this.config.isPreat
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
        // Gan cau hinh tu config vao app
        this.loadConfig();

        // DInh nghia proerty
        this.defineProperties();

        // Xu ly su kien
        this.handleEvent();

        this.loadCurrentSong();

        // In ra danh sách bài hát
        this.render();

        btnPreat.classList.toggle("active", this.isPreat)
        btnRandom.classList.toggle("active", this.isRandom)
    }
}

app.start();