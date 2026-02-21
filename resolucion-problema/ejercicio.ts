/**
 * Esta solución es 'shuffle and select', pero podría haber otros enfoques como:
 * - Select and delete
 * - Select and track
 * 
 * En la práctica podríamos considerar el rendimiento y la memoria dependiendo del tamaño del array y del valor de n.
 * 
 * Fuentes vistas en internet:
 * - https://www.geeksforgeeks.org/dsa/shuffle-a-given-array-using-fisher-yates-shuffle-algorithm/
 * - https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-226.php
 * - https://labex.io/tutorials/n-random-elements-in-array-28503
 * - https://www.bennadel.com/blog/724-cfquiz-2-13-selecting-n-random-elements-from-an-array-in-coldfusion.htm
 * 
 */

function draw<T>(array: T[], n: number): T[] {
  // Algoritmo de Fisher-Yates para barajar el array
  let m = array.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [array[m], array[i]] = [array[i], array[m]];
  }

  // Retornar los primeros n elementos del array barajado
  return array.slice(0, n);
}

// Ejemplos de uso
console.log(draw(['A', 'B', 'C', 'D'], 2)); // Ejemplo 1
console.log(draw([4, 8, 15, 16, 23, 42], 3)); // Ejemplo 2
