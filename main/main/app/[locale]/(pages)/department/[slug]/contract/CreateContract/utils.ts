


export function generateProductReference(): string {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";        
    return letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length)) + Math.floor(Math.random() * Math.pow(10, 6)).toString() + letters.charAt(Math.floor(Math.random() * letters.length));
}