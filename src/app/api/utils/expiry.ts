function calculate_expiry(interval?: string) {
    const now = new Date();

    // By default = 1hour
    if(!interval) return new Date(now.getTime() + (1 * 60 * 60 * 1000))
    
    // If the interval is minutes
    if (interval.includes("min")) return new Date(now.getTime() + (Number(interval.split('min')[0]) * 60 * 1000))

    // If the interval is hours
     if (interval.includes("hours")) return new Date(now.getTime() + (Number(interval.split('hours')[0]) * 60 * 60 * 1000))
}


export default calculate_expiry