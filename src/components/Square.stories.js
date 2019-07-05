import React from 'react';
import { storiesOf } from '@storybook/react';
import Square from './Square';
import { Container } from './Elements';

storiesOf('Square', module)
  .add('blank box', () => <Square icon={'TIMES'} />)
  .add('grid', () => <Container>{new Array(9).fill(<Square icon='TIMES' />)}</Container>);
