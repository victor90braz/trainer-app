// src/modules/ddd/Trainer/domain/VideoRepository.ts
import { Video } from './Video';

export interface VideoRepository {
    save(video: Video): Promise<void>;
    searchAll(): Promise<Video[]>;
}