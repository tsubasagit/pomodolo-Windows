import { useState, useEffect, useCallback, useRef } from 'react'
import Timer from './components/Timer'
import Controls from './components/Controls'
import SessionInfo from './components/SessionInfo'
import './App.css'

type TimerMode = 'work' | 'break' | 'longBreak'

const DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
}

const MODE_LABELS: Record<TimerMode, string> = {
  work: '集中',
  break: '休憩',
  longBreak: '長休憩',
}

function playNotificationSound() {
  const audioCtx = new AudioContext()
  const frequencies = [523.25, 659.25, 783.99]

  frequencies.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.frequency.value = freq
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.25)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.25 + 0.6)
    oscillator.start(audioCtx.currentTime + i * 0.25)
    oscillator.stop(audioCtx.currentTime + i * 0.25 + 0.6)
  })
}

function App() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(DURATIONS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const totalTime = DURATIONS[mode]
  const progress = (totalTime - timeLeft) / totalTime

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(DURATIONS[newMode])
    setIsRunning(false)
  }, [])

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    playNotificationSound()

    const modeLabel = MODE_LABELS[mode]
    const title = `${modeLabel}終了`
    const body = mode === 'work'
      ? 'お疲れさまでした。少し休みましょう'
      : '休憩終了です。次のセッションを始めましょう'

    if (window.electronAPI) {
      window.electronAPI.showNotification(title, body)
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body })
    }

    if (mode === 'work') {
      const newCount = completedSessions + 1
      setCompletedSessions(newCount)
      if (newCount % 4 === 0) {
        switchMode('longBreak')
      } else {
        switchMode('break')
      }
    } else {
      switchMode('work')
    }
  }, [mode, completedSessions, switchMode])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleTimerComplete()
    }
  }, [timeLeft, isRunning, handleTimerComplete])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(DURATIONS[mode])
  }
  const handleSkip = () => handleTimerComplete()

  return (
    <div className={`app app--${mode}`}>
      <div className="titlebar">
        <span className="titlebar__label">{MODE_LABELS[mode]}</span>
        <button
          className="titlebar__close"
          onClick={() => window.electronAPI?.closeWindow()}
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <main className="app__main">
        <Timer
          timeLeft={timeLeft}
          progress={progress}
          mode={mode}
        />
        <Controls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onSkip={handleSkip}
          mode={mode}
        />
        <SessionInfo
          completedSessions={completedSessions}
          mode={mode}
          modeLabel={MODE_LABELS[mode]}
        />
      </main>
    </div>
  )
}

export default App
