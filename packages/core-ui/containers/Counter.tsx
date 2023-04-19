import React from 'react';
import { Button } from '../components/Button/Button';
import { Text } from '../components/Text/Text';
import useStore, { useCounterStore } from '../store';

export default function Counter() {
  const { loading, counter, increment, decrement, reset } = useStore(
    useCounterStore,
    (state) => state
  );
  if (loading) return <div></div>;

  return (
    <div>
      <Button onClick={() => decrement(1)}>-</Button>
      <Text>{counter}</Text>
      <Button onClick={() => increment(1)}>+</Button>
      <Button onClick={reset}>0</Button>
    </div>
  );
}
