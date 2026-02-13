import './SessionInfo.css'

interface SessionInfoProps {
  completedSessions: number
  mode: 'work' | 'break' | 'longBreak'
  modeLabel: string
}

function SessionInfo({ completedSessions }: SessionInfoProps) {
  const dots = Array.from({ length: 4 }, (_, i) => i < (completedSessions % 4))

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
        {completedSessions} セッション完了
      </span>
    </div>
  )
}

export default SessionInfo
