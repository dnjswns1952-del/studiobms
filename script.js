document.addEventListener("DOMContentLoaded", () => {
  /* =========================
   * 메인 캐러셀 (상단 큰 슬라이드)
   * ========================= */
  const mainSlidesContainer = document.querySelector(".carousel .slides");
  const mainSlideItems = document.querySelectorAll(".carousel .slide");
  const mainPrevBtn = document.querySelector(".carousel .prev");
  const mainNextBtn = document.querySelector(".carousel .next");

  let mainIndex = 0;
  let mainInterval;

  function renderMainSlide(index) {
    mainSlidesContainer.style.transform = `translateX(-${index * 100}%)`;
  }
  function nextMain() {
    mainIndex = (mainIndex + 1) % mainSlideItems.length;
    renderMainSlide(mainIndex);
  }
  function prevMain() {
    mainIndex = (mainIndex - 1 + mainSlideItems.length) % mainSlideItems.length;
    renderMainSlide(mainIndex);
  }
  function startMainAuto() {
    stopMainAuto();
    mainInterval = setInterval(nextMain, 3000);
  }
  function stopMainAuto() {
    if (mainInterval) clearInterval(mainInterval);
  }

  if (mainPrevBtn) {
    mainPrevBtn.addEventListener("click", () => {
      prevMain();
      stopMainAuto();
    });
  }
  if (mainNextBtn) {
    mainNextBtn.addEventListener("click", () => {
      nextMain();
      stopMainAuto();
    });
  }

  renderMainSlide(mainIndex);
  startMainAuto();


  /* =========================
   * 방 캐러셀 (Room 1~12)
   * ========================= */
  const TOTAL_ROOMS = 12;   // ✅ 실제 존재하는 방 개수

  const roomSelector = document.getElementById("roomSelector");
  const roomContainers = document.querySelectorAll(".room-slides");
  const specBlocks = document.querySelectorAll(".spec");
  const toggleBtns = document.querySelectorAll(".spec-actions button");

  const roomIndices = {};
  for (let i = 1; i <= TOTAL_ROOMS; i++) {
    roomIndices[i] = 0;
  }

  let currentRoom = "1";
  let roomInterval;
  let roomAutoPlay = true;

  function showRoom(room, index) {
    const slides = document.querySelectorAll(`#room${room} .room-slide`);
    slides.forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });
  }

  function switchRoom(room) {
    roomContainers.forEach(c => c.classList.add("hidden"));
    document.getElementById(`room${room}`)?.classList.remove("hidden");

    specBlocks.forEach(s => s.classList.add("hidden"));
    document.getElementById(`spec${room}`)?.classList.remove("hidden");

    currentRoom = room;
    roomIndices[room] = 0;
    showRoom(room, roomIndices[room]);

    if (roomSelector) {
      roomSelector.value = room;
    }
  }

  function nextRoomSlide() {
    const slides = document.querySelectorAll(`#room${currentRoom} .room-slide`);
    if (!slides.length) return;

    let currentIndex = roomIndices[currentRoom];
    slides[currentIndex].classList.remove("active");
    currentIndex++;

    if (currentIndex >= slides.length) {
      let nextRoom = parseInt(currentRoom) + 1;
      if (nextRoom > TOTAL_ROOMS) nextRoom = 1;   // ✅ 12 이후 → 1로 돌아감
      switchRoom(String(nextRoom));
      return;
    }

    roomIndices[currentRoom] = currentIndex;
    slides[currentIndex].classList.add("active");
  }

  function prevRoomSlide() {
    const slides = document.querySelectorAll(`#room${currentRoom} .room-slide`);
    if (!slides.length) return;

    let currentIndex = roomIndices[currentRoom];
    slides[currentIndex].classList.remove("active");
    currentIndex--;

    if (currentIndex < 0) {
      let prevRoom = parseInt(currentRoom) - 1;
      if (prevRoom < 1) prevRoom = TOTAL_ROOMS;   // ✅ Room1에서 왼쪽 → Room12
      switchRoom(String(prevRoom));

      const prevSlides = document.querySelectorAll(`#room${prevRoom} .room-slide`);
      roomIndices[prevRoom] = prevSlides.length - 1;
      showRoom(prevRoom, roomIndices[prevRoom]);
      return;
    }

    roomIndices[currentRoom] = currentIndex;
    slides[currentIndex].classList.add("active");
  }

  function startRoomAuto() {
    stopRoomAuto();
    roomInterval = setInterval(nextRoomSlide, 3000);
    roomAutoPlay = true;
    updateToggleIcons();
  }
  function stopRoomAuto() {
    if (roomInterval) clearInterval(roomInterval);
    roomAutoPlay = false;
    updateToggleIcons();
  }

  if (roomSelector) {
    roomSelector.addEventListener("change", () => {
      const selectedRoom = roomSelector.value;
      switchRoom(selectedRoom);
      stopRoomAuto();
    });
  }

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    if (e.target.classList.contains("room-arrow")) {
      stopRoomAuto();
      if (e.target.classList.contains("prev")) prevRoomSlide();
      else nextRoomSlide();
    }
  });

  function updateToggleIcons() {
    toggleBtns.forEach(btn => {
      btn.textContent = roomAutoPlay ? "❚❚" : "▶";
    });
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      roomAutoPlay = !roomAutoPlay;
      updateToggleIcons();
      if (roomAutoPlay) startRoomAuto();
      else stopRoomAuto();
    });
  });

  switchRoom("1");
  if (roomAutoPlay) startRoomAuto();
  updateToggleIcons();


  /* =========================
   * 스와이프 지원 (모바일)
   * ========================= */
  function addSwipeSupport(container, onSwipeLeft, onSwipeRight, onManualInteract) {
    let startX = 0, startY = 0, endX = 0, moved = false;
    const THRESHOLD = 40;
    const ANGLE_GUARD = 0.57;

    container.addEventListener("touchstart", (e) => {
      if (!e.touches || !e.touches[0]) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      endX = startX;
      moved = false;
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
      if (!e.touches || !e.touches[0]) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) * ANGLE_GUARD) {
        e.preventDefault();
        moved = true;
        endX = e.touches[0].clientX;
      }
    }, { passive: false });

    container.addEventListener("touchend", () => {
      const diff = endX - startX;
      if (moved && Math.abs(diff) > THRESHOLD) {
        if (onManualInteract) onManualInteract();
        if (diff > 0) onSwipeRight();
        else onSwipeLeft();
      }
    }, { passive: true });
  }

  // 메인 캐러셀 스와이프
  const mainCarousel = document.querySelector(".carousel .slides");
  if (mainCarousel) {
    addSwipeSupport(mainCarousel, nextMain, prevMain, stopMainAuto);
  }

  // 방 캐러셀 스와이프
  document.querySelectorAll(".room-slides").forEach(room => {
    addSwipeSupport(room, nextRoomSlide, prevRoomSlide, stopRoomAuto);
  });
});