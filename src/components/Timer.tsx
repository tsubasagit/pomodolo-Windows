import './Timer.css'

interface TimerProps {
  timeLeft: number
  progress: number
  mode: 'work' | 'break' | 'longBreak'
}

function Timer({ timeLeft, progress }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const size = 240
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="timer">
      <div className="timer__glow" />
      <svg className="timer__svg" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--active-color)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--active-color)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle
          className="timer__track"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className="timer__progress"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="url(#progress-gradient)"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div className="timer__display">
        <span className="timer__time">{display}</span>
      </div>
    </div>
  )
}

export default Timer
