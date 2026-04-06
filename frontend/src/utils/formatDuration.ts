/**
 * Format seconds to human-readable duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted string: "1:23:45" or "23:45"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0:00'

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')

  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`
}

/**
 * Format seconds to short readable string
 * @param {number} seconds
 * @returns {string} - "45 daqiqa" or "1 soat 30 daqiqa"
 */
export function formatDurationText(seconds) {
  if (!seconds || seconds <= 0) return '0 daqiqa'

  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)

  if (h > 0 && m > 0) return `${h} soat ${m} daqiqa`
  if (h > 0) return `${h} soat`
  return `${m} daqiqa`
}

/**
 * Format total course duration from array of video seconds
 * @param {number[]} durations
 * @returns {string}
 */
export function formatCourseDuration(durations = []) {
  const total = durations.reduce((sum, d) => sum + (d || 0), 0)
  return formatDurationText(total)
}
