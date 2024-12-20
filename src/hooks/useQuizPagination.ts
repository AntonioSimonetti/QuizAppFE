import { useState } from 'react';

export const useQuizPagination = (quizzes: any[], itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(0);
    
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const quizzesToShow = quizzes.slice(startIndex, endIndex);

    const nextPage = () => {
        if (endIndex < quizzes.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = () => {
        if (startIndex > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return {
        currentPage,
        quizzesToShow,
        nextPage,
        previousPage,
        hasNextPage: endIndex < quizzes.length,
        hasPreviousPage: startIndex > 0
    };
};
