import './SessionInfo.css'

interface SessionInfoProps {
  completedSessions: number
  mode: 'work' | 'break' | 'longBreak'
  modeLabel: string
}

function SessionInfo({ completedSessions }: SessionInfoProps) {
  const currentCycle = completedSessions % 4
  const fullCycles = Math.floor(completedSessions / 4)
  const dots = Array.from({ length: 4 }, (_, i) => i < currentCycle)

  return (
    <div className="session-info">
      <div className="session-info__dots">
        {dots.map((filled, i) => (
          <span
            key={i}
            className={`session-info__dot ${filled ? 'session-info__dot--filled' : ''}`}
          />
        ))}
      </div>
      <span className="session-info__count">
        {completedSessions > 0
          ? `${completedSessions} セッション${fullCycles > 0 ? ` (${fullCycles} サイクル)` : ''}`
          : 'さあ、始めましょう'
        }
      </span>
    </div>
  )
}

export default SessionInfo
