// 모든 초기화는 DOM이 준비된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  initMainCarousel();
  initStickyNav();
  initRooms();
  initHamburger();
});

/* =========================
   메인 캐러셀 (상단 슬라이드)
   ========================= */
function initMainCarousel() {
  let mainIndex = 0;
  const mainSlides = document.querySelectorAll("#mainCarousel .slide");
  if (!mainSlides.length) return;

  function showMainSlide(index) {
    mainSlides.forEach(s => s.style.display = "none");
    mainSlides[index].style.display = "block";
  }

  function nextMainSlide() {
    mainIndex = (mainIndex + 1) % mainSlides.length;
    showMainSlide(mainIndex);
  }

  function prevMainSlide() {
    mainIndex = (mainIndex - 1 + mainSlides.length) % mainSlides.length;
    showMainSlide(mainIndex);
  }

  // 화살표 버튼에서 호출할 수 있도록 전역 등록
  window.nextMainSlide = nextMainSlide;
  window.prevMainSlide = prevMainSlide;

  showMainSlide(mainIndex);
  setInterval(nextMainSlide, 10000); // 10초마다 자동 전환
}

/* =========================
   네비게이션 고정 처리
   ========================= */
function initStickyNav() {
  const navbar = document.getElementById("navbar");
  const logo = document.querySelector(".logo");
  if (!navbar || !logo) return;

  const logoHeight = logo.offsetHeight;
  window.addEventListener("scroll", () => {
    if (window.scrollY >= logoHeight) navbar.classList.add("fixed");
    else navbar.classList.remove("fixed");
  });
}

/* =========================
   Room 캐러셀 관련
   ========================= */
function initRooms() {
  const roomIds = [
    "vip1","1","2","3","4","5","6","7","8",
    "9","10","11","12","13","14","15","16","17"
  ];
  let currentRoomIndex = 0;
  let autoPlay = true;

  const roomSelect = document.getElementById("roomNumber");
  const rooms = document.querySelectorAll(".room-content .room");
  if (!rooms.length) return;

  function showRoom(index) {
    rooms.forEach(r => r.style.display = "none");
    const target = document.getElementById(roomIds[index]);
    if (target) target.style.display = "flex";
    if (roomSelect) roomSelect.value = roomIds[index];
  }

  function nextRoom(auto = false) {
    currentRoomIndex = (currentRoomIndex + 1) % roomIds.length;
    showRoom(currentRoomIndex);
    if (!auto) autoPlay = false;
    updatePlayButtons();
  }

  function prevRoom() {
    currentRoomIndex = (currentRoomIndex - 1 + roomIds.length) % roomIds.length;
    showRoom(currentRoomIndex);
    autoPlay = false;
    updatePlayButtons();
  }

  function updatePlayButtons() {
    document.querySelectorAll("#playPauseBtn").forEach(btn => {
      btn.innerHTML = autoPlay ? "&#10074;&#10074;" : "&#9658;";
    });
  }

  window.nextRoom = nextRoom;
  window.prevRoom = prevRoom;
  window.togglePlayPause = () => { autoPlay = !autoPlay; updatePlayButtons(); };

  if (roomSelect) {
    roomSelect.addEventListener("change", function() {
      const idx = roomIds.indexOf(this.value);
      if (idx >= 0) {
        currentRoomIndex = idx;
        showRoom(currentRoomIndex);
        autoPlay = false;
        updatePlayButtons();
      }
    });
  }

  showRoom(currentRoomIndex);
  setInterval(() => { if (autoPlay) nextRoom(true); }, 6000);
}

/* =========================
   햄버거 메뉴 + 오버레이
   ========================= */
function initHamburger() {
  const sideMenu = document.getElementById("sideMenu");
  const overlay = document.getElementById("overlay");
  const hamburger = document.querySelector(".hamburger");
  if (!sideMenu || !overlay || !hamburger) return;

  function openMenu() {
    sideMenu.classList.add("open");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    sideMenu.classList.remove("open");
    overlay.classList.remove("active");
    document.body.style.overflow = "auto";
  }
  function toggleMenu() {
    if (sideMenu.classList.contains("open")) closeMenu();
    else openMenu();
  }

  // 이벤트 등록
  hamburger.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);
  sideMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  // HTML에서 onclick 제거했으므로 전역 등록은 선택사항
  window.toggleMenu = toggleMenu;
}