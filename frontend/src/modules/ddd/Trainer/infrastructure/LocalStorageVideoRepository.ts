// src/modules/ddd/Trainer/infrastructure/LocalStorageVideoRepository.ts
import { VideoRepository } from '../domain/VideoRepository';
import { Video } from '../domain/Video';

export class LocalStorageVideoRepository implements VideoRepository {
    private readonly STORAGE_KEY = 'trainer-app::videos';

    public async save(video: Video): Promise<void> {
        // 1. Obtenemos los vídeos existentes serializados
        const existingVideos = await this.getRawVideos();

        // 2. Transformamos la nueva entidad de dominio a primitivos
        const videoPrimitive = video.toPrimitive();

        // 3. Filtramos por si ya existía el ID para evitar duplicados, y añadimos el nuevo
        const updatedVideos = existingVideos.filter(v => v.id !== videoPrimitive.id);
        updatedVideos.push(videoPrimitive);

        // 4. Guardamos la lista actualizada de vuelta en el localStorage
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedVideos));
    }

    public async searchAll(): Promise<Video[]> {
        const rawVideos = await this.getRawVideos();

        // Convertimos cada objeto primitivo plano de vuelta a una Entidad de Dominio real
        return rawVideos.map(primitive => Video.fromPrimitive(primitive));
    }

    private async getRawVideos(): Promise<any[]> {
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
}