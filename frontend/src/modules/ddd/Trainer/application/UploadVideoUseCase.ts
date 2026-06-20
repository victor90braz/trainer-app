// src/modules/ddd/Trainer/application/UploadVideoUseCase.ts
import { VideoRepository } from '../domain/VideoRepository';
import { Video } from '../domain/Video'; // Asegúrate de que esta ruta apunte bien a tu Video.ts

export interface UploadVideoInput {
    id: string;
    name: string;
    category: string;
    date: string;
    fileName: string;
    blobUrl: string;
}

export class UploadVideoUseCase {
    private readonly repository: VideoRepository;

    constructor(repository: VideoRepository) {
        this.repository = repository;
    }

    public async execute(input: UploadVideoInput): Promise<void> {
        // En lugar de usar VideoFactory, usamos el método de factoría nativo de la Entidad
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
}