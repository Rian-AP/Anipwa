/**
 * ANIPOCKET SHIUNJI HYBRID ENGINE
 */

(function () {
  const API_BASE = "https://api.yani.tv";
  const TOKEN = "***";

  const defaultHeaders = {
    "X-Application": TOKEN,
    "Accept": "application/json, image/avif, image/webp",
    "Lang": "ru",
  };

  function fixImageUrl(url) {
    if (!url) return "./assets/img/common/logo.svg";
    if (url.startsWith("//")) return "https:" + url;
    if (url.startsWith("/")) return API_BASE + url;
    return url;
  }

  // --- API ---
  const YaniApi = {
    async getCatalog() {
      const res = await fetch(`${API_BASE}/anime/catalog`, { headers: defaultHeaders });
      const json = await res.json();
      return json.response;
    },
    async getSchedule() {
      const res = await fetch(`${API_BASE}/anime/schedule`, { headers: defaultHeaders });
      const json = await res.json();
      return json.response || [];
    },
    async getAnime(id) {
      const res = await fetch(`${API_BASE}/anime/${id}`, { headers: defaultHeaders });
      const json = await res.json();
      return json.response;
    },
    async getVideos(animeId) {
      const res = await fetch(`${API_BASE}/anime/${animeId}/videos`, { headers: defaultHeaders });
      const json = await res.json();
      return json.response || [];
    },
    async search(query) {
      const res = await fetch(`${API_BASE}/anime?q=${encodeURIComponent(query)}&limit=15`, { headers: defaultHeaders });
      const json = await res.json();
      return json.response || [];
    }
  };

  // State
  let currentAnime = null;
  let currentVideos = [];
  let currentDub = "";
  let currentEp = 1;
  let catalogList = [];

  // --- Modal Controllers ---
  function openModal(modalId) {
    $('.oneModal').hide();
    $(modalId).show();
    $('.modalBox').fadeIn(300);
    $('body').addClass('--modalOpen').css({'overflow':'hidden'});
    if (window.lenis) window.lenis.stop();
  }

  function closeModal() {
    $('.modalBox').fadeOut(250);
    $('.oneModal').fadeOut(250);
    $('body').removeClass('--modalOpen').css({'overflow':''});
    if (window.lenis) window.lenis.start();
    // Stop video playback
    $('#anipocketIframe').attr('src', '');
  }

  // --- Open Anime Player / Details ---
  async function openAnimeDetails(animeIdOrObj) {
    let anime = animeIdOrObj;
    if (typeof animeIdOrObj === 'string' || typeof animeIdOrObj === 'number') {
      anime = await YaniApi.getAnime(animeIdOrObj);
    }
    currentAnime = anime;

    $('#anipocketModalTitle').text(anime.title);
    $('#anipocketModalSubtitle').text(anime.other_titles?.[0] || (anime.year ? `${anime.year} год` : ''));
    $('#anipocketSynopsis').text(anime.description || "Описание временно отсутствует.");

    // Fill 5 ratings
    const r = anime.rating || {};
    $('#scoreYummy').text(Number(r.average || 0).toFixed(1));
    $('#scoreShikimori').text(r.shikimori_rating ? Number(r.shikimori_rating).toFixed(1) : '-');
    $('#scoreMal').text(r.myanimelist_rating ? Number(r.myanimelist_rating).toFixed(1) : '-');
    $('#scoreKp').text(r.kp_rating ? Number(r.kp_rating).toFixed(1) : '-');
    $('#scoreWa').text(r.worldart_rating ? Number(r.worldart_rating).toFixed(1) : '-');

    // Fetch Videos
    $('#anipocketEpGrid').html('<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">Загрузка серий...</div>');
    $('#anipocketDubList').empty();

    openModal('#anipocketModal');

    const vids = await YaniApi.getVideos(anime.anime_id);
    currentVideos = vids;

    if (!vids.length) {
      $('#anipocketEpGrid').html('<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">Видео пока не добавлены</div>');
      return;
    }

    // Extract dubbings
    const dubs = Array.from(new Set(vids.map(v => v.data?.dubbing).filter(Boolean)));
    currentDub = dubs[0] || "Озвучка";

    // Render Dubbing Pills
    $('#anipocketDubList').html(dubs.map(d => `
      <button class="anipocketDubPill ${d === currentDub ? 'is-active' : ''}" data-dub="${d}">
        ${d}
      </button>
    `).join(''));

    renderEpisodeButtons();
  }

  function renderEpisodeButtons() {
    const eps = currentVideos
      .filter(v => (v.data?.dubbing || "Озвучка") === currentDub)
      .sort((a, b) => Number(a.index || a.number) - Number(b.index || b.number));

    if (!eps.length) {
      $('#anipocketEpGrid').html('<div style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">Нет доступных серий</div>');
      return;
    }

    $('#anipocketEpGrid').html(eps.map(ep => `
      <button class="anipocketEpBtn ${ep.number == currentEp ? 'is-active' : ''}" data-vid="${ep.video_id}" data-ep="${ep.number}">
        <span>${ep.number}</span>
      </button>
    `).join(''));

    // Select first episode if not selected
    const activeVid = eps.find(e => e.number == currentEp) || eps[0];
    playVideo(activeVid);
  }

  function playVideo(videoObj) {
    if (!videoObj) return;
    currentEp = videoObj.number;
    $('.anipocketEpBtn').removeClass('is-active');
    $(`.anipocketEpBtn[data-ep="${currentEp}"]`).addClass('is-active');

    if (videoObj.iframe_url) {
      $('#anipocketIframe').attr('src', videoObj.iframe_url);
    }
  }

  // --- Dom Init ---
  $(document).ready(async function () {
    // 1. Injected Markup for Modal & Search inside .modalBox
    $('.modalBox').append(`
      <!-- Anipocket Player Modal -->
      <div id="anipocketModal" class="oneModal">
        <div class="oneModalIn">
          <div class="oneModalIn__cont anipocketModalBox">
            <div class="anipocketModal_header">
              <div>
                <h3 id="anipocketModalTitle" class="anipocketModal_title">Title</h3>
                <p id="anipocketModalSubtitle" class="anipocketModal_subtitle">Subtitle</p>
              </div>
            </div>
            <div class="anipocketModal_body">
              <div class="anipocketPlayerWrap">
                <iframe id="anipocketIframe" class="anipocketPlayerIframe" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>
              </div>

              <!-- Dubbings -->
              <div class="anipocketDubSection">
                <div class="anipocketSectionTitle">VOICE OVER • ОЗВУЧКА</div>
                <div id="anipocketDubList" class="anipocketDubList"></div>
              </div>

              <!-- Episodes -->
              <div class="anipocketSectionTitle">EPISODES • СЕРИИ</div>
              <div id="anipocketEpGrid" class="anipocketEpGrid"></div>

              <!-- 5 Ratings -->
              <div class="anipocketSectionTitle">RATINGS • ОЦЕНКИ</div>
              <div class="anipocketRatingGrid">
                <div class="anipocketRatingCard">
                  <div id="scoreYummy" class="anipocketRatingScore">0.0</div>
                  <div class="anipocketRatingLabel">YummyAnime</div>
                </div>
                <div class="anipocketRatingCard">
                  <div id="scoreShikimori" class="anipocketRatingScore">-</div>
                  <div class="anipocketRatingLabel">Shikimori</div>
                </div>
                <div class="anipocketRatingCard">
                  <div id="scoreMal" class="anipocketRatingScore">-</div>
                  <div class="anipocketRatingLabel">MyAnimeList</div>
                </div>
                <div class="anipocketRatingCard">
                  <div id="scoreKp" class="anipocketRatingScore">-</div>
                  <div class="anipocketRatingLabel">Кинопоиск</div>
                </div>
                <div class="anipocketRatingCard">
                  <div id="scoreWa" class="anipocketRatingScore">-</div>
                  <div class="anipocketRatingLabel">WorldArt</div>
                </div>
              </div>

              <!-- Synopsis -->
              <div class="anipocketSectionTitle">SYNOPSIS • ОПИСАНИЕ</div>
              <div id="anipocketSynopsis" class="anipocketSynopsis"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Anipocket Search Modal -->
      <div id="anipocketSearchModal" class="oneModal">
        <div class="oneModalIn">
          <div class="oneModalIn__cont anipocketSearchBox">
            <div class="anipocketSearchInputWrap">
              <input type="text" id="anipocketSearchInput" class="anipocketSearchInput" placeholder="Поиск аниме по названию (на русском или английском)..." autofocus />
            </div>
            <div id="anipocketSearchResults" class="anipocketSearchResults">
              <div style="padding: 20px; text-align: center; color: #888; font-size: 13px;">Введите название для поиска...</div>
            </div>
          </div>
        </div>
      </div>
    `);

    // Close button event
    $('.js-modalClose').on('click', closeModal);
    $('.modalBox').on('click', function (e) {
      if ($(e.target).hasClass('modalBox') || $(e.target).hasClass('oneModalIn')) {
        closeModal();
      }
    });

    // Dubbing selection
    $(document).on('click', '.anipocketDubPill', function () {
      currentDub = $(this).data('dub');
      $('.anipocketDubPill').removeClass('is-active');
      $(this).addClass('is-active');
      renderEpisodeButtons();
    });

    // Episode selection
    $(document).on('click', '.anipocketEpBtn', function () {
      const vidId = $(this).data('vid');
      const v = currentVideos.find(x => x.video_id == vidId);
      playVideo(v);
    });

    // 2. Add Search Button to Header
    $('.headerIn .navListGroup .navList').last().after(`
      <li class="navList">
        <button id="btnHeaderSearch" class="header_searchBtn">
          <span>🔍 SEARCH</span>
        </button>
      </li>
    `);

    $('#btnHeaderSearch').on('click', function () {
      openModal('#anipocketSearchModal');
      setTimeout(() => $('#anipocketSearchInput').focus(), 200);
    });

    // Debounced Search Input
    let searchTimeout;
    $('#anipocketSearchInput').on('input', function () {
      clearTimeout(searchTimeout);
      const q = $(this).val().trim();
      if (!q) {
        $('#anipocketSearchResults').html('<div style="padding: 20px; text-align: center; color: #888; font-size: 13px;">Введите название для поиска...</div>');
        return;
      }
      searchTimeout = setTimeout(async () => {
        $('#anipocketSearchResults').html('<div style="padding: 20px; text-align: center; color: #888; font-size: 13px;">Поиск...</div>');
        const results = await YaniApi.search(q);
        if (!results.length) {
          $('#anipocketSearchResults').html('<div style="padding: 20px; text-align: center; color: #888; font-size: 13px;">Ничего не найдено</div>');
          return;
        }
        $('#anipocketSearchResults').html(results.map(item => `
          <div class="anipocketSearchResultItem" data-id="${item.anime_id}">
            <img src="${fixImageUrl(item.poster?.small || item.poster?.medium)}" class="anipocketSearchResultImg" alt="" />
            <div>
              <div class="anipocketSearchResultTitle">${item.title}</div>
              <div class="anipocketSearchResultMeta">
                ${item.year ? item.year + ' • ' : ''}${item.type?.name || 'Аниме'} • ⭐ ${Number(item.rating?.average || 0).toFixed(1)}
              </div>
            </div>
          </div>
        `).join(''));
      }, 300);
    });

    $(document).on('click', '.anipocketSearchResultItem', function () {
      const id = $(this).data('id');
      openAnimeDetails(id);
    });

    // 3. Hero Action Button
    $('#visualArea').append(`
      <button id="btnHeroPlay" class="visualArea_playBtn">
        <div class="visualArea_playBtn-icon">▶</div>
        <div class="visualArea_playBtn-txt">
          <span class="visualArea_playBtn-en">WATCH FEATURED ANIME</span>
          <span class="visualArea_playBtn-ja">今すぐ見る • СМОТРЕТЬ ОНЛАЙН</span>
        </div>
      </button>
    `);

    $('#btnHeroPlay').on('click', function () {
      if (catalogList.length) {
        openAnimeDetails(catalogList[0]);
      }
    });

    // 4. Load Catalog into #book (Swiper)
    try {
      const catalogData = await YaniApi.getCatalog();
      catalogList = catalogData.data || [];

      // Update #book title
      $('#book .cont_h2-ja span').text('КОЛЛЕКЦИЯ АНИМЕ');
      $('#book .book_head-ttl').html('ПОПУЛЯРНЫЕ ТАЙТЛЫ СЕЗОНА<br><small>Высокий рейтинг зрителей и официальный дубляж</small>');
      $('#book .book_head-txt').html('Смотрите онлайн в высоком качестве<br>С сохранением истории просмотров');

      // Populate Swiper items
      if (catalogList.length) {
        const swiperHtml = catalogList.map(anime => `
          <li class="bookList swiper-slide" style="cursor: pointer;">
            <div class="bookList_link js-openAnime" data-id="${anime.anime_id}">
              <div class="bookList_img" style="aspect-ratio: 3/4.4; overflow: hidden; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.12);">
                <img src="${fixImageUrl(anime.poster?.medium || anime.poster?.small || anime.poster?.fullsize)}" alt="${anime.title}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <p class="bookList_ttl" style="margin-top: 10px; font-weight: 600; line-height: 1.3; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                ${anime.title}
              </p>
              <div style="font-size: 11px; color: var(--color-purple-83); font-weight: bold; margin-top: 4px;">
                ⭐ ${Number(anime.rating?.average || 0).toFixed(1)}
              </div>
            </div>
          </li>
        `).join('');

        $('#bookLists').html(swiperHtml);

        // Click on swiper item
        $(document).on('click', '.js-openAnime', function (e) {
          e.preventDefault();
          const id = $(this).data('id');
          openAnimeDetails(id);
        });

        // Trigger Swiper refresh
        if (window.bookSwiper && typeof window.bookSwiper.update === 'function') {
          window.bookSwiper.update();
        }
      }
    } catch (e) {
      console.error("Catalog load error", e);
    }

    // 5. Load Schedule into #news (ON AIR)
    try {
      const schedule = await YaniApi.getSchedule();

      $('#news .cont_h2-ja span').text('ОНГОИНГИ • СВЕЖИЕ СЕРИИ');
      $('#news .twitterWidget__acc .slide_officialx span').text('ON AIR SCHEDULE');

      if (schedule.length) {
        const newsHtml = schedule.slice(0, 6).map(item => `
          <li class="newsList">
            <a href="#" class="newsList__link js-openAnime" data-id="${item.anime_id}">
              <time class="newsList__date">ЭПИЗОД ${item.episodes?.aired || item.episodes?.count || '1'}</time>
              <p class="newsList__title">
                <span class="newsList__title_txt">${item.title}</span>
              </p>
            </a>
          </li>
        `).join('');

        $('#js-topnewsLists').html(newsHtml);
      }
    } catch (e) {
      console.error("Schedule load error", e);
    }
  });
})();
