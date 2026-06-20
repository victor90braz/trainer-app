// src/modules/ddd/Trainer/tests/application/UploadVideoUseCase.test.ts
import { UploadVideoUseCase } from '../../application/UploadVideoUseCase';
import { VideoRepository } from '../../domain/VideoRepository';
import { Video } from '../../domain/Video';

describe('UploadVideoUseCase', () => {
    it('should create a video entity and persist it using the repository', async () => {
        // arrange
        const mockRepository: VideoRepository = {
            save: jest.fn().mockResolvedValue(undefined),
            searchAll: jest.fn()
        };
        
        const useCase = new UploadVideoUseCase(mockRepository);
        
        const videoInput = {
            id: 'vid-123',
            name: 'Rutina de Pierna',
            category: 'Fuerza',
            date: '2026-06-20T10:00:00.000Z',
            fileName: 'leg-day.mp4',
            blobUrl: 'blob:http://localhost/leg-day'
        };

        // act
        await useCase.execute(videoInput);

        // assert
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
        
        const expectedVideo = (mockRepository.save as jest.Mock).mock.calls[0][0];
        expect(expectedVideo).toBeInstanceOf(Video);
        expect(expectedVideo.id).toBe(videoInput.id);
        
        // CORRECCIÓN: Extraemos el valor de la categoría de forma segura sea objeto o string plano
        const categoryValue = expectedVideo.category?.value || expectedVideo.category;
        expect(String(categoryValue)).toBe(videoInput.category);
    });
});