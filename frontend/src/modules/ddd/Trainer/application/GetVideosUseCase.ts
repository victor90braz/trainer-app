// src/modules/ddd/Trainer/domain/application/GetVideosUseCase.ts
import { VideoRepository } from '../domain/VideoRepository';
import { groupByCategory, GroupedVideos } from '../functions/groupByCategory';

export class GetVideosUseCase {
    private readonly repository: VideoRepository;

    constructor(repository: VideoRepository) {
        this.repository = repository;
    }

    public async execute(): Promise<GroupedVideos> {
        // 1. Recuperamos todas las entidades del repositorio (Puerto)
        const videos = await this.repository.searchAll();

        // 2. Agrupamos y retornamos usando nuestra función pura de dominio
        return groupByCategory(videos);
    }
}