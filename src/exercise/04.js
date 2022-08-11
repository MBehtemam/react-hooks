// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import { useLocalStorageState } from '../utils';

function Board({squares, onSelectSquare, onRestart}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onSelectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={onRestart}>
        restart
      </button>
    </div>
  )
}

function HistorySteps({steps, currentStep, onGoToHistoryStep}){
  return <ul>
    {steps.map((stepSquares, step) => <li key={step}>
      <button onClick={()=> onGoToHistoryStep(step)} disabled={step === currentStep}>{step === 0 ? 'Go to game start' : `Go to move #${step}`} {step === currentStep ? '(current)': null}</button>
    </li>)}
  </ul>
}

function DisplayStatus({status}) {
   return <div className="status">{status}</div>
}

function Game() {

  const [history, setHistory] = useLocalStorageState('tic-tac-toe-history', [Array(9).fill(null)]);
  const [historyCurrentStep, setHistoryCurrentStep] = useLocalStorageState('tic-tac-toe-history-current-step', 0);
  const currentSquares = history[historyCurrentStep];
  const nextValue =  calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    if(winner || currentSquares[square]) {
      return;
    }
    const squaresCopy = [...currentSquares];
    squaresCopy[square] = nextValue;
    const newHistory = history.slice(0, historyCurrentStep + 1)
    setHistory([...newHistory, squaresCopy]);
    setHistoryCurrentStep(history.length);
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setHistoryCurrentStep(0);
  }

  function goToHistoryStep(step) {
    setHistoryCurrentStep(step);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onSelectSquare={selectSquare} squares={currentSquares} onRestart={restart} />
      </div>
        <div className="game-info">
          <DisplayStatus status={status} />
          <HistorySteps steps={history} currentStep={historyCurrentStep} onGoToHistoryStep={goToHistoryStep} />
        </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
