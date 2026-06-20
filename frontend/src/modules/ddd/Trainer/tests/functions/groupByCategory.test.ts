import { Video } from "../../domain/Video";
import { groupByCategory } from "../../functions/groupByCategory";


describe('groupByCategory Pure Function', () => {
    // arrange
    const videoA = Video.fromPrimitive({
        id: 'vid-1',
        name: 'UserA',
        category: 'Fuerza',
        date: '2026-06-20T10:00:00.000Z',
        fileName: 'file1.mp4',
        blobUrl: 'blob:1'
    });

    const videoB = Video.fromPrimitive({
        id: 'vid-2',
        name: 'UserB',
        category: 'Fuerza',
        date: '2026-06-20T11:00:00.000Z',
        fileName: 'file2.mp4',
        blobUrl: 'blob:2'
    });

    const videoC = Video.fromPrimitive({
        id: 'vid-3',
        name: 'UserC',
        category: 'Cardio',
        date: '2026-06-20T12:00:00.000Z',
        fileName: 'file3.mp4',
        blobUrl: 'blob:3'
    });

    const videoList = [videoA, videoB, videoC];

    it('should correctly group videos by their category string value', () => {
        // act
        const groupedMap = groupByCategory(videoList);

        // assert
        expect(groupedMap['Fuerza']).toBeDefined();
        expect(groupedMap['Fuerza'].length).toBe(2);
        expect(groupedMap['Fuerza'][0].id).toBe('vid-1');
        expect(groupedMap['Fuerza'][1].id).toBe('vid-2');

        expect(groupedMap['Cardio']).toBeDefined();
        expect(groupedMap['Cardio'].length).toBe(1);
        expect(groupedMap['Cardio'][0].id).toBe('vid-3');
    });

    it('should return an empty object dictionary if video list is empty', () => {
        // act
        const groupedMap = groupByCategory([]);

        // assert
        expect(Object.keys(groupedMap).length).toBe(0);
    });
});