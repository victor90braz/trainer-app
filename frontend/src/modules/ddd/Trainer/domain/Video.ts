// src/domain/Video.ts

export interface VideoParams {
    id: string;
    name: string;
    category: string;
    date: Date;
    fileName: string;
    blobUrl: string;
}

export interface VideoPrimitive {
    id: string;
    name: string;
    category: string;
    date: string;
    fileName: string;
    blobUrl: string;
}

export class Video {
    readonly id: string;
    readonly name: string;
    readonly category: string;
    readonly date: Date;
    readonly fileName: string;
    readonly blobUrl: string;

    private constructor(params: VideoParams) {
        this.id = params.id;
        this.name = params.name;
        this.category = params.category;
        this.date = params.date;
        this.fileName = params.fileName;
        this.blobUrl = params.blobUrl;
    }

    public static create(params: VideoParams): Video {
        if (!params.name || params.name.trim() === '') {
            throw new Error('Invalid argument: name cannot be empty');
        }
        return new Video(params);
    }

    public toPrimitive(): VideoPrimitive {
        return {
            id: this.id,
            name: this.name,
            category: this.category,
            date: this.date.toISOString(),
            fileName: this.fileName,
            blobUrl: this.blobUrl
        };
    }

    public static fromPrimitive(primitive: VideoPrimitive): Video {
        return new Video({
            id: primitive.id,
            name: primitive.name,
            category: primitive.category,
            date: new Date(primitive.date),
            fileName: primitive.fileName,
            blobUrl: primitive.blobUrl
        });
    }
}