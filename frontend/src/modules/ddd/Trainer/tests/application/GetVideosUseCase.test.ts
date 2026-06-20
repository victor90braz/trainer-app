// src/modules/ddd/Trainer/tests/application/GetVideosUseCase.test.ts
import { GetVideosUseCase } from "../../application/GetVideosUseCase";
import { Video } from "../../domain/Video";
import { VideoRepository } from "../../domain/VideoRepository";

describe('GetVideosUseCase', () => {
    it('should retrieve all videos from repository and return them grouped by category', async () => {
        // arrange
        const video1 = Video.fromPrimitive({
            id: 'vid-1',
            name: 'Sentadillas',
            category: 'Fuerza',
            date: '2026-06-20T10:00:00.000Z',
            fileName: 'fuerza1.mp4',
            blobUrl: 'blob:1'
        });

        const video2 = Video.fromPrimitive({
            id: 'vid-2',
            name: 'Sprint HIIT',
            category: 'Cardio',
            date: '2026-06-20T11:00:00.000Z',
            fileName: 'cardio1.mp4',
            blobUrl: 'blob:2'
        });

        // Mock del repositorio configurado para retornar los vídeos simulados
        const mockRepository: VideoRepository = {
            save: jest.fn(),
            searchAll: jest.fn().mockResolvedValue([video1, video2])
        };

        const useCase = new GetVideosUseCase(mockRepository);

        // act
        const result = await useCase.execute();

        // assert
        expect(mockRepository.searchAll).toHaveBeenCalledTimes(1);
        
        // Buscamos dinámicamente las claves del diccionario resultante
        const keys = Object.keys(result);
        
        // Buscamos el grupo de Fuerza (ya sea por string directo o por la stringificación del Value Object)
        const fuerzaKey = keys.find(k => k.includes('Fuerza'))!;
        expect(fuerzaKey).toBeDefined();
        expect(result[fuerzaKey][0].id).toBe('vid-1');
        
        // Buscamos el grupo de Cardio
        const cardioKey = keys.find(k => k.includes('Cardio'))!;
        expect(cardioKey).toBeDefined();
        expect(result[cardioKey][0].id).toBe('vid-2');
    });
});