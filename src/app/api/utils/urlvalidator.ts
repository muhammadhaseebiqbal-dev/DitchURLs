export default function isURLValid(url: URL){
    try {
        new URL(url)
        return true
    } catch (e) {
        console.error("Invalid URL:", e)
        return false
    }
}