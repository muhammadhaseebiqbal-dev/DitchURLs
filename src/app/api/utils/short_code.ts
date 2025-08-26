function generate_short_code() {
    let short_code = '';

    // short_code generator
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 10; i++) {
        const randIndex = Math.floor(Math.random() * chars.length);
        short_code += chars[randIndex];
    }
    return short_code;
}

export default generate_short_code