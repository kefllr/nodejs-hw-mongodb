export const parseNumber = (unknown, defaultNum) =>{
    if (typeof unknown  !== 'string') return defaultNum;

    const parsedNum = parseInt(unknown);
    if (Number.isNaN(parsedNum)) return defaultNum;
    return parsedNum; 
};

export const parsePaginationParams = (query) => {
    const {page, perPage} = query;
    return{
        page: parseNumber(page, 1),
        perPage: parseNumber(perPage, 10)
    };

};