class CircularArray {
    constructor(array) {
        this.array = array;
        this.currentIndex = 0;
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.array.length;
        return this.currentItem();
    }

    prev() {
        this.currentIndex =
            (this.currentIndex - 1 + this.array.length) % this.array.length;
        return this.currentItem();
    }

    currentItem() {
        return this.array[this.currentIndex];
    }
}

export default CircularArray;
