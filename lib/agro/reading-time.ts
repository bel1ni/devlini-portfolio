export function readingTime(text: string) {
if (!text) {
    return "1 min de leitura"
}

const wordsPerMinute = 200

const cleanText = text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()

const numberOfWords = cleanText
    .split(" ")
    .filter(Boolean).length

const minutes = Math.max(
    1,
    Math.ceil(numberOfWords / wordsPerMinute)
)

return `${minutes} min de leitura`
}