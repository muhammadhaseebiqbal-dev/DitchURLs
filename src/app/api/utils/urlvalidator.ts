export default function isURLValid(url: URL){
    try {
        new URL(url)
        return true
    } catch (error) {
        return false
    }
}