/*-----------------------------------------------
 * Scroll Navigaiton [現在地の項目をナビゲーションにカレントするやつ]
-------------------------------------------------*/
const NAV_ACTIVE_CLASSNAME = 'is-active';
const navlists = document.querySelectorAll('.js-navlink');
const nav_option = {
	threshold: 0,
	rootMargin: '-10px 0px -65%',
}

navlists.forEach(navlist =>{
	const nav_target = document.querySelector(navlist.getAttribute('data-nav'));
	const nav_observer = new IntersectionObserver(([{isIntersecting}]) => {
		if (isIntersecting) {
			navlists.forEach(el => el.classList.remove(NAV_ACTIVE_CLASSNAME));
			navlist.classList.add(NAV_ACTIVE_CLASSNAME);
		}
	},nav_option);
	nav_observer.observe(nav_target);
})




/*-----------------------------------------------
 * YouTube API
-------------------------------------------------*/
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;

var ytID = [_default_ytid];
var ytNow = 0;
var ytSize = 'large';

function onYouTubeIframeAPIReady() {
	player = new YT.Player('js-yt-autoplay', {
		height: '100%',
		width: '100%',
		videoId:ytID[0],
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange,
			'onError':onPlayerError
		},
		playerVars: {
			rel:0,
			controls:0,
			disablekb:1,
			fs:0,
			iv_load_policy:3,
			showinfo:0,
			modestbranding:1,
			playsinline : 1,
		}
	});
}
function onPlayerReady(event) {
	event.target.mute();
	event.target.playVideo();
}
function onPlayerStateChange(event) {
	if(event.data == YT.PlayerState.ENDED){
		ytNow++;
		if(ytNow >= ytID.length){
			ytNow = 0;
		}
		if(ytNow < 0){
			ytNow = ytID.length - 1;
		}
		player.clearVideo();
		player.loadVideoById(ytID[ytNow],0,ytSize);
		player.playVideo();
	}
}
function stopVideo() {
	player.stopVideo();
}
function onPlayerError(event){
	//console.log(event);
}




/*-----------------------------------------------
 * THEAD BANNER
-------------------------------------------------*/
var tHeadBannerSwiper,
	tHeadBannerSwiperchk = 0;

tHeadBanner(spOnly);

//resizeEvent
spOnly.addListener(tHeadBanner);

function tHeadBanner(mm){
	var tHeadBannerList = document.getElementById('thead_BannerLists').childElementCount;
	if(mm.matches && tHeadBannerList >= 2){
		// SP ONLY
		tHeadBannerSwiper = new Swiper('.js-thead_BannerSwiper', {
			slidesPerView: 'auto',
			loop: true,
			pagination: {
				el: ".js-thead_BannerLists-pagination",
				clickable: true,
			},
			centeredSlides: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false,
			},
		})
		tHeadBannerSwiperchk = 1;
	}else{
		if(tHeadBannerSwiperchk == 1){
			tHeadBannerSwiper.destroy(false,true);
			setTimeout(()=>{
				var tHeadBannerList = document.getElementById('thead_BannerLists').childElementCount;
				if(tHeadBannerList >= 4){
					tHeadBannerSwiper = new Swiper('.js-thead_BannerSwiper', {
						slidesPerView: 'auto',
						loop: true,
						pagination: {
							el: ".js-thead_BannerLists-pagination",
							clickable: true,
						},
						autoplay: {
							delay: 5000,
							disableOnInteraction: false,
						},
						breakpoints: {
							0:{
								centeredSlides: true,
							},
							768: {
								centeredSlides: false,
							},
						}
					})
					tHeadBannerSwiperchk = 1;
				}
			},10);
		}
	}
}



/*-----------------------------------------------
 * INTROSTORY - BG
-------------------------------------------------*/
function introstoryBG(){
	var ww = window.innerWidth,
		is = document.getElementById('introstory'),
		isH = is.offsetHeight,
		contW = document.getElementById('introductionCont').clientWidth;
	if(isH > ww){
		is.classList.add('--longH');
	}else{
		is.classList.remove('--longH');
	}
}




/*-----------------------------------------------
 * RESIZEEVENT [TOP]
-------------------------------------------------*/
function resize(){
	introstoryBG();
}
window.addEventListener('resize',resize);


/*-----------------------------------------------
 * RESIZEEVENT [TOP]
-------------------------------------------------*/
lenis.stop();
function load(){
	introstoryBG();
	tLoading();
}
window.addEventListener('load',load);



/*-----------------------------------------------
 * BOOK
-------------------------------------------------*/
function bookSwiper(){
	let bookList = document.getElementById('bookLists').childElementCount,
		bookSwiper;
	if(bookList >= 4){
		bookSwiper = new Swiper('.js-bookListsSwiper', {
			slidesPerView: 'auto',
			scrollbar: {
				el: '#book .js-contSwiper_scrlbar',
				draggable: true,
			},
		})
	}
}
bookSwiper();



/*-----------------------------------------------
 * TOP NAV
----------------------------------------------- */
//TOP HEAD top_fixed
function sr(){
	var scT = $(window).scrollTop();
	var ww = window.innerWidth;
	var wh = window.innerHeight;
	var TopH = $("#visualArea").outerHeight();
	if(ww > 769){
		if(scT > TopH && wh){
			// console.log('#mvより高くwhより高いからモーダルメニューを表示させます');
			$(".js-header").addClass('-show');
		}else{
			// console.log('#mvより高くwhより低い');
			$(".js-header").removeClass('-show');
		}
	}
}
$(window).on('load resize scroll', sr);




/*-----------------------------------------------
 * Random randomCircle
-------------------------------------------------*/
function randomCircle(id){
	//Action ClassName or id
	var wrap = $(id);

	//CircleList
	var circleList = [
		'tLoading__circle -a',
		'tLoading__circle -b',
		'tLoading__circle -c',
		'tLoading__circle -d',
		'tLoading__circle -e',
		'tLoading__circle -f',
		'tLoading__circle -g'
	];

	//配列の数だけ繰り返し処理
	for( var i = 0; i < circleList.length; i++){

		//位置・大きさ配列設定
		var x = Math.floor(Math.random() * 80);
		var y = Math.floor(Math.random() * 80);
		var scale = Math.floor(Math.random() * (150 - 60) + 60);
		var opacity = Math.floor(Math.random() * (80 - 40) + 40);

		//要素に要素を追加
		wrap.append('<div class="tLoading__circleCont" style="top:'+y+'%; left:'+x+'%; transform:scale('+scale+'%); opacity:'+opacity+'%;"><div class="'+circleList[i]+'"></div></div>');
	}
	setTimeout(()=>{
		$("#tLoading").addClass('--circleStandby');
		setTimeout(()=>{
			$("#tLoading").addClass('--textReady');
			setTimeout(()=>{
				$("#tLoading").addClass('--loadingAni');
				setTimeout(()=>{
					$("body").addClass('--lani-fin');
				},400);
			},800);
		},800);
	},100);
}
randomCircle('.js-tLoading__circle');


function tLoading(){
	var hs = location.hash;
	let $body = $("body");
	if(hs){
		var target = $(hs);
		var position = target.offset().top;
		$('body,html').animate({scrollTop:position}, 10, 'easeOutQuart');
	}else{
		$('body,html').animate({scrollTop:0}, 10, 'easeOutQuart');
	}
	$body.addClass('--is-loaded');
	setTimeout(()=>{
		if($body.hasClass('--lani-fin')){
			setTimeout(()=>{
				$("#tLoading").fadeOut(800,function(){
					$("#tLoading").remove();
					$body.css({'overflow': ''});
					lenis.start();
					set_scrani();
					setTimeout(()=>{
						$body.addClass('--lani-removed');
					},500);
				});
			},200);
		}else{
			setTimeout(()=>{
				$body.addClass('--lani-fin');
				setTimeout(()=>{
					$("#tLoading").fadeOut(800,function(){
						$("#tLoading").remove();
						$body.css({'overflow': ''});
						lenis.start();
					});
					setTimeout(()=>{
						set_scrani();
						$body.addClass('--lani-removed');
					},500);
				},1000);
			},1000);
		}
	},600);
}



/*-----------------------------------------------
 * VISUAL CHANGE
-------------------------------------------------*/
function visualChange(_visual){
	let visuaalAreaImage = document.querySelector('#visualAreaImage');
	visuaalAreaImage.dataset.selectvisual = _visual;
}