import confetti from 'canvas-confetti'

interface ConfettiConfig {
    duration?: number
    startVelocity?: number
    spread?: number
    ticks?: number
    zIndex?: number
    colors?: string[]
    particleCount?: number
}

const DEFAULT_CONFIG: Required<ConfettiConfig> = {
    duration: 1500,
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 9999,
    colors: ['#0054A5', '#2788CE', '#FFD700', '#FF6B9D', '#00D4FF', '#B794F6'],
    particleCount: 50
}

const randomInRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min
}

export const fireLuxuryConfetti = (config: ConfettiConfig = {}): void => {
    const settings = { ...DEFAULT_CONFIG, ...config }
    const animationEnd = Date.now() + settings.duration
    const defaults = {
        startVelocity: settings.startVelocity,
        spread: settings.spread,
        ticks: settings.ticks,
        zIndex: settings.zIndex
    }

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
            clearInterval(interval)
            return
        }

        const particleCount = settings.particleCount * (timeLeft / settings.duration)

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: settings.colors
        })

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: settings.colors
        })
    }, 250)
}

export const fireSimpleConfetti = (config: ConfettiConfig = {}): void => {
    const settings = { ...DEFAULT_CONFIG, ...config }

    confetti({
        particleCount: settings.particleCount,
        spread: settings.spread,
        origin: { y: 0.6 },
        colors: settings.colors,
        zIndex: settings.zIndex
    })
}

export const fireCelebrationConfetti = (): void => {
    const count = 200
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
    }

    const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
        })
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    })

    fire(0.2, {
        spread: 60,
    })

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    })

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    })

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    })
}