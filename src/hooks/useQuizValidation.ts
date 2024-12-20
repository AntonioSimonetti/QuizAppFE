import { useState } from 'react';
import { CurrentQuestion } from '../interfaces/quiz';

export const useQuizValidation = () => {
    const [validationError, setValidationError] = useState<string>('');
    const MAX_LENGTH = 255;

    const validateInputs = (currentQuestion: CurrentQuestion): boolean => {
        if (currentQuestion.text.length > MAX_LENGTH) {
            setValidationError(`Question text exceeds ${MAX_LENGTH} characters`);
            return false;
        }

        for (let i = 0; i < currentQuestion.options.length; i++) {
            if (currentQuestion.options[i].length > MAX_LENGTH) {
                setValidationError(`Option ${i + 1} exceeds ${MAX_LENGTH} characters`);
                return false;
            }
        }

        setValidationError('');
        return true;
    };

    return {
        validationError,
        validateInputs,
        setValidationError
    };
};

