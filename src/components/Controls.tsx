import './Controls.css'

interface ControlsProps {
  isRunning: boolean
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  mode: 'work' | 'break' | 'longBreak'
}

function Controls({ isRunning, onStart, onPause, onReset, onSkip }: ControlsProps) {
  return (
    <div className="controls">
      <button
        className="controls__primary"
        onClick={isRunning ? onPause : onStart}
      >
        {isRunning ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <rect x="4" y="3" width="3.5" height="12" rx="1.2" />
            <rect x="10.5" y="3" width="3.5" height="12" rx="1.2" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M5.5 3.2a1 1 0 011.5-.86l8 4.8a1 1 0 010 1.72l-8 4.8A1 1 0 015.5 12.8V3.2z" />
          </svg>
        )}
        {isRunning ? '一時停止' : '開始'}
      </button>
      <div className="controls__secondary">
        <button className="controls__ghost" onClick={onReset}>
          リセット
        </button>
        <span className="controls__dot" />
        <button className="controls__ghost" onClick={onSkip}>
          スキップ
        </button>
      </div>
    </div>
  )
}

export default Controls
