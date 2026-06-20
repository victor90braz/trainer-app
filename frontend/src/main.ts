import { GetVideosUseCase } from "./modules/ddd/Trainer/application/GetVideosUseCase";
import { UploadVideoUseCase } from "./modules/ddd/Trainer/application/UploadVideoUseCase";
import { LocalStorageVideoRepository } from "./modules/ddd/Trainer/infrastructure/LocalStorageVideoRepository";


// Instanciamos el repositorio único (Singleton implícito para la app)
const repository = new LocalStorageVideoRepository();

// Instanciamos los Casos de Uso inyectando el adaptador
const uploadVideoUseCase = new UploadVideoUseCase(repository);
const getVideosUseCase = new GetVideosUseCase(repository);

// Hacemos los casos de uso accesibles globalmente para la interfaz de usuario de forma segura
(window as any).TrainerApp = {
    uploadVideo: uploadVideoUseCase,
    getVideos: getVideosUseCase
};

console.log('🚀 Trainer App: Hexagonal architecture initialized successfully.');