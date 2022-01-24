const getRandomValueInRange = (min, max) => {
    return parseInt(Math.random() * (max - min + 1) + min);
};

const getRandomValue = (max) => {
    return Math.floor(Math.random() * max);
};

const shuffleArray = (array) => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

module.exports = {
    getRandomValueInRange,
    getRandomValue,
    shuffleArray,
    getRandomItem,
};
