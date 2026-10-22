/*-----------------------------------------------
 * Root
-------------------------------------------------*/
let root = $("body").data('root');
let page = $("body").data('page');
const pcOnly = window.matchMedia('(min-width: 768px)');
const spOnly = window.matchMedia('(max-width: 767px)');


/*-----------------------------------------------
 * COMMON
-------------------------------------------------*/
$(function(){

	// Anchor Smooth Scroll
	$('.js-anchor').on('click', function(){
		var speed = 1000;
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$('body,html').animate({scrollTop:position}, speed, 'easeOutQuart');
		return false;
	});

	// Menu
	$('.js-menu').on('click', function(){
		$(this).toggleClass('is-active');
		
		if($(this).hasClass('is-active')){
			$('.js-header').addClass('is-active');
			$("body").css({'overflow':'hidden'});
			lenis.stop();
		} else {
			$('.js-header').removeClass('is-active');
			$("body").css({'overflow':''});
			lenis.start();
		}
	});
	$('.headerNavLists .navList .navList__link').on('click', function(){
		$('.js-menu').removeClass('is-active');
		$('.js-header').removeClass('is-active');
		$("body").css({'overflow':''});
		lenis.start();
	});


	/**
	 * Modal open
	 */
	// Common
	$('.js-modalOpen').on('click', function(){
		var modalID = $(this).data('modal');
		$("body").addClass('--modalOpen');
		$('#' + modalID).fadeIn(500);
		$('.modalBox').fadeIn(500);
		$('body').css({'overflow':'hidden'});
		lenis.stop();
	});

	// Youtube
	$('.js-youtubePlay').on('click', function(){
		var ytID = $(this).data('ytid');
		var ytURL = 'https://www.youtube.com/embed/'+ytID+'?autoplay=1&rel=0';
		setTimeout(function(){
			$('.js-youtubeIframe').attr('src',ytURL);
		},100);
		lenis.stop();
	});


	/**
	 * Modal close
	 * iframeのsrcをcloseの際に消す
	 */
	var $modalIF = $('.js-youtubeIframe');

	// Close処理
	function modalClose() {
		if($("body").hasClass('--fileloadModal')){
			$("body").removeClass('--fileloadModal');
			setTimeout(()=>{
				$(".js-fileLoad").html('');
			},500);
		}
		$('.modalBox, .oneModal').fadeOut(500);
		$("body").removeClass('--modalOpen');
		setTimeout(function(){
			$modalIF.attr('src','');
			$(".modalBox").attr('data-option','');
		},500);
		$('body').css({'overflow':''});
		lenis.start();
	}

	// Closeボタン
	$('.js-modalClose').on('click', function(){
		modalClose();
	});

	// Close エリア外
	$('.js-oneModalIn').on('click touchend', function(e) {
		if (!$(e.target).closest('.js-oneModalIn__cont').length) {
			modalClose();
		}
	});
});


/*-----------------------------------------------
 * Get the URL parameter value
----------------------------------------------- */
/**
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}



/*-----------------------------------------------
 * ACCESS HISTORY [セッションストレージを使用して初回アクセスか判定するやつ]
----------------------------------------------- */
function accessHistory() {
	const keyName = 'visited';
	const keyValue = true;
	if (!sessionStorage.getItem(keyName)) {
		//FIRST ACCESS
		sessionStorage.setItem(keyName, keyValue);
		return true;
	} else {
		$('body').addClass('is-visited'); 
		return false;
	}
}
$(document).ready(accessHistory());



/*-----------------------------------------------
 * Lenis[Scroll]
-------------------------------------------------*/
const lenis = new Lenis()

// lenis.on('scroll', (e) => {
//   console.log(e)
// })

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)


/*-----------------------------------------------
 * ScrollAnimation for IntersectionObserver [.js-scrani 要素が見えたら is-ani をaddclass するやつ]
-------------------------------------------------*/
const set_scrani = () =>{
	const SCRANI_ACTIVE_CLASSNAME = '--is-ani';
	const scrani_callback = (entries) => {
		//各 entry（IntersectionObserverEntry オブジェクト）に対して
		entries.forEach( (entry) => {
			//監視対象の要素が領域内に入った場合の処理
			if (entry.isIntersecting) {
				//監視対象の要素（entry.target）に is-ani クラスを追加
				entry.target.classList.add(SCRANI_ACTIVE_CLASSNAME);
			}
		});
	}
	const scrani_option = {
		rootMargin: '-30% 0px',
	}
	const scrani_observer = new IntersectionObserver(scrani_callback, scrani_option);

	const target_scrani = document.querySelectorAll('.js-scrani');
	//全ての監視対象要素を observe() メソッドに指定
	target_scrani.forEach( (elem) => {
		//observe() に監視対象の要素を指定
		scrani_observer.observe(elem);
	});
}
if(page !== "top"){
	setTimeout(function(){
		set_scrani();
	},200);
}


/*-----------------------------------------------
 * MOVIE
-------------------------------------------------*/
function movie(_ytid,_option){
	$('#youtubeModal').fadeIn(500);
	if(_option){
		$(".modalBox").attr('data-option',_option);
	}
	$('.modalBox').fadeIn(500);
	$("body").addClass('--modalOpen');
	var ytURL = 'https://www.youtube.com/embed/'+_ytid+'?autoplay=1&rel=0';
	setTimeout(function(){
		$('.js-youtubeIframe').attr('src',ytURL);
	},100);
	$('body').css({'overflow':'hidden'});
	lenis.stop();
}

// YouTube Iframe 二重再生防止 [movie1つのみ]
$(".js-moviePlay").on('click', function(){
	if(page = 'top'){
		player.stopVideo();
	}
	$('body').addClass('--yt-apmov-stop');
	$(".js-modalBox").addClass('js-modalplayClose');
});

$(document).on('click','.js-modalplayClose a.js-modalClose', function(){
	if(page = 'top'){
		player.playVideo();
	}
	$(".modalBox").removeClass('js-modalplayClose');
	$('body').removeClass('--yt-apmov-stop');
});

$(document).on('click','.js-modalplayClose .js-oneModalIn', function(e) {
	if(page = 'top'){
		player.playVideo();
	}
	$(".modalBox").removeClass('js-modalplayClose');
	$('body').removeClass('--yt-apmov-stop');
});

function ytThumb(){
	$(".js-ytThumb").each(function(){
		var ytid = $(this).data('ytid');
		var imgHtml = '<img src="//img.youtube.com/vi/' + ytid + '/sddefault.jpg" alt="YouTube Thumbnail">';
		$(this).find(".btn_movie-img").html(imgHtml);
	});
}
ytThumb();


/*-----------------------------------------------
 * CHANGE COLOR
-------------------------------------------------*/
let i,n,maxColor,cInterval,$body,_nx,ni,nn,_navx;
	maxColor = 7; /* カラーの数 */
	maxNavColor = 6;/* ナビ背景用カラー数[PC] */
	cInterval = 5000;/* 切り換えまでの時間 */
function changeColor(i){
	n = i - 1;
	if(n < 1){
		i = 1;
	}
	$body = document.body;
	$body.setAttribute("data-color", i);
}
function changeNavColor(ni){
	nn = ni - 1;
	if(nn < 1){
		ni = 1;
	}
	$body = document.body;
	$body.setAttribute("data-navcolor", ni);
}

function changeColorInterval(){
	// ChangeColor
	changeColor(1);
	_nx = 2;
	colorSlide = setInterval(function(){
		changeColor(_nx);
		_nx++;
		if(_nx > maxColor){
			_nx  = 1;
		}
	},cInterval);

	// NavColor
	changeNavColor(1);
	_nvx = 2;
	changeNavColorSlide = setInterval(function(){
		changeNavColor(_nvx);
		_nvx++;
		if(_nvx > maxNavColor){
			_nvx  = 1;
		}
	},cInterval);
}

changeColorInterval();


/*-----------------------------------------------
 * COMMENT
-------------------------------------------------*/
function comment(_comment, _cid, _option){
	// HTML RESET
	$("#js-commentModalCont").html('');
	$("#commentCont").removeClass();

	// commentParts Setting
	let commentParts;
	if(_comment == 'staff'){
		commentParts = staff[_cid];
	}else if(_comment == 'cast'){
		commentParts = cast[_cid];
	}

	// OPTION
	if(_option){
		$("#commentCont").addClass(_option);
	}

	// IMG CHACK 
	let commentImg = '';
	if(commentParts.img){
		commentImg+='<div class="commentCont__image"><div class="commentCont__imageIn"><img src="'+root+'assets/img/comment/'+commentParts.img+'" alt="'+commentParts.name+'" class="-ndlimg"></div></div>';
	}

	//HTML
	$("#js-commentModalCont").append('<div class="commentCont__detail"><h3 class="commentCont_h3"><span class="commentCont_h3-job"><span>'+commentParts.job+'</span></span><span class="commentCont_h3-name">'+commentParts.name+'</span></h3><div class="commentCont_txt">'+commentParts.comment+'</div></div>'+commentImg+'');

	// MODALOPEN
	$('#commentModal').fadeIn(500);
	$('.modalBox').fadeIn(500);
	$("body").addClass('--modalOpen');
	$('body').css({'overflow':'hidden'});
	lenis.stop();
}



/*-----------------------------------------------
 * TOGGLE - ALL
-------------------------------------------------*/
$(".js-toggleBtn").on('click',function(){
	$(this).parent('.toggleContent').toggleClass('--is-active');
	if($(this).parent('.toggleContent').hasClass('--is-active')){
		$('.toggleContent').removeClass('--is-active');
		$('.js-toggleContentIn').removeClass('--active').slideUp(200);
		$(this).parent('.toggleContent').addClass('--is-active');
		$(this).next('.js-toggleContentIn').slideDown(200);
		$(this).next('.js-toggleContentIn').queue(function() {
			$(this).addClass('--active').dequeue();
		});
	}else{
		$(this).next('.js-toggleContentIn').removeClass('--active').delay(300).slideUp(200);
	}
});



/*-----------------------------------------------
 * cLoading
-------------------------------------------------*/
var arr,sf,j,t,sfv;
function shuffleLoading(){
	arr = ["arata","banri","seiha","ouka","minami","kotono","shion"];
	sf = arr.length;

	while(sf){
		j = Math.floor(Math.random() * sf);
    	t = arr[--sf];
		arr[sf] = arr[j];
		arr[j] = t;
	}
	$body = document.body;
	sfv = arr[0];

	$body.setAttribute("data-cload", sfv);
}
shuffleLoading();

function cLoading(){
	setTimeout(()=>{
		document.body.classList.add('--is-loaded');
		setTimeout(()=>{
			set_scrani();
			lenis.start();
			let loadAniElement = document.querySelector('.js-loadani');
			loadAniElement.classList.add('--is-ani');
		},600);
		setTimeout(()=>{
			$(".cLoading").remove();
		},1000);
	},500);
}

if(page !== "top"){
	lenis.stop();
	window.addEventListener('load',cLoading);
}


/*-----------------------------------------------
 * Forced reload
-------------------------------------------------*/
window.onpageshow = function(event) {
    if (event.persisted) {
         window.location.reload();
    }
};


/*-----------------------------------------------
 * imgModal
-------------------------------------------------*/
function imgModal(_file,_option,_element){
	$("#imgModal").attr('data-option','');
	let vimg,_optxt;
	_optxt = '';
	if(_option){
		$("#imgModal").attr('data-option',_option);
		if(_option == '-txt'){
			_optxt = '<p class="imgModalImage__txt">'+_element+'</p>';
		}
	}
	vimg = `<img src="`+ _file +`" class="-ndlimg" onmousedown="return false" oncopy="return false" onselectstart="return false" oncontextmenu="return false">`;
	$(".js-imgModalImage").html(vimg+_optxt);
	$('#imgModal').fadeIn(500);
	$('.modalBox').fadeIn(500);
	$("body").addClass('--modalOpen');
	$('body').css({'overflow':'hidden'});
	lenis.stop();
}




/*-----------------------------------------------
 * imgSwiperModal
-------------------------------------------------*/
function imgSwiperModal(_file,_option,_swiperOption){
	$("#imgSwiperModal").attr('data-option','');
	if(_option){
		$("#imgSwiperModal").attr('data-option',_option);
	}
	$(".js-imageSwiperCont").load(_file, function(){
		imgSwiper(_swiperOption);

		$('#imgSwiperModal').fadeIn(500);
		$('.modalBox').fadeIn(500);
		$("body").addClass('--modalOpen').addClass('--fileloadModal');
		$('body').css({'overflow':'hidden'});
		lenis.stop();
	});
}

function imgSwiper(_swiperOption){
	var slideLength =  $(".imageSlideLists li").length;
	if(slideLength > 1){
		let imgSwiper_nav_next,imgSwiper_nav_prev;
			imgSwiper_nav_next = ".imageSwiperArrow.-r",
			imgSwiper_nav_prev = ".imageSwiperArrow.-l";
		if(_swiperOption == 'rtl'){
			imgSwiper_nav_next = ".imageSwiperArrow.-l",
			imgSwiper_nav_prev = ".imageSwiperArrow.-r";
		}

		let imageModalSwiper = new Swiper(".js-imageSwiper",{
			navigation: {
				nextEl: imgSwiper_nav_next,
				prevEl: imgSwiper_nav_prev,
			},
		});
	}else{
		$(".imageSwiperContIn").addClass('--noSwiper');
	}
}