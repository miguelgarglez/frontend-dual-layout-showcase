export const formatScore = (value: number) =>
  value.toLocaleString('es-ES', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  })
