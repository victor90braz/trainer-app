// src/main.ts
import { LocalStorageVideoRepository } from './modules/ddd/Trainer/infrastructure/LocalStorageVideoRepository';
import { UploadVideoUseCase } from './modules/ddd/Trainer/application/UploadVideoUseCase';
import { GetVideosUseCase } from './modules/ddd/Trainer/application/GetVideosUseCase';

const repository = new LocalStorageVideoRepository();
const uploadVideoUseCase = new UploadVideoUseCase(repository);
const getVideosUseCase = new GetVideosUseCase(repository);

const form = document.getElementById('upload-form') as HTMLFormElement;
const catalogContainer = document.getElementById('catalog-container') as HTMLElement;

const currentDateEl = document.getElementById('current-date');
if (currentDateEl) {
    currentDateEl.textContent = new Date().toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

async function renderCatalog() {
    if (!catalogContainer) return;
    catalogContainer.innerHTML = '<div class="no-content">Cargando catálogo de entrenamientos...</div>';
    
    try {
        const groupedVideos = await getVideosUseCase.execute();
        const categories = Object.keys(groupedVideos);

        if (categories.length === 0) {
            catalogContainer.innerHTML = '<div class="no-content">No hay videos subidos hoy. ¡Sube tu primer entrenamiento arriba!</div>';
            return;
        }

        catalogContainer.innerHTML = '';

        for (const category of categories) {
            const videos = groupedVideos[category];
            if (!videos || videos.length === 0) continue;

            const row = document.createElement('div');
            row.className = 'category-row';

            row.innerHTML = `
                <div class="category-title">${category}</div>
                <div class="video-grid">
                    ${videos.map((video: any) => `
                        <div class="video-card">
                            <video src="${video.blobUrl}" controls></video>
                            <div class="video-info">
                                <div class="video-name">${video.name}</div>
                                <div class="video-meta">Archivo: ${video.fileName}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            catalogContainer.appendChild(row);
        }
    } catch (error: any) {
        console.error(error);
        catalogContainer.innerHTML = `<div class="no-content" style="color: var(--accent-color);">Error al cargar los videos: ${error.message}</div>`;
    }
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('video-file') as HTMLInputElement;
        const nameInput = document.getElementById('video-name') as HTMLInputElement;
        const categoryInput = document.getElementById('video-category') as HTMLSelectElement;

        const file = fileInput.files?.[0];
        if (!file) return;

        const blobUrl = URL.createObjectURL(file);

        const videoInput = {
            id: 'vid-' + crypto.randomUUID(), 
            name: nameInput.value,
            category: categoryInput.value,
            date: new Date().toISOString(),
            fileName: file.name,
            blobUrl: blobUrl
        };

        try {
            await uploadVideoUseCase.execute(videoInput);
            form.reset();
            await renderCatalog();
        } catch (error: any) {
            alert('Error de dominio al validar el video: ' + error.message);
        }
    });
}

window.addEventListener('DOMContentLoaded', renderCatalog);