import { CategoryValue } from "../domain/Category";
import { Video } from "../domain/Video";


export type GroupedVideos = Record<CategoryValue | string, Video[]>;

export function groupByCategory(videoList: Video[]): GroupedVideos {
    return videoList.reduce<GroupedVideos>((accumulator, video) => {
        const key = video.category;
        
        if (!accumulator[key]) {
            accumulator[key] = [];
        }
        
        accumulator[key].push(video);
        return accumulator;
    }, {});
}