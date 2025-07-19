// Zodiac Calculator with Cusp, Compatibility, Moon & Rising Support + Gemstones

const zodiacSigns = [
  { sign: "Capricorn", start: "12-22", end: "01-19" },
  { sign: "Aquarius", start: "01-20", end: "02-18" },
  { sign: "Pisces", start: "02-19", end: "03-20" },
  { sign: "Aries", start: "03-21", end: "04-19" },
  { sign: "Taurus", start: "04-20", end: "05-20" },
  { sign: "Gemini", start: "05-21", end: "06-20" },
  { sign: "Cancer", start: "06-21", end: "07-22" },
  { sign: "Leo", start: "07-23", end: "08-22" },
  { sign: "Virgo", start: "08-23", end: "09-22" },
  { sign: "Libra", start: "09-23", end: "10-22" },
  { sign: "Scorpio", start: "10-23", end: "11-21" },
  { sign: "Sagittarius", start: "11-22", end: "12-21" }
];

const compatibility = {
  Aries: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
  Taurus: ["Virgo", "Capricorn", "Cancer", "Pisces"],
  Gemini: ["Libra", "Aquarius", "Aries", "Leo"],
  Cancer: ["Scorpio", "Pisces", "Taurus", "Virgo"],
  Leo: ["Aries", "Sagittarius", "Gemini", "Libra"],
  Virgo: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
  Libra: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
  Scorpio: ["Cancer", "Pisces", "Virgo", "Capricorn"],
  Sagittarius: ["Aries", "Leo", "Libra", "Aquarius"],
  Capricorn: ["Taurus", "Virgo", "Scorpio", "Pisces"],
  Aquarius: ["Gemini", "Libra", "Aries", "Sagittarius"],
  Pisces: ["Cancer", "Scorpio", "Taurus", "Capricorn"]
};

const gemstones = {
  Aries: ["Red Coral", "Carnelian"],
  Taurus: ["Emerald", "Rose Quartz"],
  Gemini: ["Emerald", "Citrine"],
  Cancer: ["Pearl", "Moonstone"],
  Leo: ["Ruby", "Sunstone"],
  Virgo: ["Emerald", "Peridot"],
  Libra: ["Diamond", "Lapis Lazuli"],
  Scorpio: ["Red Coral", "Garnet"],
  Sagittarius: ["Yellow Sapphire", "Turquoise"],
  Capricorn: ["Blue Sapphire", "Onyx"],
  Aquarius: ["Blue Sapphire", "Amethyst"],
  Pisces: ["Yellow Sapphire", "Aquamarine"]
};

function calculateZodiacSign(birthDate) {
  const date = new Date(birthDate);
  if (isNaN(date)) return null;

  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const padded = `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  for (let i = 0; i < zodiacSigns.length; i++) {
    const { sign, start, end } = zodiacSigns[i];
    const startDate = new Date(`2020-${start}`);
    const endDate = new Date(`2020-${end}`);
    const inputDate = new Date(`2020-${padded}`);

    if (start > end) {
      if (
        (inputDate >= startDate && inputDate <= new Date("2020-12-31")) ||
        (inputDate >= new Date("2020-01-01") && inputDate <= endDate)
      ) {
        return {
          sign,
          cusp: getCusp(month, day),
          compatible: compatibility[sign],
          stones: gemstones[sign]
        };
      }
    } else if (inputDate >= startDate && inputDate <= endDate) {
      return {
        sign,
        cusp: getCusp(month, day),
        compatible: compatibility[sign],
        stones: gemstones[sign]
      };
    }
  }
  return null;
}

function getCusp(month, day) {
  const cuspWindow = 2;
  for (const z of zodiacSigns) {
    const [startMonth, startDay] = z.start.split("-").map(Number);
    const [endMonth, endDay] = z.end.split("-").map(Number);

    const isCuspStart = month === startMonth && Math.abs(day - startDay) <= cuspWindow;
    const isCuspEnd = month === endMonth && Math.abs(day - endDay) <= cuspWindow;

    if (isCuspStart || isCuspEnd) {
      return `Cusp of ${z.sign}`;
    }
  }
  return null;
}

function generateZodiacInfo(birthDate) {
  const result = calculateZodiacSign(birthDate);
  if (!result) return "Invalid date or format";

  let message = `🌟 Your Zodiac Sign: ${result.sign}\n`;
  if (result.cusp) message += `⚖️ Cusp Info: ${result.cusp}\n`;
  message += `❤️ Compatible With: ${result.compatible.join(", ")}\n`;
  message += `💎 Recommended Gemstones: ${result.stones.join(", ")}`;

  return message;
}

function calculateMoonAndRising(birthDate, birthTime, location) {
  return {
    moonSign: "(coming soon)",
    risingSign: "(coming soon)"
  };
}

// Form Integration with HTML

document.getElementById("zodiacForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const birthdate = document.getElementById("birthdate").value;
  const result = calculateZodiacSign(birthdate);

  if (!result) {
    document.getElementById("error").classList.remove("hidden");
    document.getElementById("error").textContent = "Please enter a valid birthdate.";
    document.getElementById("result").classList.add("hidden");
    return;
  }

  document.getElementById("error").classList.add("hidden");
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("sign").textContent = result.sign;
  document.getElementById("dateRange").textContent = `${zodiacSigns.find(z => z.sign === result.sign).start} - ${zodiacSigns.find(z => z.sign === result.sign).end}`;
  document.getElementById("element").textContent = getElement(result.sign);
  document.getElementById("symbol").textContent = getSymbol(result.sign);
  document.getElementById("insight").textContent = `Gemstones: ${result.stones.join(", ")} | Compatible with: ${result.compatible.join(", ")}`;
});

function getElement(sign) {
  const elements = {
    Fire: ["Aries", "Leo", "Sagittarius"],
    Earth: ["Taurus", "Virgo", "Capricorn"],
    Air: ["Gemini", "Libra", "Aquarius"],
    Water: ["Cancer", "Scorpio", "Pisces"]
  };
  for (const [element, signs] of Object.entries(elements)) {
    if (signs.includes(sign)) return element;
  }
  return "";
}

function getSymbol(sign) {
  const symbols = {
    Aries: "♈",
    Taurus: "♉",
    Gemini: "♊",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Scorpio: "♏",
    Sagittarius: "♐",
    Capricorn: "♑",
    Aquarius: "♒",
    Pisces: "♓"
  };
  return symbols[sign] || "";
}


// Optional: Restrict date input to valid range
const dateInput = document.getElementById("birthdate");
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("max", today);
  dateInput.setAttribute("min", "1900-01-01");
}
