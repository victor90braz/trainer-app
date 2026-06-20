// src/modules/ddd/Trainer/domain/Category.ts

export type CategoryValue = 'Fuerza' | 'Cardio' | 'Técnica' | 'Movilidad' | 'Recuperación';

export class Category {
    readonly value: CategoryValue;

    private static readonly ALLOWED_CATEGORIES: CategoryValue[] = [
        'Fuerza',
        'Cardio',
        'Técnica',
        'Movilidad',
        'Recuperación'
    ];

    private constructor(value: CategoryValue) {
        this.value = value;
        Object.freeze(this); // Garantiza la inmutabilidad estricta en el runtime de JS
    }

    public static fromValue(value: string): Category {
        if (!this.ALLOWED_CATEGORIES.includes(value as CategoryValue)) {
            throw new Error(`Invalid argument: "${value}" is not a valid category`);
        }
        return new Category(value as CategoryValue);
    }
}