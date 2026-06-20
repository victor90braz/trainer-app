// src/modules/ddd/Trainer/domain/functions/filterByDate.ts
import { Video } from "../domain/Video";

export function filterByDate(videoList: Video[], targetDate: Date): Video[] {
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    return videoList.filter((video) => {
        const videoYear = video.date.getFullYear();
        const videoMonth = video.date.getMonth();
        const videoDay = video.date.getDate();

        return videoYear === targetYear && 
               videoMonth === targetMonth && 
               videoDay === targetDay;
    });
}