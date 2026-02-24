export const boysNames = [
  "Adnan", "Ayaan", "Faizan", "Musa", "Suhail", "Ali", "Mohammad", "Ahmed", "Asif", "Tabish",
  "Azaan", "Zaid", "Hamza", "Ibrahim", "Yusuf", "Rayyan", "Aryan", "Danish", "Faraz", "Saad",
  "Talha", "Usman", "Rayan", "Arsalan", "Burhan", "Daniyal", "Farhan", "Hassan", "Huzaifa", "Imad",
  "Junaid", "Kamran", "Luqman", "Mudassir", "Nabil", "Omar", "Parvaiz", "Qasim", "Rizwan", "Sami",
  "Tahir", "Umar", "Waseem", "Yahya", "Zubair", "Abid", "Bilal", "Eshan", "Faisal", "Ghalib",
  "Hashim", "Irshad", "Jawad", "Khalid", "Latif", "Mansoor", "Nasir", "Owais", "Peerzada", "Rafiq",
  "Sajid", "Tariq", "Ubaid", "Vaqas", "Wajid", "Xayan", "Yawar", "Zamir", "Arif", "Bashir",
  "Dilawar", "Ejaz", "Fayaz", "Gulzar", "Hilal", "Ishfaq", "Javed", "Khursheed", "Liyaqat", "Manzoor",
  "Nisar", "Omeed", "Pasha", "Qayoom", "Reyaz", "Showkat", "Tanveer", "Urfan", "Vakeel", "Zaffar"
];

export const girlsNames = [
  "Munaza", "Zehra", "Sumaiya", "Sehrish", "Isha", "Fatima", "Saniya", "Mehrosh", "Fadiya", "Mariam",
  "Zara", "Hoorain", "Ramsha", "Aiza", "Dua", "Fareeha", "Iqra", "Kinza", "Mahira", "Nimra",
  "Rida", "Saba", "Urwa", "Zainab", "Bisma", "Hiba", "Inaya", "Faryal", "Tooba", "Anum",
  "Bushra", "Danishta", "Eram", "Farzana", "Ghazala", "Hina", "Insha", "Jabeen", "Kouser", "Lubna",
  "Mehak", "Nadia", "Oshina", "Parveena", "Qurat", "Rubeena", "Shazia", "Tabasum", "Uzma", "Varda",
  "Wafiya", "Xara", "Yasmeen", "Zunaira", "Afroza", "Benazir", "Chandni", "Dilshad", "Emaan", "Fiza",
  "Gulshan", "Humaira", "Iffat", "Jiya", "Kulsum", "Leila", "Muskan", "Nazia", "Omera", "Pakeeza",
  "Qudsia", "Rehana", "Sana", "Tahira", "Ulfat", "Vahida", "Warda", "Yusra", "Zalika", "Anika",
  "Barkha", "Darakhshan", "Eshita", "Falak", "Gohar", "Heena", "Iram", "Juhi", "Kainaat", "Liza"
];

export const devices = [
  "Desktop Windows 11 (Chrome)", "Desktop Windows 10 (Firefox)", "Desktop Windows 11 (Edge)",
  "MacBook Pro (Safari)", "MacBook Air (Chrome)", "iPhone 15 Pro (Safari)",
  "iPhone 14 (Safari)", "iPhone 13 (Safari)", "iPhone 12 (Safari)", "iPhone SE (Safari)",
  "Samsung S23 Ultra (Chrome)", "Samsung Galaxy A54 (Chrome)", "Xiaomi Redmi Note 12 (Chrome)",
  "OnePlus 11 (Chrome)", "Realme GT (Chrome)", "Vivo V27 (Chrome)",
  "iPad Pro 12.9 (Safari)", "iPad Air (Safari)", "iPad Mini (Safari)", "iPad 10th Gen (Safari)"
];

export function pickMsg(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}
