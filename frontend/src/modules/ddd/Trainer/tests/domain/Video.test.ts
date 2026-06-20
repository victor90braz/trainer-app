// tests/domain/Video.test.ts
import { Video } from '../../domain/Video';

describe('Video Entity', () => {
    // arrange
    const validParams = {
        id: 'id-1',
        name: 'UserA',
        category: 'Fuerza',
        date: new Date('2026-06-20'),
        fileName: 'file1.mp4',
        blobUrl: 'blob:http://localhost/1'
    };

    it('should create a valid video entity instance using the factory', () => {
        // act
        const video = Video.create(validParams);

        // assert
        expect(video.id).toBe(validParams.id);
        expect(video.name).toBe(validParams.name);
        expect(video.category).toBe(validParams.category);
        expect(video.date).toEqual(validParams.date);
        expect(video.fileName).toBe(validParams.fileName);
        expect(video.blobUrl).toBe(validParams.blobUrl);
    });

    it('should throw an error if name string is empty', () => {
        // arrange
        const invalidParams = { ...validParams, name: '' };

        // act & assert
        expect(() => {
            Video.create(invalidParams);
        }).toThrow('Invalid argument: name cannot be empty');
    });

    it('should serialize to a primitive object format', () => {
        // arrange
        const video = Video.create(validParams);

        // act
        const primitive = video.toPrimitive();

        // assert
        expect(primitive.id).toBe(validParams.id);
        expect(primitive.name).toBe(validParams.name);
        expect(primitive.category).toBe(primitive.category);
        expect(primitive.date).toBe(validParams.date.toISOString());
        expect(primitive.fileName).toBe(validParams.fileName);
        expect(primitive.blobUrl).toBe(validParams.blobUrl);
    });

    it('should instantiate correctly from a primitive object format', () => {
        // arrange
        const primitiveData = {
            id: 'id-2',
            name: 'UserB',
            category: 'Técnica',
            date: '2026-06-20T00:00:00.000Z',
            fileName: 'file2.mp4',
            blobUrl: 'blob:http://localhost/2'
        };

        // act
        const video = Video.fromPrimitive(primitiveData);

        // assert
        expect(video.id).toBe(primitiveData.id);
        expect(video.name).toBe(primitiveData.name);
        expect(video.category).toBe(primitiveData.category);
        expect(video.date).toEqual(new Date(primitiveData.date));
        expect(video.fileName).toBe(primitiveData.fileName);
        expect(video.blobUrl).toBe(primitiveData.blobUrl);
    });
});