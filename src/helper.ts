
export const downScaler = (d: number) => (v: number) => (0 + ((100 - 0) / (d - 0)) * (v - 0))
export const upScaler = (d: number) => (v: number) => (0 + ((d - 0) / (100 - 0)) * (v - 0))

export function secondsToTime(e: number) {
    const h = Math.floor(e / 3600).toString().padStart(2, '0'),
        m = Math.floor(e % 3600 / 60).toString().padStart(2, '0'),
        s = Math.floor(e % 60).toString().padStart(2, '0');

    return Number(h) > 0 ? h + ':' + m + ':' + s : m + ':' + s;
}
