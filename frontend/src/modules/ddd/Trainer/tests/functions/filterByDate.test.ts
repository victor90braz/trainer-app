import { Video } from "../../domain/Video";
import { filterByDate } from "../../functions/filterByDate";

describe('filterByDate Pure Function', () => {
    // arrange
    const targetDate = new Date('2026-06-20T10:00:00.000Z');
    
    const videoOnTargetDate = Video.fromPrimitive({
        id: 'vid-1',
        name: 'UserA',
        category: 'Fuerza',
        date: '2026-06-20T18:30:00.000Z', // Mismo día, distinta hora
        fileName: 'file1.mp4',
        blobUrl: 'blob:1'
    });

    const videoOnDifferentDate = Video.fromPrimitive({
        id: 'vid-2',
        name: 'UserB',
        category: 'Cardio',
        date: '2026-06-21T09:00:00.000Z', // Otro día
        fileName: 'file2.mp4',
        blobUrl: 'blob:2'
    });

    const videoList = [videoOnTargetDate, videoOnDifferentDate];

    it('should return only the videos that match the same year, month, and day', () => {
        // act
        const result = filterByDate(videoList, targetDate);

        // assert
        expect(result.length).toBe(1);
        expect(result[0].id).toBe('vid-1');
    });

    it('should return an empty array if no videos match the specified date', () => {
        // arrange
        const emptyDate = new Date('2026-12-31');

        // act
        const result = filterByDate(videoList, emptyDate);

        // assert
        expect(result.length).toBe(0);
    });
});