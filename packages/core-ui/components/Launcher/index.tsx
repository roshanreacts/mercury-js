import React, { useState } from 'react';
import { AiFillAppstore } from 'react-icons/ai';
import { Button } from '../Button';
import { Paper } from '../Paper';
import { Box, BoxAnimate } from '../Box';

export const Launcher = ({ children }) => {
  const [panel, setPanel] = useState(false);
  return (
    <Box>
      <Paper>
        <Box
          width={330}
          css={{
            position: 'relative',
          }}
        >
          <Box
            fgColor={11}
            width={50}
            onMouseEnter={() => setPanel(true)}
            onMouseLeave={() => setPanel(false)}
          >
            <AiFillAppstore size={35} />
          </Box>
          <BoxAnimate
            css={{
              position: 'absolute',
              top: 50,
            }}
            onMouseEnter={() => setPanel(true)}
            onMouseLeave={() => setPanel(false)}
            elevation={1}
            br={1}
            p={1}
            ml={-1}
            animate={{ scaleX: panel ? 1 : 0, scaleY: panel ? 1 : 0 }}
          >
            {children}
          </BoxAnimate>
        </Box>
      </Paper>
    </Box>
  );
};
