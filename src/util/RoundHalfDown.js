export default function roundHalfDown(num, decimals = 2) {
    const factor = Math.pow(10, decimals);
    const n = num * factor;
    const fractional = n - Math.floor(n);
  
    // If exactly halfway (e.g. 0.5), round down
    if (fractional === 0.5) {
      return Math.floor(n) / factor;
    }
  
    // Otherwise, normal rounding
    return Math.round(n) / factor;
  }
  

  