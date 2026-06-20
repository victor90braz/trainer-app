"use strict";
(() => {
  // modules/ddd/Trainer/domain/Video.ts
  var Video = class _Video {
    id;
    name;
    category;
    date;
    fileName;
    blobUrl;
    constructor(params) {
      this.id = params.id;
      this.name = params.name;
      this.category = params.category;
      this.date = params.date;
      this.fileName = params.fileName;
      this.blobUrl = params.blobUrl;
    }
    static create(params) {
      if (!params.name || params.name.trim() === "") {
        throw new Error("Invalid argument: name cannot be empty");
      }
      return new _Video(params);
    }
    toPrimitive() {
      return {
        id: this.id,
        name: this.name,
        category: this.category,
        date: this.date.toISOString(),
        fileName: this.fileName,
        blobUrl: this.blobUrl
      };
    }
    static fromPrimitive(primitive) {
      return new _Video({
        id: primitive.id,
        name: primitive.name,
        category: primitive.category,
        date: new Date(primitive.date),
        fileName: primitive.fileName,
        blobUrl: primitive.blobUrl
      });
    }
  };

  // modules/ddd/Trainer/infrastructure/LocalStorageVideoRepository.ts
  var LocalStorageVideoRepository = class {
    STORAGE_KEY = "trainer-app::videos";
    async save(video) {
      const existingVideos = await this.getRawVideos();
      const videoPrimitive = video.toPrimitive();
      const updatedVideos = existingVideos.filter((v) => v.id !== videoPrimitive.id);
      updatedVideos.push(videoPrimitive);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedVideos));
    }
    async searchAll() {
      const rawVideos = await this.getRawVideos();
      return rawVideos.map((primitive) => Video.fromPrimitive(primitive));
    }
    async getRawVideos() {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return [];
      }
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
  };

  // modules/ddd/Trainer/application/UploadVideoUseCase.ts
  var UploadVideoUseCase = class {
    repository;
    constructor(repository2) {
      this.repository = repository2;
    }
    async execute(input) {
      const video = Video.fromPrimitive({
        id: input.id,
        name: input.name,
        category: input.category,
        date: input.date,
        fileName: input.fileName,
        blobUrl: input.blobUrl
      });
      await this.repository.save(video);
    }
  };

  // modules/ddd/Trainer/functions/groupByCategory.ts
  function groupByCategory(videoList) {
    return videoList.reduce((accumulator, video) => {
      const key = video.category;
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(video);
      return accumulator;
    }, {});
  }

  // modules/ddd/Trainer/application/GetVideosUseCase.ts
  var GetVideosUseCase = class {
    repository;
    constructor(repository2) {
      this.repository = repository2;
    }
    async execute() {
      const videos = await this.repository.searchAll();
      return groupByCategory(videos);
    }
  };

  // main.ts
  var repository = new LocalStorageVideoRepository();
  var uploadVideoUseCase = new UploadVideoUseCase(repository);
  var getVideosUseCase = new GetVideosUseCase(repository);
  var form = document.getElementById("upload-form");
  var catalogContainer = document.getElementById("catalog-container");
  var currentDateEl = document.getElementById("current-date");
  if (currentDateEl) {
    currentDateEl.textContent = (/* @__PURE__ */ new Date()).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  async function renderCatalog() {
    if (!catalogContainer) return;
    catalogContainer.innerHTML = '<div class="no-content">Cargando cat\xE1logo de entrenamientos...</div>';
    try {
      const groupedVideos = await getVideosUseCase.execute();
      const categories = Object.keys(groupedVideos);
      if (categories.length === 0) {
        catalogContainer.innerHTML = '<div class="no-content">No hay videos subidos hoy. \xA1Sube tu primer entrenamiento arriba!</div>';
        return;
      }
      catalogContainer.innerHTML = "";
      for (const category of categories) {
        const videos = groupedVideos[category];
        if (!videos || videos.length === 0) continue;
        const row = document.createElement("div");
        row.className = "category-row";
        row.innerHTML = `
                <div class="category-title">${category}</div>
                <div class="video-grid">
                    ${videos.map((video) => `
                        <div class="video-card">
                            <video src="${video.blobUrl}" controls></video>
                            <div class="video-info">
                                <div class="video-name">${video.name}</div>
                                <div class="video-meta">Archivo: ${video.fileName}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;
        catalogContainer.appendChild(row);
      }
    } catch (error) {
      console.error(error);
      catalogContainer.innerHTML = `<div class="no-content" style="color: var(--accent-color);">Error al cargar los videos: ${error.message}</div>`;
    }
  }
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById("video-file");
      const nameInput = document.getElementById("video-name");
      const categoryInput = document.getElementById("video-category");
      const file = fileInput.files?.[0];
      if (!file) return;
      const blobUrl = URL.createObjectURL(file);
      const videoInput = {
        id: "vid-" + crypto.randomUUID(),
        name: nameInput.value,
        category: categoryInput.value,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        fileName: file.name,
        blobUrl
      };
      try {
        await uploadVideoUseCase.execute(videoInput);
        form.reset();
        await renderCatalog();
      } catch (error) {
        alert("Error de dominio al validar el video: " + error.message);
      }
    });
  }
  window.addEventListener("DOMContentLoaded", renderCatalog);
})();
