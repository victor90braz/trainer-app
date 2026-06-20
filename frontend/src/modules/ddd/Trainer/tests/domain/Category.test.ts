// src/modules/ddd/Trainer/domain/tests/domain/Category.test.ts

import { Category } from "../../domain/Category";

describe('Category Value Object', () => {
    it('should create a valid Category instance when value is allowed', () => {
        // arrange
        const validValue = 'Fuerza';

        // act
        const category = Category.fromValue(validValue);

        // assert
        expect(category.value).toBe(validValue);
    });

    it('should throw an error when value is not an allowed category', () => {
        // arrange
        const invalidValue = 'Inexistente';

        // act & assert
        expect(() => {
            Category.fromValue(invalidValue);
        }).toThrow('Invalid argument: "Inexistente" is not a valid category');
    });

    it('should ensure the instance value is immutable', () => {
        // arrange
        const category = Category.fromValue('Cardio');

        // act & assert
        // @ts-expect-error - Verifica inmutabilidad en tiempo de compilación y ejecución
        expect(() => { category.value = 'Fuerza'; }).toThrow();
    });
});