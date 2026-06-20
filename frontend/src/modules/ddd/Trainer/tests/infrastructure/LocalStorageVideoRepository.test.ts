// src/modules/ddd/Trainer/tests/infrastructure/LocalStorageVideoRepository.test.ts
import { Video } from '../../domain/Video';
import { LocalStorageVideoRepository } from '../../infrastructure/LocalStorageVideoRepository';

// Simulador de LocalStorage para el entorno de Node/Jest
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('LocalStorageVideoRepository', () => {
    let repository: LocalStorageVideoRepository;

    beforeEach(() => {
        // Limpiamos el localStorage simulado antes de cada test
        localStorage.clear();
        repository = new LocalStorageVideoRepository();
    });

    it('should save a video entity into localStorage', async () => {
        // arrange
        const video = Video.fromPrimitive({
            id: 'vid-999',
            name: 'Flexiones de Pecho',
            category: 'Fuerza',
            date: '2026-06-20T23:00:00.000Z',
            fileName: 'pushups.mp4',
            blobUrl: 'blob:999'
        });

        // act
        await repository.save(video);

        // assert
        const storedData = localStorage.getItem('trainer-app::videos');
        expect(storedData).not.toBeNull();
        
        const parsedData = JSON.parse(storedData!);
        expect(parsedData.length).toBe(1);
        expect(parsedData[0].id).toBe('vid-999');
    });

    it('should return an empty array if searchAll is called and no data exists', async () => {
        // act
        const videos = await repository.searchAll();

        // assert
        expect(videos).toEqual([]);
    });

    it('should retrieve all stored videos parsed correctly as domain entities', async () => {
        // arrange
        const primitiveVideo = {
            id: 'vid-111',
            name: 'Running',
            category: 'Cardio',
            date: '2026-06-20T23:00:00.000Z',
            fileName: 'run.mp4',
            blobUrl: 'blob:111'
        };
        localStorage.setItem('trainer-app::videos', JSON.stringify([primitiveVideo]));

        // act
        const videos = await repository.searchAll();

        // assert
        expect(videos.length).toBe(1);
        expect(videos[0]).toBeInstanceOf(Video);
        expect(videos[0].id).toBe('vid-111');
        
        const categoryValue = (videos[0].category as any)?.value || videos[0].category;
        expect(String(categoryValue)).toBe('Cardio');
    });
});