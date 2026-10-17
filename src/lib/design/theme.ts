/** The site theme follows the visitor's local time; there is no manual switch. */

/** Local hours that use the dark theme: from DARK_FROM (inclusive) until LIGHT_FROM. */
export const LIGHT_FROM = 8;
export const DARK_FROM = 18;

/** 'dark' from 18:00 to 08:00 local time, 'light' from 08:00 to 18:00. */
export function themeForHour(hour: number): 'light' | 'dark' {
  return hour >= LIGHT_FROM && hour < DARK_FROM ? 'light' : 'dark';
}

/**
 * Runs before first paint: sets the theme from the visitor's local time, then
 * switches it at the next 08:00 or 18:00 while the page stays open. Nothing
 * is stored.
 */
export const THEME_SCRIPT = `(function(){function a(){var d=new Date(),h=d.getHours();document.documentElement.setAttribute('data-theme',h>=${LIGHT_FROM}&&h<${DARK_FROM}?'light':'dark');var n=new Date(d);n.setHours(h<${LIGHT_FROM}?${LIGHT_FROM}:h<${DARK_FROM}?${DARK_FROM}:${LIGHT_FROM}+24,0,5,0);setTimeout(a,n-d)}try{a()}catch(e){}})();`;
