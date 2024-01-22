export function groupBy<T, K extends string | number | symbol>(list: T[], getKey: (item: T) => K): Record<K, T[]> {
    return list.reduce((result, item) => {
        const group = getKey(item);
        if (!result[group]) result[group] = [];
        result[group].push(item);
        return result;
    }, {} as Record<K, T[]>);
}
