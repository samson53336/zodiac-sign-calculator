/* ------------------------------------------------------
   zodiac-data.js  ➜ Pure data module (can be auto-tested)
------------------------------------------------------- */
export const ZODIAC_SIGNS = [
  { name: 'Capricorn',  symbol: '♑', element: 'Earth',    start: [12, 22], end: [ 1, 19] },
  { name: 'Aquarius',   symbol: '♒', element: 'Air',      start: [ 1, 20], end: [ 2, 18] },
  { name: 'Pisces',     symbol: '♓', element: 'Water',    start: [ 2, 19], end: [ 3, 20] },
  { name: 'Aries',      symbol: '♈', element: 'Fire',     start: [ 3, 21], end: [ 4, 19] },
  { name: 'Taurus',     symbol: '♉', element: 'Earth',    start: [ 4, 20], end: [ 5, 20] },
  { name: 'Gemini',     symbol: '♊', element: 'Air',      start: [ 5, 21], end: [ 6, 20] },
  { name: 'Cancer',     symbol: '♋', element: 'Water',    start: [ 6, 21], end: [ 7, 22] },
  { name: 'Leo',        symbol: '♌', element: 'Fire',     start: [ 7, 23], end: [ 8, 22] },
  { name: 'Virgo',      symbol: '♍', element: 'Earth',    start: [ 8, 23], end: [ 9, 22] },
  { name: 'Libra',      symbol: '♎', element: 'Air',      start: [ 9, 23], end: [10, 22] },
  { name: 'Scorpio',    symbol: '♏', element: 'Water',    start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius',symbol: '♐', element: 'Fire',     start: [11, 22], end: [12, 21] }
];

/* Daily insights or any other metadata can live in a
   separate JSON file that you fetch asynchronously.
*/

/* ------------------------------------------------------
   zodiac-service.js ➜ Validation & core calculations
------------------------------------------------------- */
import { ZODIAC_SIGNS } from './zodiac-data.js';

export class ZodiacService {
  static #MIN_DATE = new Date('1900-01-01');

  /** Validate and normalise input to a Date object */
  static parseBirthDate(value) {
    if (!value) throw new Error('Please select a birth date');
    const date = new Date(value);
    if (Number.isNaN(date)) throw new Error('Invalid date format');
    if (date > new Date()) throw new Error('Birth date cannot be in the future');
    if (date < this.#MIN_DATE) throw new Error('Birth date too far in the past');
    return date;
  }

  /** Return full zodiac record (name, symbol, element, etc.) */
  static getZodiac(date) {
    const m = date.getUTCMonth() + 1;    // 1-based
    const d = date.getUTCDate();

    for (const sign of ZODIAC_SIGNS) {
      const [sm, sd] = sign.start;
      const [em, ed] = sign.end;

      const crossesYear = sm > em; // e.g. Capricorn
      const afterStart  = (m === sm && d >= sd) || (m > sm && (!crossesYear || m <= 12));
      const beforeEnd   = (m === em && d <= ed) || (m < em || (crossesYear && m >= 1));

      if (crossesYear ? (afterStart || beforeEnd) : (afterStart && beforeEnd)) {
        return sign;
      }
    }
    throw new Error('Unable to determine zodiac sign');
  }

  /** Utility for “March 21 – April 19” style ranges */
  static formatRange({ start, end }) {
    const monthNames = [ '', 'January','February','March','April','May','June',
                         'July','August','September','October','November','December' ];
    return `${monthNames[start[0]]} ${start[1]} – ${monthNames[end[0]]} ${end[1]}`;
  }
}

/* ------------------------------------------------------
   app.js ➜ DOM wiring (kept tiny)
------------------------------------------------------- */
import { ZodiacService } from './zodiac-service.js';

document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('zodiacForm');
  const out    = id => document.getElementById(id);
  const hidden = el => el.classList.add('hidden');
  const show   = el => el.classList.remove('hidden');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    ['result','error'].forEach(id => hidden(out(id)));

    try {
      const bd   = ZodiacService.parseBirthDate(out('birthdate').value);
      const sign = ZodiacService.getZodiac(bd);

      out('sign').textContent      = sign.name;
      out('symbol').textContent    = sign.symbol;
      out('element').textContent   = sign.element;
      out('dateRange').textContent = ZodiacService.formatRange(sign);
      // out('insight').textContent = fetchedInsight[sign.name]; // optional

      show(out('result'));
    } catch (err) {
      out('error').textContent = err.message;
      show(out('error'));
    }
  });
});
