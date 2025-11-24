import { useEffect, useState } from 'react'

interface WaveformInfo {
  samples: number[]
  pngDuration: number
  waveformStart: number
  maxSample: number
}

/** Convert PNG → JSON URL */
function toJsonUrl(pngUrl: string) {
  if (!pngUrl.endsWith('.png')) return null
  return pngUrl.replace('.png', '.json')
}

/** Safe fetch */
async function tryFetchJson(url: string) {
  const res = await fetch(url)
  if (!res.ok) return null
  return await res.json()
}

/** 🔥 INTERPOLATION (fixes truncated waveform) */
function interpolate(samples: number[], targetCount: number) {
  const result = []
  const scale = (samples.length - 1) / (targetCount - 1)

  for (let i = 0; i < targetCount; i++) {
    const index = i * scale
    const left = Math.floor(index)
    const right = Math.ceil(index)
    const ratio = index - left

    const value = samples[left] * (1 - ratio) + samples[right] * ratio

    result.push(value)
  }

  return result
}

export function useWaveform(
  waveformUrl: string | null | undefined,
  audioDuration: number
) {
  const [info, setInfo] = useState<WaveformInfo | null>(null)

  useEffect(() => {
    if (!waveformUrl || !audioDuration) return

    async function loadWaveform() {
      // Try hi-res → fallback
      const base = waveformUrl.replace(/_(s|m|l)\.png$/, '')
      const candidates = [
        `${base}_xl.png`,
        `${base}_l.png`,
        `${base}_m.png`,
        `${base}_s.png`,
      ]

      let json = null

      for (const png of candidates) {
        const jsonUrl = toJsonUrl(png)
        if (!jsonUrl) continue

        json = await tryFetchJson(jsonUrl)
        if (json) break
      }

      if (!json) {
        console.warn('❌ No valid waveform JSON found for', waveformUrl)
        setInfo(null)
        return
      }

      // Debug
      console.log('=== Waveform Debug ===')
      console.log('Count:', json.samples.length)
      console.log('Min:', Math.min(...json.samples))
      console.log('Max:', Math.max(...json.samples))

      const pngDuration = json.duration ?? audioDuration
      const waveformStart = Math.max(0, audioDuration - pngDuration)

      const targetBars = 400 // 300–500 looks great

      setInfo({
        samples: interpolate(json.samples, targetBars),
        pngDuration,
        waveformStart,
        maxSample: Math.max(...json.samples),
      })
    }

    loadWaveform()
  }, [waveformUrl, audioDuration])

  return info
}
