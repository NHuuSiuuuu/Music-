/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek: kéo thanh progress đến vị trí nào thì tua đến vị trí đó
 * 4. CD rotate
 * 5. Next / Prev
 * 6. Radom
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 * 
 * **/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playList = $('.playlist');
const cd = $('.cd');
const headerH2 = $('.header h2');
const headerH4 = $('.header h4');
const cdThumb = $('.cd-thumb');
const playBtn = $('.btn-toggle-play');
const audio = $('#audio');
const player = $('.container');
const iconPause = $('#fa-pause icon-pause');
const playIcon = $('#playIcon');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
// const playList = $('playlist');
const cdWidth = cd.offsetWidth; // lấy chiều rộng gốc của cd



const app = {
    songs: [
        {
            name: 'Song 1',
            singer: 'Singer 1',
            path: 'assets/music/song1.mp3',
            image: 'assets/img/img1.png'
        }, {
            name: 'Song 2',
            singer: 'Singer 2',
            path: 'assets/music/song2.mp3',
            image: 'assets/img/img2.png'
        }, {
            name: 'Song 3',
            singer: 'Singer 3',
            path: 'assets/music/song3.mp3',
            image: 'assets/img/img3.png'
        },
        {
            name: 'Song 4',
            singer: 'Singer 4',
            path: 'assets/music/song4.mp3',
            image: 'assets/img/img4.png'
        }, {
            name: 'Song 5',
            singer: 'Singer 5',
            path: 'assets/music/song5.mp3',
            image: 'assets/img/img5.png'
        }, {
            name: 'Song 6',
            singer: 'Singer 6',
            path: 'assets/music/song6.mp3',
            image: 'assets/img/img6.png'
        },
        {
            name: 'Song 7',
            singer: 'Singer 7',
            path: 'assets/music/song7.mp3',
            image: 'assets/img/img7.png'
        },
        {
            name: 'Song 8',
            singer: 'Singer 1',
            path: 'assets/music/song1.mp3',
            image: 'assets/img/img1.png'
        }, {
            name: 'Song 9',
            singer: 'Singer 2',
            path: 'assets/music/song2.mp3',
            image: 'assets/img/img2.png'
        }, {
            name: 'Song 10',
            singer: 'Singer 3',
            path: 'assets/music/song3.mp3',
            image: 'assets/img/img3.png'
        },

    ],
    currentIndex: 0,
    renderSong: function () {
        const html = this.songs.map(function (song, index) { ////Chỉ bài hát đang phát mới thêm class active
            return `
            <div class="song ${index === app.currentIndex ? 'active' : ''} " data-index=${index} > 
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = html.join('')
    },
    // Định nghĩa thuộc tính ảo
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Hàm lắng nghe sự kiện
    handleEvents: function () {
        const _this = this;
        let Playing = false;
        let isRepeat = false;
        let isRandom = false;
        // Sự kiện cd quay
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg) scale(1)' }
        ], {
            duration: 10000, // Time quay 1 vòng
            iterations: Infinity, // Số lần quay          
        })
        // Xử lý sự kiện thanh progress chạy
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressActive = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressActive
            }
            // console.log(progressActive)
        }
        // Xử lsy sự kiện khi tua
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value; //Tính ra thời gian tương ứng với phần trăm (ví dụ kéo đến 50% thì...)
            audio.currentTime = seekTime // Đặt thời gian hiện tại của bài hát
        }
        // Dừng quay
        cdThumbAnimate.pause();
        // Sự kiện kéo tab từ trên xuống
        window.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newidthCd = cdWidth - scrollTop
            cd.style.width = newidthCd > 0 ? newidthCd + 'px' : 0
            cd.style.opacity = newidthCd / cdWidth;
        }
        // Sự kiện click vào play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true;
            cdThumbAnimate.play();
            playIcon.classList.remove('fa-play')
            playIcon.classList.add('fa-pause')
            _this.scrollToActiveSong();
        }
        audio.onpause = function () {
            _this.isPlaying = false;
            cdThumbAnimate.pause();
            playIcon.classList.remove("fa-pause");
            playIcon.classList.add("fa-play");
            _this.scrollToActiveSong();
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            _this.renderSong();
            audio.play();
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            _this.renderSong();
            audio.play();
        }
        // xử lý click vào repeat
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        // Xử lý sự kiện sau khi hết bài (repeat)
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }
        // Xử lý khi click vào radom
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // Xử lý khi click vào list song
        playList.onclick = function (e) {
            songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) { // nếu ko phải là active hoặc là option thì thực thi 
                if (songNode) {
                    _this.currentIndex = songNode.getAttribute('data-index')
                    _this.loadCurrentSong();
                    audio.play();
                    _this.renderSong();
                }
            }
            if (e.target.closest('.option')) {
                alert('Chưa có gì đâu')

            }
        }










    },
    loadCurrentSong: function () {
        headerH2.textContent = this.currentSong.name;
        headerH4.textContent = this.currentSong.singer;
        audio.src = this.currentSong.path
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`

    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    arrRandomSong: [],
    randomSong: function () {
        let newIndex; // Lưu chỉ số bài hát mới
        // Nếu tất cả bài hát đã được phát
        if (this.arrRandomSong.length >= this.songs.length) {
            this.arrRandomSong = [] // resest lại mảng
        }
        // Tạo chỉ số ngẫu nhiên 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)// Tạo số ngẫu nhiên trong bài hát
        } while (this.arrRandomSong.includes(newIndex)) //Lặp lại nếu newIndex đã có trong arrRandomSong
        this.arrRandomSong.push(newIndex) // Lưu lại index đã chọn cho vào mảng 
        this.currentIndex = newIndex; // cập nhật chỉ số bài hát hiện tại

        console.log(app.arrRandomSong)
        this.loadCurrentSong(); // tải bài hát mới theo index vừa chọn

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    start: function () {
        this.defineProperties();

        this.handleEvents();
        this.loadCurrentSong();

        this.renderSong();

        // Định nghĩa thuộc tính this.currentSong


    }

}
app.start();