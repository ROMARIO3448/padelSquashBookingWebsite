class ObjectUtils {
    static hasAnyKeyInObj(arrayOfKeys, objectToCheck) {
        return arrayOfKeys.some((key) =>
            Object.keys(objectToCheck).includes(key)
        );
    }
    static isObjEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
}

export default ObjectUtils;
